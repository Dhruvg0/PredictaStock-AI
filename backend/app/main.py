from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, inventory, forecasting, products, alerts
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(forecasting.router, prefix="/api/forecasting", tags=["forecasting"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
