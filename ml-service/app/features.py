import pandas as pd
from app.encoders import encode_column, load_encoders

load_encoders()


def preprocess(df: pd.DataFrame):
    df = df.copy()

    df["meal_type"] = encode_column("meal_type", df["meal_type"])
    df["dish_type"] = encode_column("dish_type", df["dish_type"])
    df["dish_name"] = encode_column("dish_name", df["dish_name"])

    return df[
        [
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
    ]
