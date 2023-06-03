import {questions} from "./questions.js";

let fieldNumber = 0;
const tableGrid = document.querySelector('#table-grid')
const diceEl = document.querySelector('#dice');
const rollBtn = document.querySelector('#roll-btn');
const iconEl = document.querySelector('#user-icon');
const questionModal = document.querySelector('#question');
const messageEl = document.querySelector('#message');
rollBtn.onclick = () => rollDice();

// Init HTML table fields
questions.forEach((question, index) => {
    const gridItem = tableGrid.children[0].cloneNode()
    gridItem.innerHTML = index + 1;

    tableGrid.appendChild(gridItem)
})

const finishEl = tableGrid.children[0].cloneNode()
finishEl.innerHTML = 'Finish';
tableGrid.appendChild(finishEl)

const increaseFieldNumber = (idx) => {
    fieldNumber += idx;
    const fieldPosition = tableGrid.children[fieldNumber].getBoundingClientRect()
    iconEl.style.left = `${fieldPosition.left + 50}px`;
    iconEl.style.top = `${fieldPosition.bottom}px`;
}

increaseFieldNumber(0)

const rollDice = () => {
    diceEl.style.visibility = 'visible';
    diceEl.style.bottom = 'calc(50% - 51px)';
    rollBtn.disabled = true;

    const newNumber = Math.floor((Math.random() * 6) + 1);
    diceEl.className = 'dice';
    diceEl.classList.add(`show-${newNumber}`);

    setTimeout(() => hideDice(), 2000)
    if (fieldNumber + newNumber === questions.length + 1) {
        setTimeout(() => showMessage('You won!', true), 2000)
        increaseFieldNumber(newNumber);
    } else if (fieldNumber + newNumber > questions.length) {
        setTimeout(() => showMessage(`You need ${questions.length - fieldNumber + 1} to win!`, false, 1900), 2000)
    } else {
        setTimeout(() => askQuestion(newNumber), 2000)
    }
}

const hideDice = () => {
    diceEl.style.visibility = 'hidden'
    diceEl.style.bottom = '0';
    diceEl.className = 'dice';
    rollBtn.disabled = false;
}

const askQuestion = (newNumber) => {
    questionModal.style.display = 'flex'
    prepareQuestion(newNumber)
}

const prepareQuestion = (newNumber) => {
    const questionIdx = newNumber + fieldNumber - 1;
    const newFieldNumber = newNumber + fieldNumber;
    const questionTitle = document.createElement('h2');
    questionTitle.innerHTML = `Question for #${newFieldNumber} field`;

    const questionImg = document.createElement('img');
    questionImg.src = questions[questionIdx].imageUrl;
    questionImg.style.maxWidth = "80%";
    questionImg.style.maxHeight = "400px";

    const questionOptions = document.createElement("div");
    questionOptions.style.textAlign = 'left';

    const questionText = document.createElement("h3");
    questionText.innerHTML = questions[questionIdx].text;

    questions[questionIdx].options.forEach((option) => {
        const optionWrapper = document.createElement("div");
        optionWrapper.style.marginBottom = "8px";

        const optionInput = document.createElement("input");
        optionInput.setAttribute('type', 'radio');
        optionInput.setAttribute('value', option.id);
        optionInput.setAttribute('name', 'questionOption');
        optionInput.setAttribute('id', `option-${questions[questionIdx].id}-${option.id}`);

        const optionLabel = document.createElement("label");
        optionLabel.setAttribute('for', `option-${questions[questionIdx].id}-${option.id}`);
        optionLabel.innerHTML = option.text;

        optionWrapper.append(optionInput)
        optionWrapper.append(optionLabel)

        questionOptions.append(optionWrapper)
    })

    const optionSubmit = document.createElement("button");
    optionSubmit.classList.add("option-submit-btn");
    optionSubmit.innerHTML = "Submit";
    optionSubmit.onclick = () => checkAnswer(newNumber, questionIdx, questionOptions);

    questionModal.append(questionTitle)
    questionModal.append(questionImg)
    questionModal.append(questionText)
    questionModal.append(questionOptions)
    questionModal.append(optionSubmit)
}

const checkAnswer = (newNumber, questionIdx, questionOptions) => {
    let selectedValue = '';
    questionOptions.querySelectorAll("input").forEach((option) => {
        if (option.checked) {
            selectedValue = option.value
        }
    })

    if (selectedValue) {
        questionModal.style.display = 'none';
        questionModal.innerHTML = '';
    }

    if (parseInt(selectedValue) === questions[questionIdx].correctAnswerId) {
        increaseFieldNumber(newNumber)
        showMessage('Correct answer!', true)
    } else {
        showMessage('Incorrect answer!', false)
    }
}

const showMessage = (message, isSuccess, duration = 3000) => {
    messageEl.innerHTML = message;
    messageEl.style.display = 'block'
    messageEl.style.border = isSuccess ? '2px solid var(--success-color)' : '2px solid var(--warning-color)'
    messageEl.style.color = isSuccess ? 'var(--success-color)' : 'var(--warning-color)'

    setTimeout(() => messageEl.style.display = 'none', duration)
}
