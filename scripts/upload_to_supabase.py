# -*- coding: utf-8 -*-
"""
Fast Batch Uploader for 14,280 Questions into Supabase.
"""

import json
import time
import urllib.request
import os
import sys

DATASET_PATH = r"d:\YOUTUBE\math-certificate\public\datasets\milliy_sertifikat_14280.json"
RPC_URL = "https://mpkfhravlzpbhyeyvttu.supabase.co/rest/v1/rpc/bulk_import_questions_json"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA"
BATCH_SIZE = 200

def upload_batch(batch, batch_num, total_batches):
    data = json.dumps({"p_items": batch}).encode("utf-8")
    req = urllib.request.Request(
        RPC_URL,
        data=data,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json"
        }
    )
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status == 200:
                    res_body = json.loads(resp.read().decode("utf-8"))
                    print(f"[{batch_num}/{total_batches}] Successfully uploaded {len(batch)} questions. (Total processed: {res_body.get('processed')})")
                    return True
                else:
                    print(f"[{batch_num}/{total_batches}] Warning status: {resp.status}")
        except Exception as e:
            print(f"[{batch_num}/{total_batches}] Retry {attempt + 1}/{max_retries} due to: {e}")
            time.sleep(1)
            
    return False

def main():
    print(f"Loading questions from {DATASET_PATH}...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)
        
    total_q = len(questions)
    print(f"Loaded {total_q} questions. Dividing into batches of {BATCH_SIZE}...")
    
    batches = [questions[i:i + BATCH_SIZE] for i in range(0, total_q, BATCH_SIZE)]
    total_batches = len(batches)
    print(f"Total batches to upload: {total_batches}")
    
    success_count = 0
    start_time = time.time()
    
    for i, batch in enumerate(batches):
        if upload_batch(batch, i + 1, total_batches):
            success_count += len(batch)
            
    elapsed = time.time() - start_time
    print(f"\n==========================================")
    print(f"UPLOAD COMPLETED in {elapsed:.2f} seconds!")
    print(f"Successfully processed: {success_count}/{total_q} questions.")
    print(f"==========================================")

if __name__ == "__main__":
    main()
