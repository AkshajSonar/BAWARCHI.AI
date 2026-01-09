import os
import json
import pandas as pd
import xgboost as xgb

from app.features import preprocess
from app.confidence import compute_confidence

MODEL_PATH = "models/xgb_model.json"
BASELINE_PATH = "models/dish_baselines.json"
TRAINING_DATA_PATH = "models/training_data.csv"


def load_model():
    model = xgb.XGBRegressor()
    model.load_model(MODEL_PATH)
    return model


def load_training_data():
    if os.path.exists(TRAINING_DATA_PATH):
        return pd.read_csv(TRAINING_DATA_PATH)
    return None


def predict(input_data: dict):
    REQUIRED = [
        "day_of_week",
        "meal_type",
        "dish_name",
        "dish_type",
        "is_special",
        "is_exam_day",
        "is_holiday",
        "is_break",
        "is_event_day",
        "total_students",
    ]

    for k in REQUIRED:
        if k not in input_data:
            raise RuntimeError(f"Missing feature: {k}")

    df_input = pd.DataFrame([input_data])
    X = preprocess(df_input)

    model = load_model()
    ml_pred = float(model.predict(X)[0])

    # ---------- BASELINE ----------
    baseline_pred = None
    if os.path.exists(BASELINE_PATH):
        with open(BASELINE_PATH) as f:
            baselines = json.load(f)

        dish = input_data["dish_name"]
        students = input_data["total_students"]

        if dish in baselines:
            baseline_pred = baselines[dish] * students

    # ---------- CONFIDENCE ----------
    training_data = load_training_data()

    confidence = "low"
    risk_multiplier = 1.18
    sample_support = 0

    if training_data is not None:
        similar = training_data[
            (training_data["raw_dish_name"] == input_data["dish_name"])
            & (training_data["raw_meal_type"] == input_data["meal_type"])
        ]

        sample_support = len(similar)

        if sample_support > 0:
            confidence, _ = compute_confidence(similar)
            risk_multiplier = {
                "high": 1.05,
                "medium": 1.10,
                "low": 1.18,
            }[confidence]

    # ---------- HYBRID BLEND ----------
    if baseline_pred is not None:
        expected = 0.7 * ml_pred + 0.3 * baseline_pred
    else:
        expected = ml_pred

    recommended = expected * risk_multiplier

    return {
        "expected_consumption_kg": round(expected, 2),
        "recommended_kg": round(recommended, 2),
        "confidence": confidence,
        "sample_support": sample_support,
    }
