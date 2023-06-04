const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "background.png";

// game settings
let gameStarted = false;
const gravitation = .11;
let speed = 2;
let speede = 2;

const size = [51, 36];
const jump = -4.5;
const canvasDivision = (canvas.width / 10);
const canvasWidth = 959;
const canvasHeight = 968;

let index = 0,
    bestScore = 0,
    flight,
    flyHeight,
    score,
    pipe,
    birdAngle,
    rotateStartTime; // czas rozpoczęcia obrotu ptaszka

// pipes settings
const pipeWidth = 90;
const pipeGap = 350;
const pipeRandom = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
    score = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (size[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeRandom()]);
}

const render = () => {
    index++;

    // background moving
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight, -((index * (speede / 2)) % canvasWidth) + canvasWidth, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight, -(index * (speede / 2)) % canvasWidth, 0, canvasWidth, canvasHeight);


    // pipe display
    if (gameStarted) {
        pipes.map(pipe => {
            pipe[0] -= speed;

            ctx.drawImage(img, 970, 859 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
            ctx.drawImage(img, 1088, 0, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap - 100, pipeWidth, canvas.height - pipe[1] + pipeGap);

            if (pipe[0] <= -pipeWidth) {
                score++;
                bestScore = Math.max(bestScore, score);

                pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeRandom()]];
                speed += 0.1;
            }
            // end game if pipe or screen hit
            if (
                (pipe[0] <= canvasDivision + size[0] &&
                    pipe[0] + pipeWidth >= canvasDivision &&
                    (
                        pipe[1] > flyHeight ||
                        pipe[1] + pipeGap - 100 < flyHeight + size[1] ||
                        flyHeight <= 0 ||
                        flyHeight >= canvasHeight - size[1]
                    )) || flyHeight <= 0 || flyHeight >= canvasHeight - size[1]
            ) {
                gameStarted = false;
                speed = 2;
                setup();
            }
        })
    }

    // bird
    if (gameStarted) {
        if (rotateStartTime !== 0 && Date.now() - rotateStartTime < 300) {
            // Obracaj ptaszka o 45 stopni przez sekundę
            birdAngle = Math.PI / -6;
        } else {
            // Ptak wraca do poprzedniego stanu obrotu
            birdAngle = -6;
            rotateStartTime = 0;
        }
        ctx.save();
        ctx.translate(canvasDivision + size[0] / 2, flyHeight + size[1] / 2);
        ctx.rotate(birdAngle);
        ctx.drawImage(img, 1199, 610, ...size, -size[0] / 2, -size[1] / 2, ...size);
        ctx.restore();

        flight += gravitation;
        flyHeight = Math.max(flyHeight + flight, 0); // Zmieniamy `Math.min` na `Math.max`, aby ptaszek nie spadał poniżej dolnej granicy canvas
    } else { // static bird
        ctx.drawImage(img, 1199, 610, ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
        flyHeight = (canvas.height / 2) - (size[1] / 2);
        // text score
        ctx.font = "50px cursive";
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeText(`Najlepszy wynik : ${bestScore}`, 280, 245);
        ctx.strokeText('Naciśnij aby grać', 290, 650);
        ctx.fillText(`Najlepszy wynik : ${bestScore}`, 280, 245);
        ctx.fillText('Naciśnij aby grać', 290, 650);
    }
    document.getElementById('bestScore').innerHTML = `Najlepszy wynik : ${bestScore}`;
    document.getElementById('score').innerHTML = `Punkty : ${score}`;
    window.requestAnimationFrame(render);
}

setup();
img.onload = render;

// keybind settings
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        flight = jump;
        gameStarted = true;
        rotateStartTime = Date.now();
    }
});

document.addEventListener('click', () => {
    flight = jump;
    gameStarted = true;
    rotateStartTime = Date.now();
});