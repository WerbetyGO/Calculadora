let currentInput = document.querySelector('.currentInput');
let answerScreen = document.querySelector('.answerScreen');
let buttons = document.querySelectorAll('button');
let erasebtn = document.querySelector('#erase');
let clearbtn = document.querySelector('#clear');
let evaluate = document.querySelector('#evaluate');
let lastClickedButton = null;
let realTimeScreenValue = [];
let currentExpression = ''; // Variável para armazenar a expressão atual
let currentResult = ''; // Variável para armazenar o resultado atual

clearbtn.addEventListener("click", () => {
    realTimeScreenValue = [''];
    lastClickedButton = null;
    answerScreen.innerHTML = 0;
    currentInput.className = 'currentInput';
    answerScreen.className = 'answerScreen';
    answerScreen.style.color = "rgba(150, 150, 150, 0.87)";
})

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (!btn.id.match('erase')) {
            if (btn.classList.contains('func_button')) {
                if (lastClickedButton !== null && lastClickedButton.classList.contains('func_button')) {
                    return;
                }
            }
            realTimeScreenValue.push(btn.value);
            currentExpression = realTimeScreenValue.join(''); // Atualiza a expressão atual
            currentInput.innerHTML = currentExpression;

            if (btn.classList.contains('func_button')) {
                lastClickedButton = btn;
            }
            if (btn.classList.contains('numb_button')) {
                lastClickedButton = null;
                currentResult = evaluateMath(currentExpression); // Armazena o resultado atual
                answerScreen.innerHTML = currentResult;
            }
        }

        if (btn.id.match('erase')) {
            realTimeScreenValue.pop();
            currentExpression = realTimeScreenValue.join(''); // Atualiza a expressão atual
            currentInput.innerHTML = currentExpression;
            currentResult = evaluateMath(currentExpression); // Atualiza o resultado atual
            answerScreen.innerHTML = currentResult;
        }

        if (btn.id.match('evaluate')) {
            lastClickedButton = null;
            currentInput.className = 'answerScreen';
            answerScreen.className = 'currentInput';
            answerScreen.style.color = "white";
            addToHistory(currentExpression, currentResult); // Adiciona a expressão e o resultado ao histórico
        }

        if (typeof eval(currentExpression) == 'undefined') {
            answerScreen.innerHTML = 0;
        }
    });
});

function sanitizeExpression(expression) {
    const sanitized = expression.replace(/[^0-9+\-*/()% .]/g, '');
    if (sanitized === expression) {
        return sanitized;
    }

    return null;
}

function evaluateMath(expression) {
    const sanitizedExpression = sanitizeExpression(expression);
    if (sanitizedExpression === null) {
        return undefined;
    }

    try {
        const result = Function(`"use strict"; return (${expression})`)();
        return result;
    } catch (err) {
        return err;
    }
}

let showHistoryButton = document.querySelector('#showHistory');
let historyDiv = document.querySelector('#history');

showHistoryButton.addEventListener("click", () => {
    if (historyDiv.style.display === "none" || historyDiv.style.display === "") {
        historyDiv.style.display = 'block';
    } else {
        historyDiv.style.display = 'none';
    }
});

let history = [];
let historyList = document.querySelector('#historyList');

function addToHistory(expression, result) {
    history.push({ expression, result });
    const listItem = document.createElement('li');
    listItem.textContent = `${expression} = ${result}`;
    historyList.appendChild(listItem);
}