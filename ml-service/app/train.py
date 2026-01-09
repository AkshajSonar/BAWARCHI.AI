import os
import json
import pandas as pd
import xgboost as xgb

from app.features import preprocess
from app.encoders import save_encoders

MODEL_PATH = "models/xgb_model.json"
BASELINE_PATH = "models/dish_baselines.json"
TRAINING_DATA_PATH = "models/training_data.csv"


def compute_dish_baselines(df: pd.DataFrame):
    baselines = {}
    for dish, g in df.groupby("dish_name"):
        per_student = (g["consumed_kg"] / g["total_students"]).mean()
        baselines[dish] = per_student
    return baselines


def train_model_from_payload(payload):
    df = pd.DataFrame(payload)

    # Target
    df["consumed_kg"] = df["prepared_kg"] - df["leftover_kg"]

    # Preserve raw columns for confidence
    df["raw_dish_name"] = df["dish_name"]
    df["raw_meal_type"] = df["meal_type"]

    os.makedirs("models", exist_ok=True)

    # Save training data for confidence logic
    df.to_csv(TRAINING_DATA_PATH, index=False)

    # Compute dish baselines
    baselines = compute_dish_baselines(df)
    with open(BASELINE_PATH, "w") as f:
        json.dump(baselines, f)

    # ML training
    X = preprocess(df)
    y = df["consumed_kg"]

    model = xgb.XGBRegressor(
        n_estimators=600,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=5,
        reg_alpha=0.1,
        reg_lambda=1.5,
        objective="reg:squarederror",
        random_state=42,
    )

    model.fit(X, y)
    model.save_model(MODEL_PATH)

    # Persist encoders
    save_encoders()

    return True
