import json
import sys

from deepface import DeepFace

model_name = "Facenet512"
detector_backend = "opencv"
distance_metric = "cosine"

# Receive image from filesystem database
image_buffer = sys.stdin.readline().rstrip('\n')
image_buffer = json.loads(image_buffer)

# Receive input from client
input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)["image"]

try:
  result = DeepFace.verify(image_buffer, input_buffer, model_name=model_name, detector_backend=detector_backend, distance_metric=distance_metric, silent=True)
except:
  result = "Face not found."

sys.stdout.write(json.dumps(result))
sys.stdout.flush()