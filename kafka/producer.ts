import { kafka } from "./client";

async function init() {
  const producer = kafka.producer();

  console.log("Connecting producer...");
  await producer.connect();
  console.log("Producer connected");

  await producer.send({
    topic: "ftp-server",
    messages: [
      {
        partition: 0,
        key: "greeting",
        value: "Hello KafkaJS user!",
      },
    ],
  });

  console.log("Message sent");
  console.log("Disconnecting producer...");
  await producer.disconnect();
  console.log("Producer disconnected");
}

init();
