import express from 'express';
import { handleScan, handleSubmit, getLeaderboard, getProfile } from '../controllers/gameController.js';

const router = express.Router();

router.post('/scan', handleScan);

router.post('/submit', (req, res) => {
    // We pass the io instance from the request app settings
    handleSubmit(req, res, req.app.get('socketio'));
});

router.get('/leaderboard', getLeaderboard);
router.get('/user/:username', getProfile);

export default router;
