import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        if (indexes.find(idx => idx.name === 'email_1')) {
            await collection.dropIndex('email_1');
            console.log('Successfully dropped email_1 index');
        } else {
            console.log('Index email_1 not found');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

dropIndex();
