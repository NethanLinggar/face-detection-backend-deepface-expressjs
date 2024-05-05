import json
import sys
import fileinput

from deepface import DeepFace
import numpy as np
    
model_name = "VGG-Face"
detector_backend = "mtcnn"

# receive base64 from backend
input_data = ""
for line in fileinput.input():
    input_data += line
data = json.loads(input_data)

nrp = data["nrp"]
name = data["name"]

img_base64 = data["img_base64"]
embedding = DeepFace.represent(img_base64, model_name=model_name)[0]["embedding"]
embedding = np.array(embedding, dtype = 'float32')
blob_data = embedding.tobytes()
blob_data = str(blob_data)

data = {
  "nrp": nrp,
  "name": name,
  "embedding": blob_data
}

sys.stdout.write(json.dumps(data))
sys.stdout.flush()