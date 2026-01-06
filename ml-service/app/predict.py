import os
import pandas as pd
import xgboost as xgb
from app.features import preprocess
from app.train import train_model

MODEL_PATH = "models/xgb_model.json"


def load_or_train_model():
    # If model does not exist OR is empty → train
    if not os.path.exists(MODEL_PATH) or os.path.getsize(MODEL_PATH) == 0:
        print("⚠️ Model not found or empty. Training new model...")
        return train_model()

    model = xgb.XGBRegressor()
    model.load_model(MODEL_PATH)
    return model


def predict(input_data: dict):
    df = pd.DataFrame([input_data])
    X = preprocess(df)

    model = load_or_train_model()
    pred = float(model.predict(X)[0])

    # ---- Confidence logic (simple & valid) ----
    confidence = "medium"
    if pred > 0:
        confidence = "high"

    buffer = 0.05 * pred if confidence == "high" else 0.1 * pred

    return {
        "expected_consumption_kg": round(pred, 2),
        "recommended_kg": round(pred + buffer, 2),
        "confidence": confidence
    }
