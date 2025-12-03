#!/usr/bin/env python3
"""Bulk import CSV into backend SQLite food_items table.
CSV columns: name,calories,protein,carbs,fats,fiber,category
"""
import csv
import sqlite3
import sys
from pathlib import Path

DB = Path(__file__).resolve().parents[1] / 'backend' / 'fittrack.db'

def import_csv(csv_path):
    conn = sqlite3.connect(str(DB))
    cur = conn.cursor()
    with open(csv_path, newline='', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            try:
                cur.execute('''INSERT OR REPLACE INTO food_items (name,calories,protein,carbs,fats,fiber,category)
                               VALUES (?,?,?,?,?,?,?)''', (
                    row.get('name'), float(row.get('calories') or 0), float(row.get('protein') or 0), float(row.get('carbs') or 0), float(row.get('fats') or 0), float(row.get('fiber') or 0), row.get('category')
                ))
            except Exception as e:
                print('Skipping row', row, 'err', e)
    conn.commit()
    conn.close()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: food_import.py data.csv')
        sys.exit(2)
    import_csv(sys.argv[1])
    print('Import complete')
