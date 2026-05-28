import streamlit as st
from model import (
    load_and_prepare_data,
    compute_daily_store_demand,
    simulate_inventory,
    assign_risk_levels,
    get_current_status
)

st.set_page_config(
    page_title="AI Grocery Stock-Out Monitor",
    layout="wide"
)

st.title("🛒 AI Grocery Stock-Out Prediction System")
st.markdown(
    "An AI-powered dashboard to monitor inventory risks and prevent stock-outs "
    "using real-world grocery demand data."
)

# Load and process data
@st.cache_data
def load_pipeline():
    df = load_and_prepare_data("data/train.csv")
    daily = compute_daily_store_demand(df)
    daily = simulate_inventory(daily)
    daily = assign_risk_levels(daily)
    return get_current_status(daily)

data = load_pipeline()

st.subheader("📊 Current Inventory Risk by Store")

def highlight_risk(val):
    if val == "High Risk":
        return "background-color: #ff4d4d; color: white"
    elif val == "Medium Risk":
        return "background-color: #ffa500; color: black"
    elif val == "Low Risk":
        return "background-color: #4CAF50; color: white"
    return ""

styled_data = (
    data[["store", "sales", "risk_level"]]
    .sort_values("store")
    .style
    .applymap(highlight_risk, subset=["risk_level"])
)

st.dataframe(styled_data, use_container_width=True)

st.subheader("🚨 Filter Stores by Risk Level")

risk_filter = st.selectbox(
    "Select Risk Level",
    ["All", "High Risk", "Medium Risk", "Low Risk"]
)

if risk_filter != "All":
    filtered = data[data["risk_level"] == risk_filter]
else:
    filtered = data

st.write(f"Showing **{len(filtered)}** stores")
st.dataframe(
    filtered[["store", "sales", "risk_level"]],
    use_container_width=True
)

st.markdown("---")
st.caption("Built for AI-for-Good Hackathon | Focus on food security & supply resilience")
