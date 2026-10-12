from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from backend.app.database.connection import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    image_path = Column(String(255), nullable=False)

    prediction = Column(String(50), nullable=False)

    confidence = Column(Float, nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )