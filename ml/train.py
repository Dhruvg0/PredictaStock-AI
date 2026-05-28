import os
import sys
import pandas as pd
import numpy as np
import mlflow
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

# For DB connection
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app.db.session import engine

def load_data():
    query = """
    SELECT t.date, t.store_id, t.product_id, t.quantity, 
           p.price, p.cost, s.capacity
    FROM transactions t
    JOIN products p ON t.product_id = p.id
    JOIN stores s ON t.store_id = s.id
    WHERE t.transaction_type = 'SALE'
    """
    try:
        df = pd.read_sql(query, con=engine)
        if df.empty:
            print("No transaction data found in database. Please run seeder and simulate transactions.")
            # For now, generate fake data to test the pipeline
            df = generate_fake_data()
    except Exception as e:
        print(f"Failed to load from DB: {e}. Generating fake data.")
        df = generate_fake_data()
    return df

def generate_fake_data():
    dates = pd.date_range(start="2023-01-01", periods=100)
    data = []
    for d in dates:
        for store in [1, 2, 3]:
            for prod in [1, 2, 3, 4, 5]:
                data.append({
                    "date": d,
                    "store_id": store,
                    "product_id": prod,
                    "quantity": np.random.randint(10, 100),
                    "price": np.random.uniform(1.0, 5.0),
                    "cost": np.random.uniform(0.5, 3.0),
                    "capacity": 5000
                })
    return pd.DataFrame(data)

def engineer_features(df):
    df["date"] = pd.to_datetime(df["date"])
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["is_weekend"] = df["day_of_week"].apply(lambda x: 1 if x >= 5 else 0)
    
    # We want to predict tomorrow's quantity based on today's features
    df = df.sort_values(by=["store_id", "product_id", "date"])
    df["lag_1"] = df.groupby(["store_id", "product_id"])["quantity"].shift(1)
    df["lag_7"] = df.groupby(["store_id", "product_id"])["quantity"].shift(7)
    df["rolling_mean_7"] = df.groupby(["store_id", "product_id"])["quantity"].transform(lambda x: x.rolling(7).mean())
    
    df = df.dropna()
    return df

def train_model():
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    mlflow.set_experiment("stockout_prediction")
    
    print("Loading data...")
    df = load_data()
    print("Engineering features...")
    df = engineer_features(df)
    
    features = ["store_id", "product_id", "price", "day_of_week", "month", "is_weekend", "lag_1", "lag_7", "rolling_mean_7"]
    target = "quantity"
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    with mlflow.start_run():
        print("Training model...")
        model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        
        mlflow.log_metric("mae", mae)
        mlflow.log_metric("rmse", rmse)
        mlflow.xgboost.log_model(model, "model")
        
        print(f"Model trained! MAE: {mae:.2f}, RMSE: {rmse:.2f}")
        
        # Save locally for inference without mlflow server
        os.makedirs("models", exist_ok=True)
        joblib.dump(model, "models/xgboost_model.pkl")

if __name__ == "__main__":
    train_model()
