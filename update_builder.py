import json

# Let's inspect chapters_dump.json
with open("chapters_dump.json", "r", encoding="utf-8") as f:
    chapters = json.load(f)

print(f"Read {len(chapters)} chapters from chapters_dump.json")
