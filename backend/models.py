import uuid
from sqlalchemy.orm import relationship
from sqlalchemy import Column, UUID, String, ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP, Integer, Text, Float, DateTime, Boolean

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone = True), nullable=False, server_default="now()")

    pickup_requests = relationship("PickupRequest", back_populates="user")


class PickupRequest(Base):
    __tablename__ = "pickup_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    location = Column(String, nullable=False)
    waste_type = Column(String, nullable=False)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="pending")
    image_path = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default="now()")

    user = relationship("User", back_populates="pickup_requests")


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    location = Column(String, nullable=False)
    issue_type = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="open")
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default="now()")

    user = relationship("User")


