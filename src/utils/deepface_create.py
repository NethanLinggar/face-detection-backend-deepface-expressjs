import json
import sys
import os

from deepface import DeepFace
    
model_name = "Facenet512"
detector_backend = "opencv"
distance_metric = "cosine"

input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)

try:
  detect = DeepFace.extract_faces(img_path=input_buffer)
  if detect:
    result = "Face detected."
  else:
    result = "Face not detected." 
except:
  result = "Face not detected."

sys.stdout.write(json.dumps(result))
sys.stdout.flush()