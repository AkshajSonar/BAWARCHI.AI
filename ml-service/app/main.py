from fastapi import FastAPI
from app.train import train_model
from app.predict import predict

app = FastAPI()

@app.get("/")
def health():
    return {"status": "ML service running"}

@app.post("/train")
def train():
    train_model()
    return {"status": "model trained successfully"}

@app.post("/predict")
def run_prediction(payload: dict):
    return predict(payload)
