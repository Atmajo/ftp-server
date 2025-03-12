import { kafka } from "../../kafka/client.ts";

export async function sendEvent(event: any, details: any) {
  const producer = kafka.producer();
  
  try {
    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");

    await producer.send({
      topic: "ftp-server",
      messages: [
        {
          value: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            details,
          }),
        },
      ],
    });
    console.log(`Event sent to Kafka: ${event}`);
  } catch (error: any) {
    console.log(error);
  }
}
