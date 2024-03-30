import json
import sys

data = sys.argv[1]
data = json.loads(data)

print(json.dumps(data))

sys.stdout.flush()