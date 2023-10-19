import '../utilities/css/global_style.css'
import '../utilities/css/global_variables.css'
import '../css/dot_maker.css'

const box = document.querySelector('.box');
const dots = document.querySelector('#dots');
const state = [];
const redoState = [];
const buttonActions = {
    Add: "add",
    Remove: "remove",
    Undo: "undo",
    Redo: "redo",
}

document.addEventListener('click', (event) => {
    const className = event.target.getAttribute("class");

    if(className == null) {
        return;
    }

    if(className.includes("box")) {
        createDot(event.offsetX, event.offsetY);
        addOptionToList();
        updateState(buttonActions.Add);
    }

    if(className.includes("remove-position")) {
        removeDot(dots.value);
        updateOptionList();
        updateState(buttonActions.Remove);
    }
    
    if(className.includes("remove-recent")) {
        removeDot();
        updateOptionList();
        updateState(buttonActions.Remove);
    }

    if(className.includes("undo")) {
        updateState(buttonActions.Undo);
        undo();
        updateOptionList();
    }

    if(className.includes("redo")) {
        updateState(buttonActions.Redo);
        redo();
        updateOptionList();
    }

    const removeRecentButton = document.querySelector('.remove-recent');
    const removeButton = document.querySelector('.remove-position');
    const undoButton = document.querySelector('.undo');
    const redoButton = document.querySelector('.redo');
    
    // Handle disabling of buttons
    box.hasChildNodes() ? removeButton.disabled = false : removeButton.disabled = true;
    box.hasChildNodes() ? removeRecentButton.disabled = false : removeRecentButton.disabled = true;
    state.length > 0 ? undoButton.disabled = false : undoButton.disabled = true;
    redoState.length > 0 ? redoButton.disabled = false : redoButton.disabled = true;
})

function createDot(x, y) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = y + 'px';
    dot.style.left = x + 'px';
    box.appendChild(dot);
}

// Remove last dot created or a dot at a specific position
function removeDot(position = null) {
    if(box.hasChildNodes()) {
        if(position == null) {
            box.lastChild.remove();
            dots.lastChild.remove();
        } else {
            box.children[position - 1].remove();
            dots.children[position - 1].remove();
        }
    }
}

function undo() {
    const DOTS_STATE = 0;
    const OPTIONS_STATE = 1;

    // Remove last state
    state.pop();

    // Clear dots and options HTML elements
    box.replaceChildren(); // dots
    dots.replaceChildren(); // options

    // Append HTML child elements recorded in the state array
    if(state.length > 0) {
        [...state[state.length - 1][DOTS_STATE]].forEach(node => {
            document.querySelector('.box').appendChild(node);
        });

        [...state[state.length - 1][OPTIONS_STATE]].forEach(node => {
            document.querySelector('#dots').appendChild(node);
        });
    }
}

function redo() {
    const DOTS_STATE = 0;
    const OPTIONS_STATE = 1;

        // Append HTML child elements recorded in the state array
        if(redoState.length > 0) {

            // Clear dots and options HTML elements
            box.replaceChildren(); // dots
            dots.replaceChildren(); // options

            [...redoState[redoState.length - 1][DOTS_STATE]].forEach(node => {
                document.querySelector('.box').appendChild(node);
            });
    
            [...redoState[redoState.length - 1][OPTIONS_STATE]].forEach(node => {
                document.querySelector('#dots').appendChild(node);
            });
        }

        // Remove last state
        redoState.pop();
}

// Adds select option to list based on no. of child elements in box
function addOptionToList() {
    const option = document.createElement('option');
    option.value = box.childElementCount;
    option.innerHTML = box.childElementCount.toString();
    dots.appendChild(option);
}

// Updates options displayed in list by numbers ascending 
function updateOptionList() {
    let count = 1;
    [...dots.children].forEach(dot => {
        dot.value = count;
        dot.innerHTML = count.toString();
        count++;
    })
}

// Updates the state & redoState array which holds a collection of performed actions
function updateState(action) {
    // Adding or Removing dots records the state
    if(action === buttonActions.Add || action === buttonActions.Remove) {
        let copy = [];
        copy.push([...box.children]);
        copy.push([...dots.children]);
        state.push(copy);

        // Clear redoState
        if(redoState.length > 0) {
            redoState.length = 0;
        }
    }

    // Pushes a copy of latest action in state array to redoState array stack
    if(action === buttonActions.Undo && state.length > 0) {
        redoState.push(state[state.length - 1]);
    }

    // Pushes a copy of latest action in redoState array to state array stack
    if(action === buttonActions.Redo && redoState.length > 0) {
        state.push(redoState[redoState.length - 1]);
    }
}