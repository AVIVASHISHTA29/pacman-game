document.addEventListener('DOMContentLoaded', () => {
    // Select game elements and define initial game state
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('scoreValue');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    let score = 0; // Initial score
    let gameActive = false; // Game state flag
    let ghostIntervals = [];

    const startGame = () => {
        gameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        gameArea.innerHTML = '<div id="pacman" style="left: 0; top: 0;"></div>'; // Initialize Pac-Man's position
        startButton.style.display = 'none';
        endButton.style.display = 'inline-block';
        document.addEventListener('keydown', movePacman);
        ghostIntervals = [];
        spawnItem();
        spawnItem();
        spawnItem();
        spawnGhost();
        spawnGhost();
        // Additional setup will be added here in later sections
    };

    const endGame = () => {
        ghostIntervals = [];
        gameActive = false;
        gameArea.innerHTML = '';
        startButton.style.display = 'inline-block';
        endButton.style.display = 'none';
        alert('Game Over. Your score was ' + score);
        document.removeEventListener('keydown');
    };

    const wrapAround = (pacman, pacmanPos) => {
        let gameAreaPos = gameArea.getBoundingClientRect();

        // Adjust Pac-Man's position if it goes beyond the game area boundaries
        if (pacmanPos.left < 0) {
            pacmanPos.left = gameAreaPos.width - pacman.offsetWidth;
        } else if (pacmanPos.left + pacman.offsetWidth > gameAreaPos.width) {
            pacmanPos.left = 0;
        }

        if (pacmanPos.top < 0) {
            pacmanPos.top = gameAreaPos.height - pacman.offsetHeight;
        } else if (pacmanPos.top + pacman.offsetHeight > gameAreaPos.height) {
            pacmanPos.top = 0;
        }

        // Update Pac-Man's style to reflect the new position
        pacman.style.left = pacmanPos.left + 'px';
        pacman.style.top = pacmanPos.top + 'px';
    };

    const checkItemCollision = () => {
        const pacman = document.getElementById('pacman');
        const items = document.querySelectorAll('.item');

        items.forEach((item) => {
            if (isColliding(pacman, item)) {
                item.remove();
                spawnItem(); // Spawn a new item
                score += 1; // Increase score
                if (score % 5 === 0) {
                    spawnGhost();
                }
                scoreDisplay.textContent = score;
            }
        });
    };

    const checkGhostCollision = () => {
        const pacman = document.getElementById('pacman');
        const ghosts = document.querySelectorAll('.ghost');

        ghosts.forEach((ghost) => {
            if (isColliding(pacman, ghost)) {
                endGame(); // End the game on collision with a ghost
            }
        });
    };

    const isColliding = (a, b) => {
        let aRect = a.getBoundingClientRect();
        let bRect = b.getBoundingClientRect();
        return !(
            aRect.bottom < bRect.top ||
            aRect.top > bRect.bottom ||
            aRect.right < bRect.left ||
            aRect.left > bRect.right
        );
    };

    const movePacman = (e) => {
        if (!gameActive) return;
        const pacman = document.getElementById('pacman');
        if (!pacman) return;

        let stepSize = 20; // Step size for Pac-Man's movement
        let pacmanPos = {
            left: parseInt(pacman.style.left, 10),
            top: parseInt(pacman.style.top, 10)
        };

        console.log("game active", gameActive, pacman, e)

        switch (e.key) {
            case 'ArrowUp':
                pacmanPos.top -= stepSize;
                break;
            case 'ArrowDown':
                pacmanPos.top += stepSize;
                break;
            case 'ArrowLeft':
                pacmanPos.left -= stepSize;
                break;
            case 'ArrowRight':
                pacmanPos.left += stepSize;
                break;
        }

        wrapAround(pacman, pacmanPos);
        checkItemCollision();
        checkGhostCollision();
        // Additional logic for collision and wrapping will be added later
    };

    const moveGhost = (ghost) => {
        let moveHorizontal = Math.random() < 0.5;
        const ghostInterval = setInterval(() => {
            if (!gameActive) return;
            let pos = ghost.getBoundingClientRect();
            let gameAreaPos = gameArea.getBoundingClientRect();

            if (moveHorizontal) {
                ghost.style.left = (parseInt(ghost.style.left) + 2) % gameAreaPos.width + 'px';
            } else {
                ghost.style.top = (parseInt(ghost.style.top) + 2) % gameAreaPos.height + 'px';
                if (pos.bottom > gameAreaPos.bottom) {
                    ghost.style.top = '-20px';
                }
            }
        }, 60);
        ghostIntervals.push(ghostInterval);
    };



    const spawnItem = () => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.style.left = Math.random() * (gameArea.offsetWidth - 10) + 'px';
        item.style.top = Math.random() * (gameArea.offsetHeight - 10) + 'px';
        gameArea.appendChild(item);
    };

    const spawnGhost = () => {
        const ghost = document.createElement('div');
        ghost.classList.add('ghost');
        ghost.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
        ghost.style.top = Math.random() * (gameArea.offsetHeight - 20) + 'px';
        gameArea.appendChild(ghost);
        moveGhost(ghost);
        // Ghost movement logic will be added in a later section
    };




    endButton.addEventListener('click', endGame);
    startButton.addEventListener('click', startGame);

});