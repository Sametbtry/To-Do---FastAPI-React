from fastapi import FastAPI, Depends
from db.database import engine, Base, sessionLocal
from db.models import Todo
from pydantic import BaseModel
from sqlalchemy import delete

Base.metadata.create_all(bind= engine)

class CreateTodo(BaseModel):
    title : str
    state : bool

app = FastAPI()

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return "root dizin"

@app.get("/todos")
def todos(db = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@app.post("/todos")
def add_todos(new_todo : CreateTodo, db= Depends(get_db)):
    add_todo = Todo(**new_todo.model_dump())
    db.add(add_todo)
    db.commit()
    return {"message" : "yeni satir eklendi"}


@app.get("/delete")
def delete_data(db=Depends(get_db)):
    try:
        statement = delete(Todo)
        query = str(statement)
        db.execute(statement)
        db.commit()
    except Exception as e:
        return str(e)
    return {
        "msg" : "veriler silindi",
        "sorgu" : query}
