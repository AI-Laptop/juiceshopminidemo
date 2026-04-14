import json
import os

json_file = 'server/index_20251205_123114.json'
output_file = 'metis_summary.txt'

try:
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write(f"Total files reviewed: {len(data.get('reviews', []))}\n")

        relevant_reviews = []
        for item in data.get('reviews', []):
            file_path = item.get('file', '')
            # Filter out node_modules and venv/env if present
            if 'node_modules' in file_path or 'venv' in file_path or '.git' in file_path:
                continue
            
            if item.get('reviews'):
                relevant_reviews.append(item)

        out.write(f"Relevant files with issues: {len(relevant_reviews)}\n")
        
        for item in relevant_reviews:
            out.write(f"\nFile: {item['file']}\n")
            for review in item['reviews']:
                out.write(f"  - Issue: {review['issue']}\n")
                out.write(f"    Line: {review.get('line_number')}\n")
                out.write(f"    Severity: {review.get('severity')}\n")
                out.write(f"    Confidence: {review.get('confidence')}\n")
                out.write(f"    Snippet: {review.get('code_snippet')}\n")
                out.write("-" * 20 + "\n")

    print("Done writing summary.")

except Exception as e:
    print(f"Error processing JSON: {e}")
