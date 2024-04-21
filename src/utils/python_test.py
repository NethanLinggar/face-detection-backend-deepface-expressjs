import json
import sys

data = sys.argv[1]
data = json.loads(data)

# data = {
#   "brand": "Ford",
#   "model": "Mustang",
#   "year": 1964
# }

sys.stdout.write(json.dumps(data))
sys.stdout.flush()