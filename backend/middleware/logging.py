import logging
import time
import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("api")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = request.client.host if request.client else "unknown"
        
        # Skip health checks from detailed logging
        if request.url.path in ["/health", "/metrics"]:
            return await call_next(request)
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            log_data = {
                "client_ip": client_ip,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time": round(process_time, 4),
                "user_agent": request.headers.get("user-agent", ""),
            }
            
            if response.status_code >= 400:
                logger.warning(json.dumps(log_data))
            else:
                logger.info(json.dumps(log_data))
                
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(json.dumps({
                "client_ip": client_ip,
                "method": request.method,
                "path": request.url.path,
                "error": str(e),
                "process_time": round(process_time, 4),
            }))
            raise