import json
import os

ENCODER_PATH = "models/encoders.json"

_encoders = {}


def load_encoders():
    global _encoders
    if os.path.exists(ENCODER_PATH):
        with open(ENCODER_PATH, "r") as f:
            _encoders = json.load(f)


def save_encoders():
    os.makedirs("models", exist_ok=True)
    with open(ENCODER_PATH, "w") as f:
        json.dump(_encoders, f)


def encode_column(col, values):
    if col not in _encoders:
        _encoders[col] = {}

    encoded = []
    for v in values:
        if v not in _encoders[col]:
            _encoders[col][v] = len(_encoders[col])
        encoded.append(_encoders[col][v])

    return encoded
