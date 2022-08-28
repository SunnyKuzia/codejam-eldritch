import greenCardsData from './data/mythicCards/green/index.js';
import brownCardsData from './data/mythicCards/brown/index.js';
import blueCardsData from './data/mythicCards/blue/index.js';
import ancientsData from './data/ancients.js';
import difficultiesData from './data/difficulties.js';

const ancientsContainer = document.querySelector(".ancients-container");
const difficultiesContainer = document.querySelector(".difficulty-container");
const deckContainer = document.querySelector(".deck-container");
const currentStateContainer = document.querySelector(".current-state");

const shuffleElem = document.querySelector(".shuffle");
const deckElem = document.querySelector(".deck");
const lastCardElem = document.querySelector(".last-card");

const greenCardFirstStageCounterElem = document.querySelector('.first-stage .green');
const brownCardFirstStageCounterElem = document.querySelector('.first-stage .brown');
const blueCardFirstStageCounterElem = document.querySelector('.first-stage .blue');

const greenCardSecondStageCounterElem = document.querySelector('.second-stage .green');
const brownCardSecondStageCounterElem = document.querySelector('.second-stage .brown');
const blueCardSecondStageCounterElem = document.querySelector('.second-stage .blue');

const greenCardThirdStageCounterElem = document.querySelector('.third-stage .green');
const brownCardThirdStageCounterElem = document.querySelector('.third-stage .brown');
const blueCardThirdStageCounterElem = document.querySelector('.third-stage .blue');

let selectedBoss;
let originalBoss;
let selectedDifficulty;

let greenCardsDeck;
let brownCardsDeck;
let blueCardsDeck;

let currentStage = 1;
let currentStageCardsCount;
let currentStageDeck;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const difficultyRules = {
    "very_easy": (cards, cardsNumber) => {
        //make array sorted randomly [снежинки сначало, потом обычные карты]
        let easyCards = cards.filter(card => card.difficulty == "easy");
        let normalCards = cards.filter(card => card.difficulty == "normal");
        shuffle(easyCards);
        shuffle(normalCards);
        return [...easyCards, ...normalCards].slice(0, cardsNumber);
    },
    "easy": (cards, cardsNumber) => {
        let filteredCards = cards.filter(card => card.difficulty != "hard");
        shuffle(filteredCards);
        return filteredCards.slice(0, cardsNumber);
    },
    "normal": (cards, cardsNumber) => {
        shuffle(cards);
        return [...cards].slice(0, cardsNumber);
    },
    "hard": (cards, cardsNumber) => {
        let filteredCards = cards.filter(card => card.difficulty != "easy");
        shuffle(filteredCards);
        return filteredCards.slice(0, cardsNumber);
    },
    "very_hard": (cards, cardsNumber) => {
        let hardCards = cards.filter(card => card.difficulty == "hard");
        let normalCards = cards.filter(card => card.difficulty == "normal");
        shuffle(hardCards);
        shuffle(normalCards);
        return [...hardCards, ...normalCards].slice(0, cardsNumber);
    }
}

function restartGame() {
    if (originalBoss && selectedDifficulty) {
        shuffleElem.classList.remove('hidden');
        currentStateContainer.classList.add('hidden');
    }
}

function selectBoss(boss) {
    originalBoss = boss;
    restartGame();
}

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    restartGame();
}

for (let ancient of ancientsData) {
    const ancientElem = document.createElement("div");
    ancientElem.classList.add("ancient");
    ancientElem.style.backgroundImage = `url(${ancient.cardFace})`;
    ancientElem.addEventListener('click', () => {
        console.log("Кликнули на эншента");
        selectBoss(ancient);
        let ancientsArray = document.querySelectorAll('.ancient');
        ancientsArray.forEach((elem) => elem.classList.remove('selected'));
        ancientElem.classList.add('selected');
        difficultiesContainer.classList.remove('invisible');
    });
    ancientsContainer.append(ancientElem); //создали элемент и задали поведение при клике
}

