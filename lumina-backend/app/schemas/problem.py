from pydantic import BaseModel
from typing import Optional

class ProblemBase(BaseModel):
    title: str
    description: str
    client: str
    status: str

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(ProblemBase):
    pass

class Problem(ProblemBase):
    id: int

    class Config:
        orm_mode = True