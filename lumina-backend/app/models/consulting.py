from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    client = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status = Column(String(50), nullable=False)
    critical_path = Column(JSON)

    segments = relationship("Segment", back_populates="problem")
    milestones = relationship("Milestone", back_populates="problem")
    literature_reviews = relationship("LiteratureReview", back_populates="problem")

class Segment(Base):
    __tablename__ = "segments"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("segments.id"), nullable=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    analysis = Column(Text, nullable=True)
    potential_solution = Column(Text, nullable=True)
    status = Column(String(50), nullable=False)
    critical_assumptions = Column(JSON)
    required_data = Column(JSON)
    external_review_required = Column(Boolean, default=False)
    external_review_status = Column(String(50), nullable=True)

    problem = relationship("Problem", back_populates="segments")
    parent = relationship("Segment", remote_side=[id], back_populates="children")
    children = relationship("Segment", back_populates="parent")

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, index=True)
    from_segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)
    to_segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)
    relationship_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

    from_segment = relationship("Segment", foreign_keys=[from_segment_id])
    to_segment = relationship("Segment", foreign_keys=[to_segment_id])

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    due_date = Column(DateTime)
    completed = Column(Boolean, default=False)
    problem_id = Column(Integer, ForeignKey("problems.id"))

    problem = relationship("Problem", back_populates="milestones")

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base_class import Base

class LiteratureReview(Base):
    __tablename__ = "literature_reviews"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    title = Column(String, index=True)
    content = Column(Text)
    source = Column(String)

    problem = relationship("Problem", back_populates="literature_reviews")