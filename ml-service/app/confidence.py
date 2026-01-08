import numpy as np
import pandas as pd


def compute_confidence(df: pd.DataFrame, prediction: float):
    """
    df = historical rows similar to current input
    """

    sample_count = len(df)

    if sample_count < 5:
        return "low", 0.10  # bigger buffer

    std_dev = df["consumed_kg"].std()
    mean = df["consumed_kg"].mean()

    # Coefficient of variation
    cv = std_dev / mean if mean > 0 else 1.0

    if sample_count >= 15 and cv < 0.15:
        return "high", 0.05
    elif sample_count >= 5 and cv < 0.30:
        return "medium", 0.08
    else:
        return "low", 0.12
