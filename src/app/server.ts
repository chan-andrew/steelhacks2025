'use server';

import clientPromise from "@/lib/mongodb";

export async function getMachines() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const posts = await db.collection("Machines").find({}).toArray();
    return posts;
}