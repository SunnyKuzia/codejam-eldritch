import greenCardsData from './data/mythicCards/green/index.js';
import brownCardsData from './data/mythicCards/brown/index.js';
import blueCardsData from './data/mythicCards/blue/index.js';
import ancientsData from './data/ancients.js';
import difficultiesData from './data/difficulties.js';

const ancientsContainer = document.querySelector(".ancients-container");
const difficultiesContainer = document.querySelector(".difficulty-container");

let selectedBoss;
let selectedDifficulty;

for (let ancient of ancientsData) {
    const ancientElem = document.createElement("div");
    ancientElem.classList.add("ancient");
    ancientElem.style.backgroundImage = `url(${ancient.cardFace})`;
    ancientElem.addEventListener('click', () => {
        selectedBoss = ancient;
        let ancientsArray = document.querySelectorAll('.ancient');
        ancientsArray.forEach((elem) => elem.classList.remove('selected'));
        ancientElem.classList.add('selected');
        difficultiesContainer.classList.remove('hidden');
    });
    ancientsContainer.append(ancientElem);
}

for (let difficulty of difficultiesData) {
    const difficultyElem = document.createElement("div");
    difficultyElem.classList.add("difficulty");
    difficultyElem.textContent = difficulty.name;
    difficultyElem.addEventListener('click', () => {
        selectedDifficulty = difficulty;
        let difficultiesArray = document.querySelectorAll('.difficulty');
        difficultiesArray.forEach((elem) => elem.classList.remove('selected'));
        difficultyElem.classList.add('selected');
    });
    difficultiesContainer.append(difficultyElem);
}





