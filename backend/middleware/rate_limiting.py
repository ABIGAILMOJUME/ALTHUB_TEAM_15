# middleware/rate_limiting.py
import time
from collections import defaultdict
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests=100, time_window=60):
        super().__init__(app)
        self.max_requests = max_requests
        self.time_window = time_window
        self.request_counts = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for docs and health endpoints
        if request.url.path in ["/health", "/metrics", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean up old requests
        self.request_counts[client_ip] = [
            req_time for req_time in self.request_counts[client_ip]
            if current_time - req_time < self.time_window
        ]
        
        # Check rate limit
        if len(self.request_counts[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {self.max_requests} requests per {self.time_window} seconds"
            )
        
        # Add current request
        self.request_counts[client_ip].append(current_time)
        
        return await call_next(request)