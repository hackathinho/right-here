
import codecs, json, os, time
import zmq


context = zmq.Context()

def setup_queues():
    receiver = context.socket(zmq.SUB)
    sender = context.socket(zmq.PUSH)

    receiver.setsockopt(zmq.SUBSCRIBE, '')
    receiver.connect(os.environ.get('ZMQ_PULL_QUEUE', 'tcp://127.0.0.1:3000'))

    sender.connect(os.environ.get('ZMQ_PUSH_QUEUE', 'tcp://127.0.0.1:3333'))

    return receiver, sender


def ask_twitter(lat, lon):
    tweets = []
    tweets.append({
        'data': {
            'id': 23456789876543,
            'username': '@ssice',
            'text': 'Hackatinho happened here',
            'lat': lat,
            'lon': lon,
        },
        'type': 'twitter',
        'version': 1,
    })

    return tweets


def main():
    receiver, sender = setup_queues()

    should_exit = False

    while not should_exit:
        msg = receiver.recv().decode('utf-8')

        print("Got message: {0}".format(msg))
        msg = json.loads(msg)
        if 'control' in msg and msg['control'] == 'EXIT':
            break
        msgId = msg['replyId']
        data = msg['data']
        lat, lon = data['lat'], data['lon']

        tweets = ask_twitter(lat, lon)

        envelope = {
            'replyId': msgId,
            'data': tweets,
        }

        print("Sending in return: {0} / {1}".format(tweets, type(json.dumps(envelope))))
        sender.send(b'response')
        sender.send(json.dumps(envelope).encode())


if __name__ == '__main__':
    main()
