const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldReset = false;

document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const action = btn.dataset.action;
    const value = btn.dataset.value;

    switch (action) {
        case 'number':
            handleNumber(value);
            break;
        case 'operator':
            handleOperator(value);
            break;
        case 'equals':
            handleEquals();
            break;
        case 'clear':
            handleClear();
            break;
        case 'delete':
            handleDelete();
            break;
        case 'decimal':
            handleDecimal();
            break;
        case 'percent':
            handlePercent();
            break;
    }

    updateDisplay();
});

function handleNumber(num) {
    if (currentValue === '0' || shouldReset) {
        currentValue = num;
        shouldReset = false;
    } else {
        if (currentValue.length >= 15) return;
        currentValue += num;
    }
}

function handleOperator(op) {
    if (operator && !shouldReset) {
        handleEquals();
    }
    previousValue = currentValue;
    operator = op;
    previousDisplay.textContent = formatNumber(previousValue) + ' ' + operator;
    shouldReset = true;
}

function handleEquals() {
    if (!operator || shouldReset) return;

    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    let result;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '×':
            result = prev * curr;
            break;
        case '÷':
            result = curr === 0 ? 'Error' : prev / curr;
            break;
    }

    previousDisplay.textContent = formatNumber(previousValue) + ' ' + operator + ' ' + formatNumber(currentValue) + ' =';

    if (result === 'Error') {
        currentValue = 'Error';
    } else {
        currentValue = parseFloat(result.toFixed(10)).toString();
    }

    operator = null;
    previousValue = '';
    shouldReset = true;
}

function handleClear() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldReset = false;
    previousDisplay.textContent = '';
}

function handleDelete() {
    if (shouldReset || currentValue === 'Error') {
        currentValue = '0';
        shouldReset = false;
        return;
    }
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
}

function handleDecimal() {
    if (shouldReset) {
        currentValue = '0';
        shouldReset = false;
    }
    if (!currentValue.includes('.')) {
        currentValue += '.';
    }
}

function handlePercent() {
    if (currentValue === 'Error') return;
    currentValue = (parseFloat(currentValue) / 100).toString();
}

function formatNumber(value) {
    if (value === 'Error' || value === '') return value;
    if (value.endsWith('.')) return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ;
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

function updateDisplay() {
    currentDisplay.textContent = formatNumber(currentValue);
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
    else if (e.key === '+') handleOperator('+');
    else if (e.key === '-') handleOperator('-');
    else if (e.key === '*') handleOperator('×');
    else if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
    else if (e.key === 'Enter' || e.key === '=') handleEquals();
    else if (e.key === 'Backspace') handleDelete();
    else if (e.key === '.') handleDecimal();
    else if (e.key === '%') handlePercent();
    else if (e.key === 'Escape') handleClear();
    else return;

    updateDisplay();
});
