from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db.database import Base, engine, sessionLocal
from db.models import Todo

Base.metadata.create_all(bind=engine)

class CreateTodo(BaseModel):
    title: str
    state: bool

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

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
def todos(db=Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@app.post("/todos")
def add_todos(new_todo: CreateTodo, db=Depends(get_db)):
    add_todo = Todo(**new_todo.model_dump())
    db.add(add_todo)
    db.commit()
    return {"message": "yeni satir eklendi"}


@app.delete("/delete-all-data")
def delete_data(db=Depends(get_db)):
    try:
        db.query(Todo).delete()
        db.commit()
    except Exception as e:
        return str(e)

    return {"msg": "veriler silindi"}

@app.put("/todo-update/{request_todo_id}")
def todo_update(
    request_todo_id: int,
    request_todo: CreateTodo,
    db=Depends(get_db),
):
    todo_item = db.query(Todo).filter(Todo.id == request_todo_id).first()
    if todo_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    todo_item.title = request_todo.model_dump()["title"]
    todo_item.state = request_todo.model_dump()["state"]
    db.add(todo_item)
    db.commit()
    return "satir guncellendi"

@app.delete("/todo-delete/{request_todo_id}")
def todo_delete(request_todo_id: int, db=Depends(get_db)):
    remove_todo = db.query(Todo).filter(request_todo_id == Todo.id).first()
    if remove_todo is None:
        raise HTTPException(status_code=404, detail="ID bulunamadi")

    db.delete(remove_todo)
    db.commit()
    return "basariyla silindi"