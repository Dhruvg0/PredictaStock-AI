<div align="center">
  <img src="frontend/public/favicon.svg" alt="PredictaStock AI Logo" width="120" />
</div>

<h1 align="center">PredictaStock AI</h1>

<p align="center">
  <strong>Enterprise-Grade Grocery Stockout Prediction & Inventory Management System</strong>
</p>

<p align="center">
  An AI-powered SaaS platform designed to eliminate supply chain inefficiencies by predicting inventory stockouts before they happen. Built with a modern microservices architecture spanning a highly-responsive React frontend, a robust FastAPI backend, and proprietary machine learning models.
</p>

---

## ✨ Key Features

- **🧠 Machine Learning Forecasting:** Proprietary ML models that predict stock levels based on historical sales data and reorder thresholds.
- **📊 Real-time Dashboard:** Global visibility into cross-store inventory metrics, financial overviews, and at-risk stock.
- **⚡ Instant Alerts:** Automated notification system flagging critical items approaching stockout status.
- **☁️ Bulk Data Ingestion:** Upload CSV inventory datasets in seconds and let the AI process optimal reorder timings.
- **💎 Enterprise UI/UX:** Clean, dark-mode prioritized interface featuring glassmorphic design and fully interactive components.

## 🛠 Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS, Framer Motion
- **Icons:** Lucide React
- **Data Fetching:** TanStack React Query

### Backend
- **API Framework:** FastAPI (Python)
- **Database:** PostgreSQL (via SQLAlchemy ORM)
- **Authentication:** JWT (JSON Web Tokens)

### Machine Learning
- **Environment:** Python Data Science Stack (`ml/` directory)
- **Capabilities:** Time-series forecasting and inventory risk analysis.

---

## 📂 Project Structure

```text
PredictaStock-AI/
├── backend/            # FastAPI application (Routes, Models, Schemas, Database logic)
├── frontend/           # React + Vite application (Pages, Components, Assets)
├── ml/                 # Machine learning models, training scripts, and inference pipelines
├── datasets/           # Sample datasets for training and testing ML models
├── docker/             # Dockerfiles and container configurations
├── docs/               # Technical documentation
└── docker-compose.yml  # Orchestration file for running the entire stack via Docker
```

---

## 🚀 Getting Started

To run the application locally for development, you will need to start both the backend server and the frontend development environment.

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **PostgreSQL** (running locally or via Docker)

### 2. Backend Setup
The backend runs on FastAPI and uses a PostgreSQL database.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server with hot-reload
uvicorn app.main:app --reload
```
*The backend API will be available at `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.*

### 3. Frontend Setup
The frontend is a Vite-powered React application.

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will be accessible at `http://localhost:5173`.*

---

## 🐳 Running with Docker (Quickstart)

If you prefer to run the entire stack (Database, Backend, and Frontend) simultaneously without installing Python or Node.js locally, you can use Docker Compose.

```bash
# From the root directory
docker-compose up -d --build
```

---

## 🔒 Security & Deployment

For deployment to production environments:
1. Ensure `VITE_API_URL` is correctly configured in your frontend `.env`.
2. Secure your PostgreSQL database with strong credentials.
3. Use a managed hosting provider for the frontend (e.g., Vercel, Cloudflare Pages) and backend (e.g., Render, AWS EC2).

---

<p align="center">
  &copy; 2026 PredictaStock Systems Inc. All rights reserved.
</p>
