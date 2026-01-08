import pandas as pd

def preprocess(df: pd.DataFrame):
    df = df.copy()

    df["meal_type"] = df["meal_type"].astype("category").cat.codes
    df["dish_type"] = df["dish_type"].astype("category").cat.codes
    df["dish_name"] = df["dish_name"].astype("category").cat.codes

    features = [
        "day_of_week",
        "meal_type",
        "dish_name",
        "dish_type",
        "is_special",
        "is_exam_day",
        "is_holiday",
        "is_break",
        "is_event_day",
        "total_students"
    ]

    return df[features]
