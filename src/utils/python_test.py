import json
import sys

resp = {
  "Response": 200,
  "Message": "Python script is sucessful."
}
print(json.dumps(resp))

sys.stdout.flush()