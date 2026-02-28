import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import gameRoutes from './routes/gameRoutes.js';
import { seedQuestions } from './utils/seeder.js';

dotenv.config();

// Connect to Database
connectDB().then(() => {
    seedQuestions();
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store io in app to use in controllers
app.set('socketio', io);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', gameRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Pressure Cooker API is running" });
});

// Socket.io for Real-time Leaderboard/Game Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
