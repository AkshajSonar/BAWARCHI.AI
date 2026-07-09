from fastapi import FastAPI, Request, HTTPException
from app.train import train_model_from_payload
from app.predict import predict

app = FastAPI()


@app.get("/")
def health():
    return {"status": "ML service running"}


@app.post("/train")
async def train(request: Request):
    payload = await request.json()
    train_model_from_payload(payload["data"])
    return {"status": "trained"}


@app.post("/predict")
def run_prediction(payload: dict):
    try:
        return predict(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/metrics")
def get_model_metrics():
    import os
    import json
    if os.path.exists("models/model_metrics.json"):
        with open("models/model_metrics.json") as f:
            return json.load(f)
    return {
        "mae": 0.0,
        "rmse": 0.0,
        "r2": 0.0,
        "training_duration_seconds": 0.0,
        "total_training_samples": 0,
        "last_trained_at": None
    }

