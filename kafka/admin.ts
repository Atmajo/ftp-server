import { kafka } from "./client";

async function init() {
  const admin = kafka.admin();
  console.log("Connecting admin...");
  await admin.connect();
  console.log("Admin connected");

  console.log("Creating topic...");
  await admin.createTopics({
    topics: [
      {
        topic: "ftp-server",
        numPartitions: 1,
      },
    ],
  });
  console.log("Topic created");

  console.log("Disconnecting admin...");
  await admin.disconnect();
}

init();
