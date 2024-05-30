import json
import sys
import os

from deepface import DeepFace

db_path = "../face-detection-database"
model_name = "Facenet512"
detector_backend = "opencv"
distance_metric = "cosine"

input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)["image"]

try:
  result = DeepFace.find(img_path=input_buffer, db_path=db_path, model_name=model_name, detector_backend=detector_backend, distance_metric=distance_metric, silent=True)
  
  result = result[0]["identity"][0]

  verification = DeepFace.verify(input_buffer, result)

  if verification["verified"] == True:
    result = result.split('\\')[-1].split('.')[0]
  else:
    result = "Face not found."
except:
  result = "Face not found."

sys.stdout.write(json.dumps(result))
sys.stdout.flush()