import json
import sys
import fileinput
import os

from deepface import DeepFace
    
model_name = "VGG-Face"
detector_backend = "mtcnn"

input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)

try:
  detect = DeepFace.find(img_path=input_buffer, db_path="database", silent=True)
  if detect:
    result = "Face detected."
  else:
    result = "Face not detected." 
except:
  result = "Face not detected."

sys.stdout.write(json.dumps(result))
sys.stdout.flush()