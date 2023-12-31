'use strict';

const BACKSPACE_KEY = 'Backspace';
const ENTER_KEY = 'Enter';

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


setCookie("cols",getCookie("cols")); setCookie("lins",getCookie("lins")); console.log(document.cookie);

const COLUNAS = getCookie("cols"); const LINHAS = getCookie("lins"); //TAMANHO DA GRID
const MAX_NUMBER_OF_ATTEMPTS = LINHAS;

const history = [];
let CURRENTLINE = '';

function generate() {  
  var cols = document.getElementById("cols").value;
  var lins = document.getElementById("lins").value;
  setCookie("cols",cols); setCookie("lins",lins);
  window.location.reload()
}



// Get everything setup and the game responding to user actions.
const init = () => {

  console.log('🧠 Vamos treinar a mente! 💪');

  const KEYBOARD_KEYS = ['GVP', 'YOB', ''];

  // Grab the gameboard and the keyboard
  const gameBoard = document.querySelector('#board');
  const keyboard = document.querySelector('#keyboard');

  // Generate the gameboard and the keyboard
  generateBoard(gameBoard);
  generateBoard(keyboard, 3, 3, KEYBOARD_KEYS, true);  

  // Setup event listeners
  // document.addEventListener('keydown', event => onKeyDown(event.key));
  gameBoard.addEventListener('animationend', event => event.target.setAttribute('data-animation', 'idle'));
  keyboard.addEventListener('click', onKeyboardButtonClick);

}

const nextLine = (current_line) => {

  // Find the current active row
  const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

  // First, let's get all the columns in the current row set up with some base values
  currentRow.querySelectorAll('li').forEach((element, index) => {  
    element.setAttribute('data-animation', 'flip');
    // Each letter should start its animation twice as late as the letter before it
    element.style.animationDelay = `${index * 300}ms`;
    element.style.transitionDelay = `${index * 400}ms`;
  });

  history.push(CURRENTLINE);
  CURRENTLINE = '';
}

const onKeyboardButtonClick = (event) => {
  if (event.target.nodeName === 'LI') {
    onKeyDown(event.target.getAttribute('data-key'));
  }
}

const onKeyDown = (key) => {
  // Don't allow more then 6 attempts to guess the word
  if (history.length >= MAX_NUMBER_OF_ATTEMPTS) return;

  // Find the current active row
  const currentRow = document.querySelector(`#board ul[data-row='${history.length}']`);

  // Find the next empty column in the current active row
  let targetColumn = currentRow.querySelector('[data-status="empty"]');

  if (key === BACKSPACE_KEY) {
    if (targetColumn === null) {
      // Get the last column of the current active row
      // as we are on the last column
      targetColumn = currentRow.querySelector('li:last-child');
    } else {
      // Find the previous column, otherwise get the first column
      // so we always have have a column to operate on
      targetColumn = targetColumn.previousElementSibling ?? targetColumn;
    }

    // Clear the column of its content
    targetColumn.textContent = '';
    targetColumn.setAttribute('data-status', 'empty');

    // Remove the last letter from the CURRENTLINE
    CURRENTLINE = CURRENTLINE.slice(0, -1);
    if (CURRENTLINE === null) return;
    return;
  }

  if (key === ENTER_KEY) {
    if (CURRENTLINE.length < COLUNAS) { return; }
    if (CURRENTLINE.length === COLUNAS) {
      nextLine(CURRENTLINE);
    } 
    return;
  }

  // We have reached the letter limit for the guess word
  if (CURRENTLINE.length >= COLUNAS) return;

  const upperCaseLetter = key.toUpperCase();

  // On key press add the letter to the next empty column
  CURRENTLINE += upperCaseLetter;

   switch(key) {
    case ("G"):
      targetColumn.setAttribute('data-status', 'green');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case ("V"):
        targetColumn.setAttribute('data-status', 'vermelho');
        targetColumn.setAttribute('data-animation', 'pop');
    break;    
    case ("P"):
      targetColumn.setAttribute('data-status', 'pink');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case ("Y"):
      targetColumn.setAttribute('data-status', 'yellow');
      targetColumn.setAttribute('data-animation', 'pop');
      break;
    case ("O"):
      targetColumn.setAttribute('data-status', 'orange');
      targetColumn.setAttribute('data-animation', 'pop');
     break;      
    case ("B"):
      targetColumn.setAttribute('data-status', 'blue');
      targetColumn.setAttribute('data-animation', 'pop');
    break;     
    default:
      targetColumn.setAttribute('data-status', 'filled');
      targetColumn.setAttribute('data-animation', 'pop');
    }
}

const generateBoard = (board, rows = LINHAS, columns = COLUNAS, keys = [], keyboard = false) => {
  for (let row = 0; row < rows; row++) {
    const elmRow = document.createElement('ul');

    elmRow.setAttribute('data-row', row);

    for (let column = 0; column < columns; column++) {
      const elmColumn = document.createElement('li');
      elmColumn.setAttribute('data-status', 'empty');
      elmColumn.setAttribute('data-animation', 'idle');

      if (keyboard && keys.length > 0) {
        const key = keys[row].charAt(column);
        elmColumn.textContent = key;
        elmColumn.setAttribute('data-key', key);
        switch(key) {
          case ("G"):
            elmColumn.setAttribute('data-status', 'green');    
            break;
          case ("V"):
            elmColumn.setAttribute('data-status', 'vermelho');
            break;    
          case ("P"):
            elmColumn.setAttribute('data-status', 'pink');
            break;
          case ("Y"):
            elmColumn.setAttribute('data-status', 'yellow');
            break;
          case ("O"):
            elmColumn.setAttribute('data-status', 'orange');
            break;      
          case ("B"):
            elmColumn.setAttribute('data-status', 'blue');
            break;         
          }
      }

      // Skip adding any keyboard keys to the UI that are empty
      if (keyboard && elmColumn.textContent === '') continue;

      elmRow.appendChild(elmColumn);
    }

    board.appendChild(elmRow);
  }

  if (keyboard) {
    const enterKey = document.createElement('li');
    enterKey.setAttribute('data-key', ENTER_KEY);
    enterKey.textContent = ENTER_KEY;
    board.lastChild.prepend(enterKey);

    const backspaceKey = document.createElement('li');
    backspaceKey.setAttribute('data-key', BACKSPACE_KEY);
    backspaceKey.textContent = BACKSPACE_KEY;
    board.lastChild.append(backspaceKey);
  }
}

// Call the initialization function when the DOM is loaded to get
// everything setup and the game responding to user actions.
document.addEventListener('DOMContentLoaded', init);


$(document).on('click', '.popup_help', function(){
  $('.hover_help').fadeIn(250);
});
$(document).on('click', '.hover_help', function(){
  $('.hover_help').hide();
});
$(document).on('click', '.popup_info', function(){
  $('.hover_info').fadeIn(250);
});
$(document).on('click', '.hover_info', function(){
  $('.hover_info').hide();
});



// IMPORTANT DONT DELETE
window.onkeydown = function (event) {
  if (event.which == 8) {
     event.preventDefault();   // turn off browser transition to the previous page
  }};
// IMPORTANT DONT DELETE
