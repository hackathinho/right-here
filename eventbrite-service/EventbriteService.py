import zmq
import json
import requests
import os

from datetime import datetime

context = zmq.Context()
subscriber = context.socket(zmq.PULL)
subscriber.connect("tcp://127.0.0.1:3000")

publisher = context.socket(zmq.PUSH)
publisher.connect("tcp://127.0.0.1:3333")

def decorate_event(event):
    event['type'] = 'eventbrite'
    return event

if __name__ == '__main__':
    token = os.environ.get("EVENTBRITE_TOKEN", "Not set")
    headers = {'Authorization': 'Bearer ' + token}

    message = subscriber.recv()
    message = json.loads(message)

    queryparams = {
        "location.latitude": message["data"]["lat"],
        "location.longitude": message["data"]["lon"]
    }

    url = 'https://www.eventbriteapi.com/v3/events/search/'
    res = requests.get(url, headers=headers, params=queryparams)

    json_body = json.loads(res.text)
    data = map(decorate_event, json_body['events'])

    message["data"] = data
    dump = json.dumps(message)
    print dump
    publisher.send(dump)
