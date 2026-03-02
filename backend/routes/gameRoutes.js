import express from 'express';
import { loginPlayer, handleScan, handleSubmit, getLeaderboard, getProfile, getAllUsers, getHint, sabotagePlayer } from '../controllers/gameController.js';

import Question from '../models/Question.js';

const router = express.Router();

router.post('/login', loginPlayer);
router.post('/scan', handleScan);

router.post('/submit', (req, res) => {
    // We pass the io instance from the request app settings
    handleSubmit(req, res, req.app.get('socketio'));
});

router.post('/hint', getHint);

router.get('/leaderboard', getLeaderboard);
router.get('/user/:username', getProfile);
router.get('/admin/users', getAllUsers);

router.post('/admin/sabotage', (req, res) => {
    sabotagePlayer(req, res, req.app.get('socketio'));
});

// Debug Route
router.get('/debug/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
