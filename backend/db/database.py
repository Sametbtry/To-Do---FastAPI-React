from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///db/my_db.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread":False})

Base = declarative_base() 

sessionLocal = sessionmaker(autoflush= False, autocommit= False, bind= engine)



