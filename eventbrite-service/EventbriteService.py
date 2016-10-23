import zmq

context = zmq.Context()
subscriber = context.socket(zmq.PULL)
subscriber.connect("tcp://127.0.0.1:3000")

publisher = context.socket(zmq.PUSH)
publisher.connect("tcp://127.0.0.1:3333")

if __name__ == '__main__':
    message = subscriber.recv()
    print message
    publisher.send(b"hola")
