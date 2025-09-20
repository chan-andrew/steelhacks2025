'use server';

import clientPromise from "@/lib/mongodb";
import { setMachineInUse, setMachineNotInUse } from "@/lib/updateInUse";

export async function getMachines() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const posts = await db.collection("Machines").find({}).toArray();
        return posts;
    } catch (error) {
        console.error('Error getting machines:', error);
        throw new Error('Failed to retrieve machines');
    }
}

export { setMachineNotInUse, setMachineInUse };



