import json
import sys
import fileinput

from deepface import DeepFace
    
model_name = "VGG-Face"
detector_backend = "mtcnn"

# Receive image from filesystem database
image_buffer = sys.stdin.readline().rstrip('\n')
image_buffer = json.loads(image_buffer)

# Receive input from client
input_buffer = sys.stdin.readline().rstrip('\n')
input_buffer = json.loads(input_buffer)["image"]

result = DeepFace.verify(image_buffer, input_buffer)

sys.stdout.write(json.dumps(result))
sys.stdout.flush()