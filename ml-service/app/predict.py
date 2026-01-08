import os
import pandas as pd
import xgboost as xgb

from app.features import preprocess
from app.train import TRAINING_DATA, train_model_from_payload
from app.confidence import compute_confidence

MODEL_PATH = "models/xgb_model.json"


def load_model_or_fallback():
    """
    Loads model if exists.
    If not, trains a small fallback model from TRAINING_DATA.
    """
    model = xgb.XGBRegressor()

    if os.path.exists(MODEL_PATH):
        model.load_model(MODEL_PATH)
        return model

    # ❄️ Cold start handling
    if TRAINING_DATA is None or len(TRAINING_DATA) < 3:
        raise RuntimeError("Model not trained yet. Not enough data.")

    # Train fallback model
    X = preprocess(TRAINING_DATA)
    y = TRAINING_DATA["consumed_kg"]

    model.fit(X, y)

    os.makedirs("models", exist_ok=True)
    model.save_model(MODEL_PATH)

    return model


def predict(input_data: dict):
    df_input = pd.DataFrame([input_data])
    X = preprocess(df_input)

    model = load_model_or_fallback()
    pred = float(model.predict(X)[0])

    confidence = "low"
    buffer_pct = 0.12

    if TRAINING_DATA is not None:
        similar = TRAINING_DATA[
            (TRAINING_DATA["dish_name"] == input_data["dish_name"]) &
            (TRAINING_DATA["meal_type"] == input_data["meal_type"])
        ]

        confidence, buffer_pct = compute_confidence(similar, pred)

    recommended = pred + (buffer_pct * pred)

    return {
        "expected_consumption_kg": round(pred, 2),
        "recommended_kg": round(recommended, 2),
        "confidence": confidence
    }
