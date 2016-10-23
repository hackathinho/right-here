import zmq
import json
from datetime import datetime

context = zmq.Context()
subscriber = context.socket(zmq.PULL)
subscriber.connect("tcp://127.0.0.1:3000")

publisher = context.socket(zmq.PUSH)
publisher.connect("tcp://127.0.0.1:3333")

if __name__ == '__main__':
    message = subscriber.recv()
    message = json.loads(message)
    print message["replyId"]

    message["data"] = {
        "tipo": "eventbrite",
        "version": 1,
        "fecha": 'date',
        "lat": 1,
        "lon": 2
    }
    publisher.send(json.dumps(message))
