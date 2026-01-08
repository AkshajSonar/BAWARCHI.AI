import os
import pandas as pd
import xgboost as xgb
from app.features import preprocess

MODEL_PATH = "models/xgb_model.json"
TRAINING_DATA = None

def train_model_from_payload(payload):
    global TRAINING_DATA
    df = pd.DataFrame(payload)

    df["consumed_kg"] = df["prepared_kg"] - df["leftover_kg"]
    TRAINING_DATA = df.copy()

    X = preprocess(df)
    y = df["consumed_kg"]

    model = xgb.XGBRegressor(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.07,
        objective="reg:squarederror",
        random_state=42
    )

    model.fit(X, y)

    os.makedirs("models", exist_ok=True)
    model.save_model(MODEL_PATH)

    return True
