# AI Grocery Stockout System

A production-grade SaaS-level AI inventory forecasting platform that helps grocery stores minimize stockouts and overstock by accurately predicting demand using Machine Learning.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python) + SQLAlchemy
- **Database**: PostgreSQL
- **ML Engine**: Scikit-Learn + XGBoost + MLFlow

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend dev)
- Python 3.11 (for local backend dev)

### Running with Docker Compose
1. Ensure Docker is running.
2. Run `docker-compose up --build`
3. Access the Frontend at `http://localhost:5173`
4. Access Backend API at `http://localhost:8000/docs`

### Local Setup (Without Docker)

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/seed_db.py
uvicorn app.main:app --reload
```

#### ML Pipeline
```bash
cd ml
pip install -r requirements.txt
python train.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Real ML Forecasting**: Predicts next-day demand using XGBoost.
- **Enterprise-Grade Database**: Fully relational PostgreSQL structure for stores, products, inventory, and transactions.
- **Modern Dashboard**: High-quality UI using Tailwind CSS, Recharts, and Framer Motion.
- **Bulk Upload**: Easily upload CSVs for bulk product processing.
