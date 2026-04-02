let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-Btn");
let newGameBtn = document.querySelector("#newBtn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true;
let count = 0;

const winPatt = [
    [0,1,2],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const resetGame = () => {
    turn0 = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    clearWinLine();
}

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("winner");
    }
}
const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turn0){
            box.innerText = "O";
            turn0 = false;
        }
        else{
            box.innerText = "X";
            turn0 = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();
        if (count === 9 && !isWinner){
            gameDraw();
        }
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

const checkWinner = () => {
    for(let pattern of winPatt){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != ""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                showWinner(pos1Val, pattern);
                return true;
            }
        }
    }
    return false;
};

const showWinner = (winner, pattern) => {
    msg.innerText = `Congratulations 🎉  Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    highlightWinner(pattern);
};

const highlightWinner = (pattern) => {
    pattern.forEach(idx => boxes[idx].classList.add("winner"));
    drawWinLine(pattern);
};

const clearWinLine = () => {
    const existingLine = document.querySelector(".win-line");
    if (existingLine) existingLine.remove();
};

const drawWinLine = (pattern) => {
    clearWinLine();
    const game = document.querySelector(".game");
    const gameRect = game.getBoundingClientRect();

    const getCenter = (box) => {
        const r = box.getBoundingClientRect();
        return {
            x: r.left - gameRect.left + r.width / 2,
            y: r.top - gameRect.top + r.height / 2
        };
    };

    const start = getCenter(boxes[pattern[0]]);
    const end   = getCenter(boxes[pattern[2]]);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "win-line");
    svg.setAttribute("width", gameRect.width);
    svg.setAttribute("height", gameRect.height);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);

    const length = Math.hypot(end.x - start.x, end.y - start.y);
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;

    svg.appendChild(line);
    game.appendChild(svg);

    // Trigger animation
    requestAnimationFrame(() => {
        line.style.strokeDashoffset = 0;
    });
}

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);