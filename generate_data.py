import random
import json
from datetime import datetime, timedelta

random.seed(42)

dishes = [
    {"name": "Rice", "type": "veg", "base_per_student": 0.15},
    {"name": "Dal", "type": "veg", "base_per_student": 0.11},
    {"name": "Pasta", "type": "veg", "base_per_student": 0.18},
    {"name": "Biryani", "type": "non-veg", "base_per_student": 0.22},
]

rows = []
start_date = datetime(2024, 6, 1)

for i in range(60):  # 60 days
    date = start_date + timedelta(days=i)
    day_of_week = date.weekday()

    for dish in dishes:
        students = random.randint(600, 1300)

        is_exam = random.random() < 0.2
        is_event = random.random() < 0.1

        modifier = 1.0
        if is_exam:
            modifier *= 0.9
        if is_event:
            modifier *= 1.15

        consumed = (
            dish["base_per_student"]
            * students
            * modifier
            * random.uniform(0.95, 1.05)
        )

        prepared = consumed * random.uniform(1.05, 1.15)
        leftover = prepared - consumed

        rows.append({
            "day_of_week": day_of_week,
            "meal_type": "lunch",
            "dish_name": dish["name"],
            "dish_type": dish["type"],
            "is_special": 0,
            "is_exam_day": int(is_exam),
            "is_holiday": 0,
            "is_break": 0,
            "is_event_day": int(is_event),
            "total_students": students,
            "prepared_kg": round(prepared, 2),
            "leftover_kg": round(leftover, 2),
        })

with open("synthetic_training_data.json", "w") as f:
    json.dump({"data": rows}, f, indent=2)

print("✅ Generated synthetic_training_data.json with", len(rows), "rows")
