import json
import os
import sys

data = sys.argv[1]
data = json.loads(data)

# data = {
#   "brand": "Ford",
#   "model": "Mustang",
#   "year": 1964
# }

data = {
  "version": sys.version,
  "path": sys.executable
}

sys.stdout.write(json.dumps(data))
sys.stdout.flush()