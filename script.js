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

let selected = null, round = 0, score = 0, activeIndex = null, questionMissed = false, workingPuzzle = [...puzzle];
const board = document.querySelector('#board'), pad = document.querySelector('#number-pad');
const feedback = document.querySelector('#feedback'), modal = document.querySelector('#quiz-modal');

function candidates() { return workingPuzzle.map((value, index) => value === 0 ? index : null).filter(Number.isInteger); }
function setTarget() { const open = candidates(); activeIndex = open[Math.floor(Math.random() * open.length)]; renderBoard(); }
function renderBoard() {
  board.innerHTML = '';
  workingPuzzle.forEach((value, index) => {
    const cell = document.createElement('button'); cell.className = `cell ${puzzle[index] ? 'given' : ''} ${index === activeIndex ? 'target' : ''} ${value && !puzzle[index] ? 'solved' : ''}`;
    cell.textContent = value || ''; cell.disabled = index !== activeIndex;
    if (index === activeIndex) cell.addEventListener('click', tryPlacement); board.append(cell);
  });
}
function renderPad() { pad.innerHTML = ''; for (let n=1;n<=9;n++) { const b=document.createElement('button'); b.className=`number ${selected===n?'selected':''}`; b.textContent=n; b.setAttribute('aria-label',`Number ${n}`); b.onclick=()=>{selected=n;renderPad();feedback.textContent='Now tap the glowing square.'}; pad.append(b); } }
function tryPlacement() {
  if (!selected) { feedback.textContent = 'Choose a number first.'; return; }
  if (selected !== solution[activeIndex]) { feedback.textContent = 'Not quite — check the row, column, and square.'; board.children[activeIndex].classList.add('mistake'); return; }
  feedback.textContent = 'Great move! Answer the lyric challenge.'; showChallenge();
}
function showChallenge() {
  const [question, choices, correct] = challenges[round]; document.querySelector('#question-title').textContent = question;
  const answers = document.querySelector('#answers'), quizFeedback = document.querySelector('#quiz-feedback'); answers.innerHTML=''; quizFeedback.textContent=''; questionMissed = false;
  choices.forEach((choice,index)=>{ const button=document.createElement('button'); button.className='answer'; button.textContent=choice; button.onclick=()=>answerQuestion(index,correct,button); answers.append(button); });
  modal.setAttribute('aria-hidden','false');
}
function answerQuestion(answer, correct, button) {
  const buttons = [...document.querySelectorAll('.answer')];
  if(answer !== correct) { questionMissed = true; button.classList.add('incorrect'); button.disabled = true; document.querySelector('#quiz-feedback').textContent='Not quite — try another answer to unlock the number.'; return; }
  buttons.forEach(b=>b.disabled=true); if (!questionMissed) score++; button.classList.add('correct'); document.querySelector('#quiz-feedback').textContent='Correct! The number is now yours.';
  setTimeout(()=>{ modal.setAttribute('aria-hidden','true'); workingPuzzle[activeIndex]=solution[activeIndex]; round++; selected=null; update(); }, 1150);
}
function update() {
  document.querySelector('#score').textContent=score; document.querySelector('#round').textContent=Math.min(round+1,10); document.querySelector('#progress').style.width=`${round*10}%`;
  if(round === 10) { renderBoard(); finish(); return; } setTarget(); renderPad(); feedback.textContent='Choose a number to continue.';
}
function finish() { document.querySelector('#final-score').textContent=score; document.querySelector('#result-message').textContent=score > 8 ? 'Skills validated ✦ You know your Celine classics!' : 'Lovely work! Play again to see if you can validate your skills.'; document.querySelector('#finish-screen').hidden=false; }
document.querySelector('#play-again').onclick=()=>{ selected=null;round=0;score=0;activeIndex=null;questionMissed=false;workingPuzzle=[...puzzle];document.querySelector('#finish-screen').hidden=true;update(); };
update();
