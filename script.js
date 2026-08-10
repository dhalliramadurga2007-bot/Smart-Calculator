const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");
const expressionDisplay = document.getElementById("expression");

const scientificToggle = document.getElementById("scientificToggle");
const scientificPanel = document.getElementById("scientificPanel");

const themeBtn = document.getElementById("themeBtn");

const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const closeHistory = document.getElementById("closeHistory");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");


let currentNumber = "";
let previousNumber = "";
let operation = null;

let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];


// ===============================
// DISPLAY
// ===============================

function updateDisplay() {

    currentDisplay.textContent = currentNumber || "0";

    if (operation && previousNumber) {

        previousDisplay.textContent =
            `${previousNumber} ${getSymbol(operation)}`;

    } else {

        previousDisplay.textContent = "";
    }
}


function getSymbol(operation) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operation] || operation;
}


// ===============================
// NUMBERS
// ===============================

function appendNumber(number) {

    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (currentNumber === "Error") {
        currentNumber = "";
    }

    if (number === "." && currentNumber === "") {
        currentNumber = "0";
    }

    currentNumber += number;

    expressionDisplay.textContent = "Entering number";

    updateDisplay();
}


// ===============================
// OPERATIONS
// ===============================

function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    if (currentNumber === "" && previousNumber !== "") {

        operation = selectedOperation;

        updateDisplay();

        return;
    }

    if (previousNumber !== "" && operation) {

        calculate();
    }

    previousNumber = currentNumber;

    currentNumber = "";

    operation = selectedOperation;

    expressionDisplay.textContent =
        `${previousNumber} ${getSymbol(operation)}`;

    updateDisplay();
}


// ===============================
// CALCULATE
// ===============================

function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        !operation
    ) {
        return;
    }

    const first = parseFloat(previousNumber);
    const second = parseFloat(currentNumber);

    let result;

    switch (operation) {

        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":

            if (second === 0) {

                showError("Cannot divide by zero");

                return;
            }

            result = first / second;

            break;

        case "%":

            result = first % second;

            break;

        default:
            return;
    }


    result = Number(result.toFixed(10));

    addHistory(
        `${first} ${getSymbol(operation)} ${second}`,
        result
    );

    previousDisplay.textContent =
        `${first} ${getSymbol(operation)} ${second} =`;

    currentNumber = result.toString();

    previousNumber = "";

    operation = null;

    expressionDisplay.textContent = "Result";

    currentDisplay.textContent = currentNumber;
}


// ===============================
// CLEAR
// ===============================

function clearCalculator() {

    currentNumber = "";

    previousNumber = "";

    operation = null;

    expressionDisplay.textContent = "Ready";

    updateDisplay();
}


// ===============================
// DELETE
// ===============================

function deleteNumber() {

    if (currentNumber === "Error") {

        clearCalculator();

        return;
    }

    currentNumber =
        currentNumber.slice(0, -1);

    updateDisplay();
}


// ===============================
// ERROR
// ===============================

function showError(message) {

    currentDisplay.textContent = "Error";

    previousDisplay.textContent = message;

    expressionDisplay.textContent = "Calculation error";

    currentNumber = "";

    previousNumber = "";

    operation = null;
}


// ===============================
// SCIENTIFIC FUNCTIONS
// ===============================

function scientificAction(action) {

    if (currentNumber === "") {
        return;
    }

    const number = parseFloat(currentNumber);

    let result;

    switch (action) {

        case "sqrt":

            if (number < 0) {

                showError("Invalid square root");

                return;
            }

            result = Math.sqrt(number);

            break;


        case "square":

            result = number ** 2;

            break;


        case "reciprocal":

            if (number === 0) {

                showError("Cannot divide by zero");

                return;
            }

            result = 1 / number;

            break;


        case "sign":

            result = number * -1;

            break;


        case "sin":

            result = Math.sin(
                number * Math.PI / 180
            );

            break;


        case "cos":

            result = Math.cos(
                number * Math.PI / 180
            );

            break;


        case "tan":

            result = Math.tan(
                number * Math.PI / 180
            );

            break;


        case "log":

            if (number <= 0) {

                showError("Invalid logarithm");

                return;
            }

            result = Math.log10(number);

            break;


        default:
            return;
    }


    result = Number(result.toFixed(10));

    addHistory(
        `${action}(${number})`,
        result
    );

    previousDisplay.textContent =
        `${action}(${number}) =`;

    currentNumber = result.toString();

    expressionDisplay.textContent =
        "Scientific result";

    updateDisplay();
}


