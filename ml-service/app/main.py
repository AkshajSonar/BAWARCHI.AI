from fastapi import FastAPI, Request
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
    return predict(payload)
