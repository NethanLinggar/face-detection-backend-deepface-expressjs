import json
import sys
import fileinput

from deepface import DeepFace
from deepface.modules.verification import find_euclidean_distance
import numpy as np
    
model_name = "VGG-Face"
detector_backend = "mtcnn"

# Receive embedding from MySQL database
embedding_bytes = sys.stdin.readline().rstrip('\n')
embedding_bytes = json.loads(embedding_bytes)[0]["embedding"]["data"]
embedding_data = np.frombuffer(embedding_bytes, dtype = 'float32')

# Receive input from client
input_data = sys.stdin.readline().rstrip('\n')
input_data = json.loads(input_data)["img_base64"]
input_data = DeepFace.represent(input_data, model_name=model_name)[0]["embedding"]
input_data = np.array(input_data, dtype = 'float32')
blob_data = input_data.tobytes()
blob_data = str(blob_data)

result = find_euclidean_distance(source_representation=embedding_bytes, test_representation=input_data)

sys.stdout.write(json.dumps(input_data))
sys.stdout.flush()