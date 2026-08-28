import enum

from sqlalchemy import JSON, Boolean, Column, Enum, Integer, String

from .database import Base


class MoscowPriority(str, enum.Enum):
    MUST = "MUST"
    SHOULD = "SHOULD"
    COULD = "COULD"
    WONT = "WONT"


class UserStory(Base):
    __tablename__ = "user_stories"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(255), nullable=False)  # Como...
    want = Column(String(255), nullable=False)  # Quiero...
    benefit = Column(String(255), nullable=False)  # Para qué...
    acceptance_criteria = Column(JSON, nullable=False, default=list)
    moscow = Column(Enum(MoscowPriority), nullable=False, default=MoscowPriority.MUST)
    completed = Column(Boolean, default=False, nullable=False)
