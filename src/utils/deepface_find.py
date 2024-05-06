import json
import sys
import fileinput
import os

from deepface import DeepFace
    
model_name = "VGG-Face"
detector_backend = "mtcnn"

input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)["image"]

result = DeepFace.find(img_path=input_buffer, db_path="database", silent=True)
result = result[0]["identity"][0]
result = result.split('\\')[-1].split('.')[0]

sys.stdout.write(json.dumps(result))
sys.stdout.flush()