let bubbles = [];
let bubbleId = 1;
let score = 0;
let lives = 3;
let gameStarted = false;

let spawnTimer;
let growthTimer;

let maxSize = 80;
let growthAmount = 2;

// Creates a new bubble
function createBubble() {
    let size = 40;

    let areaWidth = $("#game-area").width();
    let areaHeight = $("#game-area").height();

    let x = Math.random() * Math.max(0, areaWidth - maxSize);
    let y = Math.random() * Math.max(0, areaHeight - maxSize);

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

// Displays and updates bubbles without recreating them
function displayBubbles() {
    let $area = $("#game-area");

    // Remove bubbles that no longer exist in the array
    $area.children(".bubble").each(function() {
        let id = Number(this.id.replace("bubble-", ""));

        let exists = bubbles.some(function(bubble) {
            return bubble.id === id;
        });

        if (!exists) {
            $(this).remove();
        }
    });

    // Update existing bubbles or create new ones
    for (let i = 0; i < bubbles.length; i++) {
        let bubble = bubbles[i];
        let $bubble = $("#bubble-" + bubble.id);

        if ($bubble.length === 0) {
            $bubble = $('<div class="bubble" id="bubble-' + bubble.id + '"></div>');
            $area.append($bubble);
        }

        $bubble.css({
            width: bubble.size + "px",
            height: bubble.size + "px",
            left: bubble.x + "px",
            top: bubble.y + "px"
        });
    }
}

// Makes bubbles grow
function growBubbles() {
    if (!gameStarted) {
        return;
    }

    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].size += growthAmount;
    }

    // Finds bubbles that reach maximum size
    let burstBubbles = bubbles.filter(function(bubble) {
        return bubble.size >= maxSize;
    });

    // Removes oversized bubbles
    bubbles = bubbles.filter(function(bubble) {
        return bubble.size < maxSize;
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

    spawnTimer = setInterval(function() {
        createBubble();
    }, 1500);

    growthTimer = setInterval(function() {
        growBubbles();
    }, 100);
});

// Handles bubble clicking
$("#game-area").on("click", ".bubble", function() {
    if (!gameStarted) {
        return;
    }

    let clickedId = Number(this.id.replace("bubble-", ""));

    let selectedBubble = bubbles.find(function(bubble) {
        return bubble.id === clickedId;
    });

    if (!selectedBubble) {
        return;
    }

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
