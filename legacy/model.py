import pandas as pd

def load_and_prepare_data(csv_path):
    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"])
    return df

def compute_daily_store_demand(df):
    daily_store_demand = (
        df.groupby(["date", "store"])["sales"]
        .sum()
        .reset_index()
        .sort_values(["store", "date"])
    )
    return daily_store_demand

def simulate_inventory(daily_store_demand, window=7, safety_days=10):
    daily_store_demand["avg_daily_demand"] = (
        daily_store_demand
        .groupby("store")["sales"]
        .rolling(window=window)
        .mean()
        .reset_index(level=0, drop=True)
    )

    daily_store_demand["estimated_inventory"] = (
        daily_store_demand["avg_daily_demand"] * safety_days
    )

    daily_store_demand["days_of_stock_left"] = (
        daily_store_demand["estimated_inventory"] /
        daily_store_demand["avg_daily_demand"]
    )

    return daily_store_demand

def assign_risk_levels(df):
    def risk_level(days):
        if pd.isna(days):
            return "Unknown"
        elif days < 3:
            return "High Risk"
        elif days < 7:
            return "Medium Risk"
        else:
            return "Low Risk"

    df["risk_level"] = df["days_of_stock_left"].apply(risk_level)
    return df

def get_current_status(df):
    latest_date = df["date"].max()
    return df[df["date"] == latest_date]
