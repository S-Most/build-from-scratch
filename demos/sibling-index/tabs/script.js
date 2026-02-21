const stack = document.getElementById('stack');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
let count = 4;

addBtn.addEventListener('click', () => {
    count++;
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = `Note ${count}`;
    stack.appendChild(note);
});

removeBtn.addEventListener('click', () => {
    if (stack.children.length > 1) {
        stack.removeChild(stack.lastElementChild);
        count--;
    }
});
