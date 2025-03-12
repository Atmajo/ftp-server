import { kafka } from "./client.ts";

async function init() {
  const consumer = kafka.consumer({ groupId: "test-user" });
  consumer.connect();
  console.log("Consumer connected");

  await consumer.subscribe({ topic: "ftp-server", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message?.value?.toString(),
      });
    },
  });
}

init();
