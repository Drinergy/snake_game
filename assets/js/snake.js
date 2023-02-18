// Loader hide when page is fully loaded
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-container");

    loader.classList.add('loader-hidden');
  

})

// Toggle Light Dark Mode
const themeToggle = document.querySelector(".ld");
let chkStatus = localStorage.getItem("status");

const toggleTheme = (theme = null) => {
    const currentTheme = document.documentElement.getAttribute('theme');

    if (themeToggle.checked) {

        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('status', 'checked');

    } else {
    
        document.documentElement.setAttribute('theme', 'light');
        localStorage.setItem('status', 'unchecked');

    }
};

// check if the checkbox is change
themeToggle.addEventListener('change', () => 
    toggleTheme(themeToggle)
)

// check if the checkbox is check or not 
const checkStatus = () => {
    if (chkStatus === 'checked') {
        themeToggle.checked = true;
    } else if (chkStatus === 'unchecked') {
        themeToggle.checked = false;
    }
}

// init light and dark mode functions
checkStatus();
toggleTheme();


// Variables for Snake Game
const playBoard = document.querySelector(".play-board");
const playerScore = document.querySelector(".score");
const playerHighScore = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const bgMusic = document.getElementById("bg_music");
const eat = document.getElementById("eatSfx");
const dead = document.getElementById("gameover");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;


let score = 0;


// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
playerHighScore.innerText = `High Score: ${highScore}`;


// play bg music
const backroundMusic = () => {
    bgMusic.volume = 0.1;
    bgMusic.play();
}

// play gameover sound
const deathSound = () => {
    dead.play();
}

const eatSound = () => {
    eat.volume = 0.2;
    eat.play();
}


// Randomly Change Food Position
function changeFoodPosition() {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}



// Game Over Handler
const handleGameOver = () => {

    deathSound();
     // clearing the Interval and Reloading the page when GameOver
    clearInterval(setIntervalId);
    Swal.fire({
        title: 'Game Over! Press OK to replay',
        imageUrl: 'assets/img/gameover.png',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'bleh',
        allowOutsideClick: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        customClass: { 
            title: 'title',
            confirmButton: 'confirm',
            popup: 'popup_container'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    })
}

// Change Direction of the snake using arrow keys
const changeDirection = e => {
    backroundMusic()
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Change Direction using control for small screens 
controls.forEach(key => {
    // Calling changeDirection on each key click and passing dataset value as an object
    key.addEventListener("click", () => changeDirection({
        key: key.dataset.key
    }));
})

const initGame = () => {
    if(gameOver) return handleGameOver();
 
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Change food position if snake eats it
    if(snakeX === foodX && snakeY === foodY) {
        eatSound();
        changeFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; /// Add 1 to score

         // if highscore is greater than score save it to local storage
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

         // display score and highscore
        playerScore.innerText = `Score: ${score}`;
        playerHighScore.innerText = `High Score: ${highScore}`;
    }


    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Making snake body grow when it eats the food
    for (let i = snakeBody.length - 1; i > 0; i--) {
         // Shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    // Setting first element of snake body to current snake position
    snakeBody[0] = [snakeX, snakeY]; 

    // check if the snake is out of bounds, if yes, set gameOver to True
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }


    // make the food turn into snake body
    for (let i = 0; i < snakeBody.length; i++) {

        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Check if snake hit the body, if yes, set gameOver to True
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

changeFoodPosition();

// Set interval and initialize game
// Interval Value == Snake speed
// Lower value == more speed. Higher Value == less speed
setIntervalId = setInterval(initGame, 90);

// execute changeDirection on keyup
document.addEventListener("keyup", changeDirection);