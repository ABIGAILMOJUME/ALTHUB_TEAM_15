import uuid
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.sql.sqltypes import TIMESTAMP, Text
from database import Base
from schemas.pickup import PickupStatus
from schemas.report import ReportStatus
from schemas.user import Role


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True, nullable=False)
    name = Column(String,  nullable=False)
    email = Column(String, unique=True,  nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(Role), default=Role.USER)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    pickup_requests = relationship("PickupRequest", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")


class PickupRequest(Base):
    __tablename__ = "pickup_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    location = Column(String, nullable=False)
    waste_type = Column(String, nullable=False)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(PickupStatus), default=PickupStatus.PENDING)
    image_path = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="pickup_requests")


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    location = Column(String, nullable=False)
    issue_type = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(ReportStatus), default=ReportStatus.OPEN)
    image_path = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="reports")


class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    token = Column(String, primary_key=True)
    blacklisted_at = Column(DateTime(timezone=True), server_default=func.now())