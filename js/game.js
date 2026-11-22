let bubbles = [];
let bubbleId = 1;
let score = 0;
let lives = 3;
let gameStarted = false;

let spawnTimer;
let growthTimer;

let maxSize = 80;

// Creates a new bubble
function createBubble() {
    let size = 40;

    let areaWidth = $("#game-area").width();
    let areaHeight = $("#game-area").height();

    let x = Math.random() * Math.max(0, areaWidth - size);
    let y = Math.random() * Math.max(0, areaHeight - size);

    let bubble = {
        id: bubbleId,
        size: size,
        x: x,
        y: y
    };

    bubbles.push(bubble);
    bubbleId++;

    displayBubbles();
}

// Displays all bubbles
function displayBubbles() {
    $("#game-area").empty();

    for (let i = 0; i < bubbles.length; i++) {
        let bubble = bubbles[i];

        $("#game-area").append(`
            <div class="bubble" id="bubble-${bubble.id}"
                style="
                    width: ${bubble.size}px;
                    height: ${bubble.size}px;
                    left: ${bubble.x}px;
                    top: ${bubble.y}px;
                ">
            </div>
        `);
    }
}

// Makes bubbles grow
function growBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].size += 2;
    }

    // Removes bubbles that exceed the maximum size
    let burstBubbles = bubbles.filter(function(bubble) {
        return bubble.size > maxSize;
    });

    bubbles = bubbles.filter(function(bubble) {
        return bubble.size <= maxSize;
    });

    // Deducts one life for every burst bubble
    if (burstBubbles.length > 0) {
        lives -= burstBubbles.length;

        if (lives < 0) {
            lives = 0;
        }

        $("#lives").text(lives);
    }

    displayBubbles();

    if (lives <= 0) {
        endGame();
    }
}

// Ends the game
function endGame() {
    gameStarted = false;

    clearInterval(spawnTimer);
    clearInterval(growthTimer);

    $("#message").text("Game Over! Final Score: " + score);
    $("#start-btn").prop("disabled", true);
}

// Starts the game
$("#start-btn").click(function() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;

    $("#message").text("Pop the bubbles before they burst!");
    $("#start-btn").prop("disabled", true);

    createBubble();

    // Creates new bubbles every 1.5 seconds
    spawnTimer = setInterval(function() {
        createBubble();
    }, 1500);

    // Grows bubbles every 0.5 seconds
    growthTimer = setInterval(function() {
        growBubbles();
    }, 500);
});

// Handles bubble clicking
$("#game-area").on("click", ".bubble", function() {
    if (!gameStarted) {
        return;
    }

    let clickedId = Number(this.id.replace("bubble-", ""));

    // Searches for the clicked bubble
    let selectedBubble = bubbles.find(function(bubble) {
        return bubble.id === clickedId;
    });

    if (!selectedBubble) {
        return;
    }

    // Removes the clicked bubble
    bubbles = bubbles.filter(function(bubble) {
        return bubble.id !== clickedId;
    });

    score++;
    $("#score").text(score);

    displayBubbles();
});

// Restarts the game
$("#restart-btn").click(function() {
    clearInterval(spawnTimer);
    clearInterval(growthTimer);

    bubbles = [];
    bubbleId = 1;
    score = 0;
    lives = 3;
    gameStarted = false;

    $("#score").text(score);
    $("#lives").text(lives);
    $("#message").text("Click Start Game to play!");

    $("#start-btn").prop("disabled", false);

    displayBubbles();
});
