from qcloud_cos import CosConfig
from qcloud_cos import CosS3Client
import sys
import logging
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

settings = None
with open(os.path.join(BASE_DIR, "cos.json"), "r") as f:
  settings = json.load(f)
#print("cos: ", settings)

config = CosConfig(Region=settings["region"], SecretId=settings["secret_id"], SecretKey=settings["secret_key"])

client = CosS3Client(config)
