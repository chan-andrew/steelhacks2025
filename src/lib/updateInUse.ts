import clientPromise from "@/lib/mongodb";

export async function setMachineInUse(machineId: number) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection("Machines").updateOne(
            { id: machineId },
            { $set: { in_use: true } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Machine with id ${machineId} not found`);
        }
        
        return { success: true, message: `Machine ${machineId} is now in use` };
    } catch (error) {
        console.error('Error setting machine in use:', error);
        return { success: false, message: 'Failed to update machine status' };
    }
}

export async function setMachineNotInUse(machineId: number) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const result = await db.collection("Machines").updateOne(
            { id: machineId },
            { $set: { in_use: false } }
        );
        
        if (result.matchedCount === 0) {
            throw new Error(`Machine with id ${machineId} not found`);
        }
        
        return { success: true, message: `Machine ${machineId} is now available` };
    } catch (error) {
        console.error('Error setting machine not in use:', error);
        return { success: false, message: 'Failed to update machine status' };
    }
}