for (let difficulty of difficultiesData) {
    const difficultyElem = document.createElement("div");
    difficultyElem.classList.add("difficulty");
    difficultyElem.textContent = difficulty.name;
    difficultyElem.addEventListener('click', () => {
        console.log("Кликнули на сложность");
        selectDifficulty(difficulty);
        let difficultiesArray = document.querySelectorAll('.difficulty');
        difficultiesArray.forEach((elem) => elem.classList.remove('selected'));
        difficultyElem.classList.add('selected');
        deckContainer.classList.remove('invisible');
    });
    difficultiesContainer.append(difficultyElem); //создали элемент и задали поведение при клике
}


shuffleElem.addEventListener('click', () => {
    startShuffling();
    setCounters();
    shuffleElem.classList.add('hidden');
    currentStateContainer.classList.remove('hidden');
    deckElem.classList.remove('invisible');
    lastCardElem.classList.add('invisible');
});

function startShuffling() {
    selectedBoss = JSON.parse(JSON.stringify(originalBoss)); // deep copy of object
    const difficultyRule = difficultyRules[selectedDifficulty.id];

    const greenCardsNumber = selectedBoss.firstStage.greenCards + selectedBoss.secondStage.greenCards + selectedBoss.thirdStage.greenCards;
    greenCardsDeck = difficultyRule(greenCardsData, greenCardsNumber);

    const brownCardsNumber = selectedBoss.firstStage.brownCards + selectedBoss.secondStage.brownCards + selectedBoss.thirdStage.brownCards;
    brownCardsDeck = difficultyRule(brownCardsData, brownCardsNumber);

    const blueCardsNumber = selectedBoss.firstStage.blueCards + selectedBoss.secondStage.blueCards + selectedBoss.thirdStage.blueCards;
    blueCardsDeck = difficultyRule(blueCardsData, blueCardsNumber);

    currentStage = 1;
    createStageMiniDeck();
}

function createStageMiniDeck() {
    if (currentStage == 1) {
        currentStageCardsCount = selectedBoss.firstStage;
    } else if (currentStage == 2) {
        currentStageCardsCount = selectedBoss.secondStage;
    } else if (currentStage == 3) {
        currentStageCardsCount = selectedBoss.thirdStage;
    }

    console.log(currentStageCardsCount);

    currentStageDeck = [];
    for (let i = 0; i < currentStageCardsCount.greenCards; i++) {
        currentStageDeck.push(greenCardsDeck.pop());
    }

    for (let i = 0; i < currentStageCardsCount.blueCards; i++) {
        currentStageDeck.push(blueCardsDeck.pop());
    }

    for (let i = 0; i < currentStageCardsCount.brownCards; i++) {
        currentStageDeck.push(brownCardsDeck.pop());
    }

    shuffle(currentStageDeck);
}


function setCounters() {
    console.log("Выставляем значения в точки");
    greenCardFirstStageCounterElem.textContent = selectedBoss.firstStage.greenCards;
    brownCardFirstStageCounterElem.textContent = selectedBoss.firstStage.brownCards;
    blueCardFirstStageCounterElem.textContent = selectedBoss.firstStage.blueCards;

    greenCardSecondStageCounterElem.textContent = selectedBoss.secondStage.greenCards;
    brownCardSecondStageCounterElem.textContent = selectedBoss.secondStage.brownCards;
    blueCardSecondStageCounterElem.textContent = selectedBoss.secondStage.blueCards;

    greenCardThirdStageCounterElem.textContent = selectedBoss.thirdStage.greenCards;
    brownCardThirdStageCounterElem.textContent = selectedBoss.thirdStage.brownCards;
    blueCardThirdStageCounterElem.textContent = selectedBoss.thirdStage.blueCards;
}

function renderNextCard() {
    const card = currentStageDeck.pop();
    lastCardElem.style.backgroundImage = `url(${card.cardFace})`;
    if (card.color == "blue") {
        currentStageCardsCount.blueCards--;
    } else if (card.color == "green") {
        currentStageCardsCount.greenCards--;
    } else if (card.color == "brown") {
        currentStageCardsCount.brownCards--;
    }
    setCounters();
}

deckElem.addEventListener('click', () => {
    lastCardElem.classList.remove('invisible');
    if (currentStageDeck.length > 0) {
        renderNextCard();
    } else {
        if (currentStage == 3) {
            return;
        }
        currentStage++;
        createStageMiniDeck();
        renderNextCard();
    }

    if (currentStageDeck.length == 0 && currentStage == 3) {
        deckElem.classList.add('invisible');
    }
});







