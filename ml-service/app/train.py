import os
import pandas as pd
import xgboost as xgb
from app.features import preprocess

MODEL_PATH = "models/xgb_model.json"
DATA_PATH = "data/training.csv"


def train_model():
    if not os.path.exists(DATA_PATH):
        raise RuntimeError("❌ Training data not found")

    df = pd.read_csv(DATA_PATH)

    # Compute target
    df["consumed_kg"] = df["prepared_kg"] - df["leftover_kg"]

    X = preprocess(df)
    y = df["consumed_kg"]

    model = xgb.XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.08,
        objective="reg:squarederror",
        random_state=42
    )

    model.fit(X, y)

    # Ensure models directory exists
    os.makedirs("models", exist_ok=True)
    model.save_model(MODEL_PATH)

    print("✅ Model trained and saved")
    return model
