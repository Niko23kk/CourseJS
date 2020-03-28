function sum(x, y) {
    document.getElementById("result").textContent = `${x}+${y}=${Number(x)+Number(y)}`;
}

function sub(x, y) {
    document.getElementById("result").textContent = `${x}*${y}=${Number(x)*Number(y)}`;
}

function conc(x, y) {
    document.getElementById("result").textContent = `${x}+${y}=${x+y}`;
}

function cansel() {
    document.getElementById("result").textContent = `CANSEL`;
}