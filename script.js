const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toRelative() {
        return new Point(
            (this.x - canvas.width / 2) / 30,
            -(this.y - canvas.height / 2) / 30
        );
    }
}

class Parabola {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    value(x) {
        return this.a * x ** 2 + this.b * x + this.c;
    }

    static FindCoordinatesFromPoints(point1, point2, point3) {
        let a = (point3.y - (point3.x * (point2.y - point1.y) + point2.x * point1.y - point1.x * point2.y) / (point2.x - point1.x)) /
            (point3.x * (point3.x - point1.x - point2.x) + point1.x * point2.x);
        let b = (point2.y - point1.y) / (point2.x - point1.x) - a * (point1.x + point2.x)
        let c = (point2.x * point1.y - point1.x * point2.y) / (point2.x - point1.x) + a * point1.x * point2.x;
        return [a, b, c];
    }
}

function DrawLineByPoints(point1, point2) {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
}

function DrawLine(x1, y1, x2, y2) {
    let pointFirst = new Point(x1, y1);
    let pointSecond = new Point(x2, y2);

    DrawLineByPoints(pointFirst, pointSecond);
}

function SetPoint(point) {
    context.beginPath();
    context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    context.fill();
}

function CanvasSettings() {
    context.lineWidth = 2;
    context.font = "11px Impact";
    let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "red");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    context.fillStyle = gradient;
}

function DrawAxis(lengthX, lengthY) {
    CanvasSettings();
    DrawLine(centerPoint.x - lengthX, centerPoint.y, centerPoint.x + lengthX, centerPoint.y);
    DrawLine(centerPoint.x, centerPoint.y - lengthY, centerPoint.x, centerPoint.y + lengthY);

    for (let number = 1, endField = cellSize; endField < lengthX; endField += cellSize, number++) {
        DrawLine(centerPoint.x + endField, centerPoint.y + 7, centerPoint.x + endField, centerPoint.y - 7); // x+
        DrawLine(centerPoint.x - endField, centerPoint.y + 7, centerPoint.x - endField, centerPoint.y - 7); // x-
        DrawLine(centerPoint.x + 7, centerPoint.y - endField, centerPoint.x - 7, centerPoint.y - endField); // y+
        DrawLine(centerPoint.x + 7, centerPoint.y + endField, centerPoint.x - 7, centerPoint.y + endField); // y-

        context.fillText(number, centerPoint.x + endField - 3, centerPoint.y - 12); // x+
        context.fillText(-number, centerPoint.x - endField - 3, centerPoint.y - 12); // x-
        context.fillText(number, centerPoint.x - 20, centerPoint.y - endField + 3); // y+
        context.fillText(-number, centerPoint.x - 23, centerPoint.y + endField + 3); // y-
    }
}

function DrawParabola(x, parabola) {
    let y = parabola.value(x);
    context.fillRect(x * cellSize + canvas.width / 2, -y * cellSize + canvas.height / 2, 2, 2);
}

function AddPoints() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    DrawAxis(310, 310);
    context.fillStyle = "#FF8C00";
    points.forEach((point) => SetPoint(point));
}

function ShowButton() {
    document.getElementById("inputApprove").disabled = false;
}

function Redraw() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    CanvasSettings();
    DrawAxis(310, 310);

    document.getElementById("inputA").value = input[0];
    document.getElementById("inputB").value = input[1];
    document.getElementById("inputC").value = input[2];

    document.getElementById("inputApprove").disabled = true;

    let parabola = new Parabola(input[0], input[1], input[2]);
    for (let i = -10, timer = 0; i < 10; i += 0.005, timer += 0.00008) {
        setTimeout(DrawParabola, 1000 * timer, i, parabola);
    }

    setTimeout(ShowButton, 1500);
}

function ChangeInputs() {
    input = [+document.getElementById("inputA").value,
        +document.getElementById("inputB").value,
        +document.getElementById("inputC").value]
}

inputs = document.querySelectorAll(".input-coefficient")
for (let input of inputs) {
    input.addEventListener("input", ChangeInputs);
}

document.getElementById("inputApprove").addEventListener("click", Redraw)

let input = []
let points = []
const cellSize = 30;
const centerPoint = new Point(canvas.height / 2, canvas.width / 2);

canvas.addEventListener("click", function (event) {
    points.push(new Point(event.offsetX, event.offsetY));
    if (points.length > 3) {
        points.shift();
    }

    AddPoints();
    if (points.length === 3) {
        [input[0], input[1], input[2]] = Parabola.FindCoordinatesFromPoints(
            points[0].toRelative(),
            points[1].toRelative(),
            points[2].toRelative());
    }
});

document.addEventListener("DOMContentLoaded", main);

function main(){
    DrawAxis(310, 310);

    document.getElementById("inputA").value = 0.2;
    document.getElementById("inputB").value = 0.12;
    document.getElementById("inputC").value = -3;

    input[0] = 0.2;
    input[1] = 0.12;
    input[2] = -3;

    Redraw();
}
