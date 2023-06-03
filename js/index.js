import {questions} from "./questions.js";

let fieldIdx = 0;
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

const setNewFieldIdx = (idx) => {
    fieldIdx += idx;
    const fieldPosition = tableGrid.children[fieldIdx].getBoundingClientRect()
    iconEl.style.left = `${fieldPosition.left + 15}px`;
    iconEl.style.top = `${fieldPosition.top + 29}px`;
}

setNewFieldIdx(0)

const rollDice = () => {
    diceEl.style.visibility = 'visible';
    diceEl.style.bottom = 'calc(50% - 51px)';
    rollBtn.disabled = true;
    const newNumber = Math.floor((Math.random() * 6) + 1);
    const isSameNumber = diceEl.classList.contains(`show-${newNumber}`)

    if (isSameNumber) {
        rollDice()
    } else {
        for (let i = 1; i <= 6; i++) {
            diceEl.classList.remove('show-' + i);
            if (newNumber === i) {
                diceEl.classList.add('show-' + i);
            }
        }

        setTimeout(() => askQuestion(newNumber - 1), 2000)
    }
}

const askQuestion = (newNumber) => {
    questionModal.style.display = 'flex'
    diceEl.style.visibility = 'hidden'
    diceEl.style.bottom = '0';
    rollBtn.disabled = false;

    prepareQuestion(newNumber)
}

const prepareQuestion = (newNumber) => {
    const questionIdx = newNumber + fieldIdx
    const questionTitle = document.createElement('h2');
    questionTitle.innerHTML = `Question for #${questionIdx + 1} field`;

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
    optionSubmit.onclick = () => checkAnswer(newNumber, questionOptions);

    questionModal.append(questionTitle)
    questionModal.append(questionImg)
    questionModal.append(questionText)
    questionModal.append(questionOptions)
    questionModal.append(optionSubmit)
}

const checkAnswer = (newNumber, questionOptions) => {
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

    if (parseInt(selectedValue) === questions[fieldIdx + newNumber].correctAnswerId) {
        setNewFieldIdx(newNumber + 1)
        showMessage(true)
    } else {
        showMessage(false)
    }
}

const showMessage = (isCorrect) => {
    messageEl.innerHTML = isCorrect ? 'Correct answer!' : 'Incorrect answer!';
    messageEl.style.display = 'block'
    messageEl.style.border = isCorrect ? '2px solid green' : '2px solid red'
    messageEl.style.color = isCorrect ? 'green' : 'red'

    setTimeout(() => messageEl.style.display = 'none', 3000)
}
