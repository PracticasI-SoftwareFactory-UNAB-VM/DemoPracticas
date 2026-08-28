from enum import Enum

from pydantic import BaseModel, ConfigDict


class MoscowPriority(str, Enum):
    MUST = "MUST"
    SHOULD = "SHOULD"
    COULD = "COULD"
    WONT = "WONT"


class UserStoryBase(BaseModel):
    role: str
    want: str
    benefit: str
    acceptance_criteria: list[str] = []
    moscow: MoscowPriority = MoscowPriority.MUST


class UserStoryCreate(UserStoryBase):
    pass


class UserStoryUpdate(BaseModel):
    role: str | None = None
    want: str | None = None
    benefit: str | None = None
    acceptance_criteria: list[str] | None = None
    moscow: MoscowPriority | None = None
    completed: bool | None = None


class UserStoryOut(UserStoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed: bool
