from app.database.connection import engine, Base

# Import model agar SQLAlchemy mengenali tabel
from app.models.prediction import Prediction


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Tabel database berhasil dibuat!")