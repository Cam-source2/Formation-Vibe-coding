const puzzle = [
  5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0, 0, 8, 0, 0, 7, 9
];
const solution = [
  5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7,
  8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6,
  9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9
];
const challenges = [
  ['Which song is Celine Dion’s famous power ballad about an enduring heart?', ['The Power of Love', 'My Heart Will Go On', 'Because You Loved Me'], 1],
  ['Which song thanks someone for giving strength and inspiration?', ['Because You Loved Me', 'I Drove All Night', 'Taking Chances'], 0],
  ['In “The Power of Love,” love is portrayed as what kind of force?', ['A source of strength', 'A passing memory', 'A competition'], 0],
  ['Which Celine hit is most closely associated with the film Titanic?', ['It’s All Coming Back to Me Now', 'My Heart Will Go On', 'That’s the Way It Is'], 1],
  ['“That’s the Way It Is” encourages listeners to do what when life is difficult?', ['Keep believing', 'Give up quickly', 'Avoid change'], 0],
  ['Which song title describes taking a bold leap into uncertainty?', ['Taking Chances', 'Love Can Move Mountains', 'The Colour of My Love'], 0],
  ['“I Drove All Night” tells a story of someone who travels to do what?', ['Win a race', 'Reach a loved one', 'Start a job'], 1],
  ['Which song title suggests emotions suddenly returning all at once?', ['All By Myself', 'It’s All Coming Back to Me Now', 'A New Day Has Come'], 1],
  ['“A New Day Has Come” is built around a feeling of what?', ['Fresh hope', 'Jealousy', 'Confusion'], 0],
  ['Which song title directly expresses Celine’s belief in love’s ability to overcome obstacles?', ['Love Can Move Mountains', 'Flying on My Own', 'Water from the Moon'], 0]
];

let selectedNumber = null;
let selectedCell = null;
let correctMoves = 0;
let challengeRound = 0;
let score = 0;
let questionMissed = false;
const workingPuzzle = [...puzzle];
const board = document.querySelector('#board');
const pad = document.querySelector('#number-pad');
const feedback = document.querySelector('#feedback');
const modal = document.querySelector('#quiz-modal');

function renderBoard() {
  board.innerHTML = '';
  workingPuzzle.forEach((value, index) => {
    const cell = document.createElement('button');
    const isGiven = Boolean(puzzle[index]);
    const isOpen = value === 0;
    cell.className = `cell ${isGiven ? 'given' : ''} ${isOpen ? 'open' : ''} ${value && !isGiven ? 'solved' : ''} ${index === selectedCell ? 'selected-cell' : ''}`;
    cell.textContent = value || '';
    cell.disabled = !isOpen;
    if (isOpen) cell.addEventListener('click', () => selectCell(index));
    board.append(cell);
  });
}

function renderPad() {
  pad.innerHTML = '';
  for (let number = 1; number <= 9; number++) {
    const button = document.createElement('button');
    button.className = `number ${selectedNumber === number ? 'selected' : ''}`;
    button.textContent = number;
    button.setAttribute('aria-label', `Number ${number}`);
    button.addEventListener('click', () => selectNumber(number));
    pad.append(button);
  }
}

function selectCell(index) {
  selectedCell = index;
  renderBoard();
  feedback.textContent = selectedNumber ? 'Now place your selected number.' : 'Square selected — choose a number.';
}

function selectNumber(number) {
  selectedNumber = number;
  renderPad();
  if (selectedCell === null) {
    feedback.textContent = 'Number selected — now choose an open square.';
    return;
  }
  tryPlacement();
}

function tryPlacement() {
  if (selectedNumber !== solution[selectedCell]) {
    feedback.textContent = 'Not quite — check the row, column, and square.';
    board.children[selectedCell].classList.add('mistake');
    return;
  }

  workingPuzzle[selectedCell] = selectedNumber;
  correctMoves++;
  selectedNumber = null;
  selectedCell = null;
  renderBoard();
  renderPad();

  if (correctMoves % 5 === 0 && challengeRound < challenges.length) {
    feedback.textContent = 'Five beautiful moves! Your lyric challenge is ready.';
    showChallenge();
  } else {
    feedback.textContent = 'Beautiful move — select another open square.';
    update();
  }
}

function showChallenge() {
  const [question, choices, correct] = challenges[challengeRound];
  document.querySelector('#question-title').textContent = question;
  const answers = document.querySelector('#answers');
  const quizFeedback = document.querySelector('#quiz-feedback');
  answers.innerHTML = '';
  quizFeedback.textContent = '';
  questionMissed = false;
  choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = choice;
    button.addEventListener('click', () => answerQuestion(index, correct, button));
    answers.append(button);
  });
  modal.setAttribute('aria-hidden', 'false');
}

function answerQuestion(answer, correct, button) {
  const buttons = [...document.querySelectorAll('.answer')];
  if (answer !== correct) {
    questionMissed = true;
    button.classList.add('incorrect');
    button.disabled = true;
    document.querySelector('#quiz-feedback').textContent = 'Not quite — try another answer to continue.';
    return;
  }
  buttons.forEach((choice) => { choice.disabled = true; });
  if (!questionMissed) score++;
  button.classList.add('correct');
  document.querySelector('#quiz-feedback').textContent = 'Correct! The spotlight is yours.';
  setTimeout(() => {
    modal.setAttribute('aria-hidden', 'true');
    challengeRound++;
    update();
  }, 1150);
}

function update() {
  document.querySelector('#score').textContent = score;
  document.querySelector('#round').textContent = challengeRound;
  document.querySelector('#progress').style.width = `${(correctMoves / (puzzle.filter((value) => value === 0).length)) * 100}%`;
  if (!workingPuzzle.includes(0)) {
    feedback.textContent = `Encore complete — you answered ${score} lyric challenges correctly.`;
  }
}

renderBoard();
renderPad();
update();
