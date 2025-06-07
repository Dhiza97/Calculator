const entry = document.getElementById("entry");
const buttons = document.querySelectorAll(".btn");
const clear = document.getElementById("clear");
const historyDisplay = document.getElementById("history");

// Store history of calculations
let history = [];

// Add event listener for the buttons
buttons.forEach(function (button) {
  button.addEventListener("click", (e) => {
    const value = button.innerText;

    // Ignore clear and equals here
    if (button.id === "clear" || value === "=") return;

    // Only allow operation if entry is not empty or "0"
    const isOperator = ["x", "÷", "+", "-", "%", "^"].includes(value);
    if (
      isOperator &&
      (entry.value === "" || entry.value === "0" || entry.value === "NaN")
    ) {
      return;
    }

    // If the entry is empty or "0", replace it with the value
    if (entry.value === "NaN" || entry.value === "0" || entry.value === "=") {
      entry.value = "";
    }

    // If the last character is an operator, replace it with the new operator
    entry.value += value;
  });
});

// Add event listener for the delete button
clear.addEventListener("click", () => {
  if (clear.id === "clear") {
    if (entry.value.length > 0) {
      entry.value = entry.value.slice(0, -1);
    }
    if (entry.value === "") {
      entry.value = "0";
    }
    return;
  }
});

// Function to handle special operators
function calculate() {
  // Prevent calculation if entry is empty, "0", or "NaN"
  if (entry.value === "" || entry.value === "0" || entry.value === "NaN") {
    return;
  }

  // Replace x and ÷ with * and / for calculation
  let expression = entry.value.replace(/x/g, "*").replace(/÷/g, "/");

  try {
    // Replace ^ with Math.pow and % with modulo
    expression = expression.replace(/(\d+)\^(\d+)/g, "Math.pow($1,$2)");
    expression = expression.replace(/(\d+)%(\d+)/g, "($1%$2)");

    // Evaluate the expression
    const result = eval(expression);
    entry.value = result;

    // Add to history, replacing * and / with x and ÷ for display
    addToHistory(
      `${expression.replace(/\*/g, "x").replace(/\//g, "÷")} = ${result}`
    );
    console.log(expression + "=" + result);
  } catch (err) {
    entry.value = "0";
  }
}

// Add to history function
function addToHistory(entryText) {
  history.unshift(entryText);
  historyDisplay.innerText = history.join("\n");
}

// Keyboard event listener
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Numbers and decimal
  if (/^[0-9.]$/.test(key)) {
    if (entry.value === "0" || entry.value === "NaN" || entry.value === "=") {
      entry.value = "";
    }
    entry.value += key;
    return;
  }

  // Operators
  const operatorMap = {
    "*": "x",
    "/": "÷",
    "+": "+",
    "-": "-",
    "%": "%",
    "^": "^",
  };

  if (operatorMap[key]) {
    // Only allow operation if entry is not empty or "0"
    if (entry.value === "" || entry.value === "0" || entry.value === "NaN") {
      return;
    }
    entry.value += operatorMap[key];
    return;
  }

  // Enter or = key for calculation
  if(key === "Enter" || key === "="){
    calculate()
    return
  }

  // Backspace key to delete last character
  if (key === "Backspace") {
    if (entry.value.length > 0) {
      entry.value = entry.value.slice(0, -1);
    }
    if (entry.value === "") {
      entry.value = "0";
    }
    return;
  }
});
