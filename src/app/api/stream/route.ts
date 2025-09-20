import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  const changeStream = db.collection("Machines").watch();

  // Create a ReadableStream to push events to client
  const stream = new ReadableStream({
    start(controller) {
      changeStream.on("change", (next) => {
        controller.enqueue(
          `data: ${JSON.stringify(next)}\n\n`
        );
      });
    },
    cancel() {
      changeStream.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
