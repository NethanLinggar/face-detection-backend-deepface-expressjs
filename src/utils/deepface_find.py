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
try:
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