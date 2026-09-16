# Script to build perfected PDF
import json, os, subprocess

with open("chapters_dump.json", "r", encoding="utf-8") as f:
    chapters = json.load(f)

print(f"Loaded {len(chapters)} chapters.")
