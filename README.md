# To-Do  (FastAPI & React)

Bu proje; temel düzeyde web servislerin nasıl kullanıldığını görmek, frontend ve backend entegrasyonunu sağlamak ve veritabanı yönetimini uygulamalı olarak deneyimlemek amacıyla geliştirilmiş egitim amaclı bir full-stack To-Do uygulamasıdır.

## 🚀 Özellikler
* Yeni görev (to-do) ekleme
* Var olan görevleri listeleme
* Görev durumunu veya başlığını güncelleme
* Belirli bir görevi silme
* Tek tıkla tüm görevleri veritabanından temizlemesi

## 🛠️ Kullanılan Teknolojiler
* **Backend:** Python, FastAPI, Uvicorn
* **Veritabanı:** SQLite, SQLAlchemy (ORM)
* **Frontend:** React.js

## 🔌 API Endpoints

| Metot  | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET`  | `/` | Root dizini kontrolü |
| `GET`  | `/todos` | Veritabanındaki tüm görevleri getirir |
| `POST` | `/todos` | Yeni görev ekler. JSON formatında `title` ve `state` bekler |
| `PUT`  | `/todo-update/{id}` | Belirtilen ID'ye sahip görevi günceller |
| `DELETE`| `/todo-delete/{id}` | Belirtilen ID'ye sahip görevi siler |
| `DELETE`| `/delete-all-data` | Veritabanındaki tüm verileri temizler |

## 📂 Proje Yapısı

```text
To-Do---FastAPI-React/
├── backend/
│   ├── db/
│   │   ├── database.py   # Veritabanı bağlantısı ve ayarları
│   │   ├── models.py     # SQLAlchemy veritabanı tabloları/modelleri
│   │   └── my_db.db      # SQLite veritabanı dosyası (otomatik oluşur)
│   └── main.py           # FastAPI uç noktaları (Endpoints) ve yapılandırma
└── frontend/
    ├── public/
    └── src/              # React bileşenleri ve API çağrıları
        ├── App.js         
        ├── index.css  
        └── index.js          
```

## 💻 Kurulum ve Çalıştırma

Projeyi yerel ortamında çalıştırmak için aşağıdaki adımları izle. Bilgisayarında **Python** ve **Node.js**'in kurulu olduğundan emin ol.

### 1. Backend Kurulumu
Terminade `backend` dizinine git ve gerekli Python kütüphanelerini kur:

```bash
cd backend
pip install fastapi uvicorn sqlalchemy pydantic
```

Sunucuyu başlat:
```bash
uvicorn main:app --reload
```
*Backend sunucusu varsayılan olarak `http://localhost:8000` adresinde çalışacaktır.*
*Swagger UI API dokümantasyonuna `http://localhost:8000/docs` adresinden ulaşabilirsin.*

### 2. Frontend Kurulumu
Yeni bir terminal penceresi aç, `frontend` dizinine git ve bağımlılıkları yükle:

```bash
cd frontend
npm install
```

React uygulamasını başlat:
```bash
npm start
```
*Frontend uygulaması tarayıcında otomatik olarak `http://localhost:3000` adresinde açılacaktır.*
