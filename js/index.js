import {questions} from "./questions.js";

let fieldNumber = 0;
let spins = 0;
let points = 0;
let playerName = '';
const tableGrid = document.querySelector('#tableGrid')
const diceEl = document.querySelector('#dice');
const rollBtn = document.querySelector('#rollBtn');
const iconEl = document.querySelector('#userIcon');
const modal = document.querySelector('#modal');
const messageEl = document.querySelector('#message');
const resetBtn = document.querySelector('#resetBtn');

resetBtn.onclick = () => resetGame();
rollBtn.onclick = () => rollDice();

// Init HTML table fields
questions.sort(() => Math.random() - 0.5).forEach((question, index) => {
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

const saveUser = () => {
    const player = {
        spins, points, fieldNumber, playerName
    }

    localStorage.setItem('gdku-board-game', JSON.stringify(player))
}

const checkUser = () => {
    const player = JSON.parse(localStorage.getItem('gdku-board-game'))

    if (player) {
        playerName = player.playerName;
        fieldNumber = player.fieldNumber;
        points = player.points;
        spins = player.spins;
        document.querySelector('#points').innerText = points;
        document.querySelector('#spins').innerText = spins;

        if (fieldNumber === questions.length + 1) {
            rollBtn.disabled = true;
            rollBtn.children[0].innerText = 'You won!'
        }
    } else {
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('player-input-wrapper')
        const label = document.createElement('label');
        label.innerText = 'Full name: '
        const input = document.createElement('input')
        input.placeholder = 'Enter your full name';
        const playBtn = document.createElement('button')
        playBtn.id = 'playBtn'
        playBtn.innerText = 'Play';
        playBtn.onclick = () => {
            if (input.value) {
                playerName = input.value
                saveUser();
                modal.style.display = 'none';
                modal.innerHTML = '';
            }
        }

        inputWrapper.append(label)
        inputWrapper.append(input)
        modal.append(inputWrapper)
        modal.append(playBtn)
        modal.style.display = 'flex';
    }
}

checkUser();
increaseFieldNumber(0);

const rollDice = () => {
    spins++;
    diceEl.style.visibility = 'visible';
    diceEl.style.bottom = 'calc(50% - 51px)';
    rollBtn.disabled = true;
    document.querySelector('#spins').innerText = spins;

    const newNumber = Math.floor((Math.random() * 6) + 1);
    diceEl.className = 'dice';
    diceEl.classList.add(`show-${newNumber}`);

    setTimeout(() => hideDice(), 2000)
    if (fieldNumber + newNumber === questions.length + 1) {
        setTimeout(() => {
            rollBtn.children[0].innerText = 'You won!';
            showMessage('You won!', true)
        }, 2000)
        increaseFieldNumber(newNumber);
        saveUser();
        savePlayerToAPI();
    } else if (fieldNumber + newNumber > questions.length) {
        setTimeout(() => {
            rollBtn.disabled = false;
            showMessage(`You need ${questions.length - fieldNumber + 1} to win!`, false, 1900)
        }, 2000)
    } else {
        setTimeout(() => {
            askQuestion(newNumber);
            rollBtn.disabled = false;
        }, 2000)
    }
}

const hideDice = () => {
    diceEl.style.visibility = 'hidden'
    diceEl.style.bottom = '0';
    diceEl.className = 'dice';
}

const askQuestion = (newNumber) => {
    modal.style.display = 'flex'
    prepareQuestion(newNumber)
}

const prepareQuestion = (newNumber) => {
    const questionIdx = newNumber + fieldNumber - 1;
    const newFieldNumber = newNumber + fieldNumber;

    const questionTitle = document.createElement('h1');
    questionTitle.innerHTML = `Question for #${newFieldNumber} field`;

    const questionImg = document.createElement('img');
    questionImg.src = questions[questionIdx].imageUrl;
    questionImg.style.maxWidth = "80%";
    questionImg.style.maxHeight = "400px";

    const questionOptions = document.createElement("div");
    questionOptions.style.textAlign = 'left';

    const questionText = document.createElement("h1");
    questionText.innerHTML = questions[questionIdx].text;
    questionText.classList.add('question-text')

    questions[questionIdx].options.forEach((option) => {
        const optionWrapper = document.createElement("div");
        optionWrapper.classList.add('option-wrapper')

        const optionInput = document.createElement("input");
        optionInput.setAttribute('type', 'radio');
        optionInput.setAttribute('value', option.id);
        optionInput.setAttribute('name', 'questionOption');
        optionInput.setAttribute('id', `option-${questions[questionIdx].id}-${option.id}`);
        optionInput.setAttribute('class', 'option-input');

        const optionLabel = document.createElement("label");
        optionLabel.setAttribute('for', `option-${questions[questionIdx].id}-${option.id}`);
        optionLabel.setAttribute('class', 'option-label');
        optionLabel.innerHTML = option.text;

        optionWrapper.append(optionInput)
        optionWrapper.append(optionLabel)

        questionOptions.append(optionWrapper)
    })

    const optionSubmit = document.createElement("button");
    optionSubmit.classList.add("option-submit-btn");
    optionSubmit.innerHTML = "Submit";
    optionSubmit.onclick = () => checkAnswer(newNumber, questionIdx, questionOptions);

    modal.append(questionTitle)
    modal.append(questionImg)
    modal.append(questionText)
    modal.append(questionOptions)
    modal.append(optionSubmit)
}

const checkAnswer = (newNumber, questionIdx, questionOptions) => {
    let selectedValue = '';
    questionOptions.querySelectorAll("input").forEach((option) => {
        if (option.checked) {
            selectedValue = option.value
        }
    })

    if (selectedValue) {
        modal.style.display = 'none';
        modal.innerHTML = '';
    }

    if (parseInt(selectedValue) === questions[questionIdx].correctAnswerId) {
        increaseFieldNumber(newNumber)
        showMessage('Correct answer!', true);
        points += 2;
    } else {
        showMessage('Incorrect answer!', false)
        points -= 0.5;
    }

    document.querySelector('#points').innerText = points;
    saveUser();
}

const showMessage = (message, isSuccess, duration = 3000) => {
    messageEl.innerHTML = message;
    messageEl.style.display = 'block'
    messageEl.style.border = isSuccess ? '2px solid var(--success-color)' : '2px solid var(--warning-color)'
    messageEl.style.color = isSuccess ? 'var(--success-color)' : 'var(--warning-color)'

    setTimeout(() => messageEl.style.display = 'none', duration)
}

const resetGame = () => {
    const resetPwInput = document.getElementById('resetPw');
    if (resetPwInput.value === 'gdku1230') {
        localStorage.removeItem('gdku-board-game')
        location.reload();
    }
}

const guidGenerator = () => {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

const savePlayerToAPI = () => {
    console.log('body;]]', {id: guidGenerator(), ...JSON.parse(localStorage.getItem('gdku-board-game'))})
    fetch('https://my-json-server.typicode.com/nikolatasikj/gdku-board-game/players', {
        method: "POST",
        body: JSON.stringify({id: guidGenerator(), ...JSON.parse(localStorage.getItem('gdku-board-game'))})
    })
}
