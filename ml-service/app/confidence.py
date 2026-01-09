def compute_confidence(df):
    n = len(df)

    if n < 5:
        return "low", 0.18

    mean = df["consumed_kg"].mean()
    std = df["consumed_kg"].std()

    cv = std / mean if mean > 0 else 1.0

    if n >= 20 and cv < 0.15:
        return "high", 0.05
    elif n >= 8 and cv < 0.30:
        return "medium", 0.10
    else:
        return "low", 0.18