// ===============================
// SCIENTIFIC TOGGLE
// ===============================

scientificToggle.addEventListener(
    "change",
    () => {

        scientificPanel.classList.toggle(
            "active",
            scientificToggle.checked
        );

    }
);


// ===============================
// BUTTON EVENTS
// ===============================

document.querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                appendNumber(
                    button.dataset.number
                );

            }
        );

    });


document.querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperation(
                    button.dataset.operation
                );

            }
        );

    });


document.querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                if (
                    [
                        "sqrt",
                        "square",
                        "reciprocal",
                        "sign",
                        "sin",
                        "cos",
                        "tan",
                        "log"
                    ].includes(action)
                ) {

                    scientificAction(action);

                }

            }
        );

    });


document.querySelector(
    "[data-action='calculate']"
).addEventListener(
    "click",
    calculate
);


document.querySelector(
    "[data-action='clear']"
).addEventListener(
    "click",
    clearCalculator
);


document.querySelector(
    "[data-action='delete']"
).addEventListener(
    "click",
    deleteNumber
);


// ===============================
// KEYBOARD SUPPORT
// ===============================

document.addEventListener(
    "keydown",
    event => {

        if (
            (event.key >= "0" && event.key <= "9") ||
            event.key === "."
        ) {

            appendNumber(event.key);

        }


        if (
            ["+", "-", "*", "/", "%"]
                .includes(event.key)
        ) {

            chooseOperation(event.key);

        }


        if (
            event.key === "Enter" ||
            event.key === "="
        ) {

            event.preventDefault();

            calculate();

        }


        if (event.key === "Backspace") {

            deleteNumber();

        }


        if (event.key === "Escape") {

            clearCalculator();

        }

    }
);


// ===============================
// THEME
// ===============================

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("light");

        const icon =
            themeBtn.querySelector("i");

        if (
            document.body.classList.contains("light")
        ) {

            icon.className =
                "fa-solid fa-sun";

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            icon.className =
                "fa-solid fa-moon";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    }
);


// Load saved theme

if (
    localStorage.getItem("theme") === "light"
) {

    document.body.classList.add("light");

    themeBtn.querySelector("i").className =
        "fa-solid fa-sun";
}


// ===============================
// HISTORY
// ===============================

function addHistory(expression, result) {

    history.unshift({
        expression,
        result
    });

    if (history.length > 30) {
        history.pop();
    }

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


function renderHistory() {

    if (history.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                No calculations yet.
            </p>
        `;

        return;
    }


    historyList.innerHTML = history.map(
        (item, index) => `

            <div class="history-item"
                 data-history="${index}">

                <div class="history-expression">
                    ${item.expression}
                </div>

                <div class="history-result">
                    = ${item.result}
                </div>

            </div>

        `
    ).join("");


    document.querySelectorAll(
        "[data-history]"
    ).forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const selected =
                    history[item.dataset.history];

                currentNumber =
                    selected.result.toString();

                expressionDisplay.textContent =
                    "History result";

                updateDisplay();

                historyPanel.classList.remove(
                    "open"
                );

            }
        );

    });
}


renderHistory();


// ===============================
// HISTORY PANEL
// ===============================

historyBtn.addEventListener(
    "click",
    () => {

        historyPanel.classList.add("open");

    }
);


closeHistory.addEventListener(
    "click",
    () => {

        historyPanel.classList.remove("open");

    }
);


clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        localStorage.removeItem(
            "calculatorHistory"
        );

        renderHistory();

    }
);


// ===============================
// COPY RESULT
// ===============================

copyBtn.addEventListener(
    "click",
    async () => {

        const result =
            currentDisplay.textContent;

        if (
            result === "0" ||
            result === "Error"
        ) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                result
            );

            showToast("Result copied!");

        } catch {

            showToast("Copy failed");

        }

    }
);


// ===============================
// TOAST
// ===============================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(
        () => {
            toast.classList.remove("show");
        },
        1800
    );
}