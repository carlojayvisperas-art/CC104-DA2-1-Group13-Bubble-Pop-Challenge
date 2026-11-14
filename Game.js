let bubbles = [];
let bubbleId = 1;
let score = 0;
let lives = 3;
let gameStarted = false;

function createBubble() {
    let size = 40;

    let areaWidth = $("#game-area").width();
    let areaHeight = $("#game-area").height();

    let x = Math.random() * (areaWidth - size);
    let y = Math.random() * (areaHeight - size);

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

$("#start-btn").click(function() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    $("#message").text("Pop the bubbles!");

    createBubble();
});

$("#game-area").on("click", ".bubble", function() {
    if (!gameStarted) {
        return;
    }

    let clickedId = Number(this.id.replace("bubble-", ""));

    let selectedBubble = bubbles.find(function(bubble) {
        return bubble.id === clickedId;
    });

    if (selectedBubble) {
        bubbles = bubbles.filter(function(bubble) {
            return bubble.id !== clickedId;
        });

        score++;

        $("#score").text(score);

        displayBubbles();

        createBubble();
    }
});

$("#restart-btn").click(function() {
    bubbles = [];
    bubbleId = 1;
    score = 0;
    lives = 3;
    gameStarted = false;

    $("#score").text(score);
    $("#lives").text(lives);
    $("#message").text("Click Start Game to play!");

    displayBubbles();
});
