from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, get_db, wait_for_db

wait_for_db()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GitHub Actions Demo API - Historias de Usuario")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/user-stories", response_model=list[schemas.UserStoryOut])
def list_user_stories(db: Session = Depends(get_db)):
    return db.query(models.UserStory).order_by(models.UserStory.id).all()


@app.post("/api/user-stories", response_model=schemas.UserStoryOut, status_code=201)
def create_user_story(story: schemas.UserStoryCreate, db: Session = Depends(get_db)):
    db_story = models.UserStory(**story.model_dump())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story


@app.put("/api/user-stories/{story_id}", response_model=schemas.UserStoryOut)
def update_user_story(
    story_id: int, story: schemas.UserStoryUpdate, db: Session = Depends(get_db)
):
    db_story = db.query(models.UserStory).filter(models.UserStory.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="User story not found")

    for field, value in story.model_dump(exclude_unset=True).items():
        setattr(db_story, field, value)

    db.commit()
    db.refresh(db_story)
    return db_story


@app.delete("/api/user-stories/{story_id}", status_code=204)
def delete_user_story(story_id: int, db: Session = Depends(get_db)):
    db_story = db.query(models.UserStory).filter(models.UserStory.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="User story not found")

    db.delete(db_story)
    db.commit()
