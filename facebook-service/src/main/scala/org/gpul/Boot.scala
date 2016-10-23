package com.example

import akka.actor.{ActorSystem, Props}
import akka.io.IO
import spray.can.Http
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._

import zeromq._
import akka.util.ByteString
import scala.concurrent.ExecutionContext.Implicits.global
import spray.json._
import DefaultJsonProtocol._

object Boot extends App {

  // we need an ActorSystem to host our application in
  //implicit val system = ActorSystem("on-spray-can")

  // create and start our service actor
  //val service = system.actorOf(Props[MyServiceActor], "demo-service")

  //implicit val timeout = Timeout(5.seconds)
  // start a new HTTP server on port 8080 with our service actor as the handler
  //IO(Http) ? Http.Bind(service, interface = "localhost", port = 8080)

  val sender = ZeroMQ.socket(SocketType.Push)
  val receiver = ZeroMQ.socket(SocketType.Pull)

  receiver.connect("tcp://127.0.0.1:3000")
  sender.connect("tcp://127.0.0.1:3333")

  receiver.recvAll { message: Message =>
    val strMessage = message.map(_.utf8String).mkString(" ")
    println("received: " + strMessage)

    sender.send(Message(ByteString(strMessage)))
  }
}
