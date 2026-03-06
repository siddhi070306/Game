import User from '../models/User.js';

const activeVaults = {};

export const setupVaultSockets = (io) => {

    io.on('connection', (socket) => {

        socket.on('host_vault', () => {
            const lobbyCode = Math.floor(1000 + Math.random() * 9000).toString();
            activeVaults[lobbyCode] = {
                hostSocket: socket.id,
                players: [],
                pattern: [],
                currentIndex: 0,
                timeLeft: 60,
                speed: 1500, // Speed of pattern generation
                gameTimer: null,
                patternTimer: null,
                mistakes: { 'Red': { count: 0, username: '' }, 'Blue': { count: 0, username: '' }, 'Green': { count: 0, username: '' }, 'Yellow': { count: 0, username: '' } },
                status: 'waiting'
            };
            socket.join(lobbyCode);
            socket.emit('vault_created', { lobbyCode });
        });

        socket.on('join_vault', async ({ lobbyCode, userId }) => {
            const vault = activeVaults[lobbyCode];
            if (!vault) return socket.emit('vault_error', { message: 'Invalid Vault Code' });
            if (vault.status !== 'waiting') return socket.emit('vault_error', { message: 'Game already in progress' });
            if (vault.players.length >= 4) return socket.emit('vault_error', { message: 'Vault is full' });

            if (vault.players.find(p => p.userId === userId)) return socket.emit('vault_error', { message: 'Already joined this vault' });

            const colors = ['Red', 'Blue', 'Green', 'Yellow'];
            const assignedColor = colors[vault.players.length];

            try {
                const user = await User.findById(userId);
                if (!user) return socket.emit('vault_error', { message: 'User not found' });

                const newPlayer = { socketId: socket.id, userId, username: user.username, color: assignedColor };
                vault.players.push(newPlayer);
                vault.mistakes[assignedColor] = { count: 0, username: user.username, userId };

                socket.join(lobbyCode);
                socket.emit('vault_joined', { color: assignedColor, lobbyCode });
                io.to(vault.hostSocket).emit('vault_player_joined', vault.players);

                if (vault.players.length >= 2) {
                    io.to(vault.hostSocket).emit('vault_ready'); // can start with 2-4
                }
            } catch (err) {
                socket.emit('vault_error', { message: err.message });
            }
        });

        socket.on('start_vault', ({ lobbyCode }) => {
            const vault = activeVaults[lobbyCode];
            if (!vault || vault.hostSocket !== socket.id) return;

            vault.status = 'playing';
            vault.pattern = [];
            vault.currentIndex = 0;
            vault.timeLeft = 60;
            vault.speed = 1000;
            // Clear old mistakes if restarting
            vault.players.forEach(p => {
                vault.mistakes[p.color] = { count: 0, username: p.username, userId: p.userId };
            });

            io.to(lobbyCode).emit('vault_started');

            // Add new colors periodically
            const addColor = () => {
                const activeColors = vault.players.map(p => p.color);
                if (activeColors.length === 0) return;
                const nextColor = activeColors[Math.floor(Math.random() * activeColors.length)];
                vault.pattern.push(nextColor);
                io.to(vault.hostSocket).emit('vault_flash', { color: nextColor, pattern: vault.pattern });
            };

            // initial seq
            for (let i = 0; i < 3; i++) addColor();

            vault.patternTimer = setInterval(() => {
                if (vault.pattern.length - vault.currentIndex < 5) {
                    addColor();
                }
            }, vault.speed);

            vault.gameTimer = setInterval(() => {
                vault.timeLeft--;
                io.to(vault.hostSocket).emit('vault_tick', { timeLeft: vault.timeLeft });

                // speed decreases (gets faster) every 10s
                if (vault.timeLeft % 10 === 0 && vault.speed > 300) {
                    vault.speed -= 150;
                    clearInterval(vault.patternTimer);
                    vault.patternTimer = setInterval(() => {
                        if (vault.pattern.length - vault.currentIndex < 5) addColor();
                    }, vault.speed);
                    io.to(vault.hostSocket).emit('vault_speed_up', { speed: vault.speed });
                }

                if (vault.timeLeft <= 0) {
                    clearInterval(vault.gameTimer);
                    clearInterval(vault.patternTimer);
                    endVaultGame(lobbyCode);
                }
            }, 1000);
        });

        socket.on('vault_tap', async ({ lobbyCode, color, userId }) => {
            const vault = activeVaults[lobbyCode];
            if (!vault || vault.status !== 'playing') return;

            const expectedColor = vault.pattern[vault.currentIndex];

            if (color === expectedColor) {
                vault.currentIndex++;
                io.to(vault.hostSocket).emit('vault_tap_success', { color, currentIndex: vault.currentIndex });
            } else {
                // Mistake recorded for the person who tapped
                if (vault.mistakes[color]) {
                    vault.mistakes[color].count++;
                }
                io.to(vault.hostSocket).emit('vault_tap_mistake', { tapped: color, expectedColor, currentMistakes: vault.mistakes });
                // We do NOT advance the index. The correct person still needs to tap to continue the sequence.
            }
        });

        const endVaultGame = async (lobbyCode) => {
            const vault = activeVaults[lobbyCode];
            if (!vault) return;
            vault.status = 'finished';

            const stats = [];
            let mostMistakes = -1;
            let weakestLink = "";

            for (const [color, data] of Object.entries(vault.mistakes)) {
                if (data.username) {
                    stats.push({ color, username: data.username, mistakes: data.count, userId: data.userId });
                    if (data.count > mostMistakes) {
                        mostMistakes = data.count;
                        weakestLink = data.username;
                    }
                }
            }

            for (const player of stats) {
                try {
                    const user = await User.findById(player.userId);
                    if (user) {
                        if (player.mistakes === 0) user.score += 50;
                        else if (player.mistakes <= 3) user.score += 20;
                        else if (player.mistakes > 5) user.score -= 10;
                        await user.save();
                    }
                } catch (err) {
                    console.error("Error updating score:", err);
                }
            }

            io.emit('leaderboard_update');
            io.to(lobbyCode).emit('vault_game_over', { stats, weakestLink });

            delete activeVaults[lobbyCode];
        };
    });
};
