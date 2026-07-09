import os
import json
import time
from datetime import datetime
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, r2_score

from app.features import preprocess
from app.encoders import save_encoders

MODEL_PATH = "models/xgb_model.json"
BASELINE_PATH = "models/dish_baselines.json"
TRAINING_DATA_PATH = "models/training_data.csv"
METRICS_PATH = "models/model_metrics.json"


def compute_dish_baselines(df: pd.DataFrame):
    baselines = {}
    for dish, g in df.groupby("dish_name"):
        per_student = (g["consumed_kg"] / g["total_students"]).mean()
        baselines[dish] = per_student
    return baselines


def train_model_from_payload(payload):
    start_time = time.time()
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

    # Calculate train metrics
    y_pred = model.predict(X)
    mae = float(mean_absolute_error(y, y_pred))
    rmse = float(np.sqrt(np.mean((y - y_pred) ** 2)))
    r2 = float(r2_score(y, y_pred))

    # Calculate 5-fold cross-validation metrics
    from sklearn.model_selection import KFold
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    val_maes = []
    val_rmses = []
    val_r2s = []

    for train_idx, val_idx in kf.split(X):
        cv_model = xgb.XGBRegressor(
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
        X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

        cv_model.fit(X_tr, y_tr)
        preds = cv_model.predict(X_val)

        val_maes.append(float(mean_absolute_error(y_val, preds)))
        val_rmses.append(float(np.sqrt(np.mean((y_val - preds) ** 2))))
        val_r2s.append(float(r2_score(y_val, preds)))

    val_mae = float(np.mean(val_maes))
    val_rmse = float(np.mean(val_rmses))
    val_r2 = float(np.mean(val_r2s))

    # Extract feature importances
    importances = model.feature_importances_
    features = list(X.columns)
    feature_importances = {}
    for col, imp in zip(features, importances):
        feature_importances[col] = round(float(imp), 4)

    training_duration = float(time.time() - start_time)

    metrics = {
        "train_metrics": {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "r2": round(r2, 4)
        },
        "val_metrics": {
            "mae": round(val_mae, 4),
            "rmse": round(val_rmse, 4),
            "r2": round(val_r2, 4)
        },
        "feature_importances": feature_importances,
        "training_duration_seconds": round(training_duration, 4),
        "total_training_samples": int(len(df)),
        "last_trained_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    return True

