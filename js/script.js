// based on https://thecodingpie.com/post/how-to-build-a-todo-list-app-with-javascript-and-local-storage/


const todoForm = document.querySelector('.todo-form'); // select the todo-form
const todoInput = document.querySelector('.todo-input'); // select the input box
const todoItemsList = document.querySelector('.todo-items'); // select the <ul> with class="todo-items"
let todos = []; // array which stores every todos

// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
  event.preventDefault();   // prevent the page from reloading when submitting the form
  addTodo(todoInput.value); // call addTodo function with input box current value
});

function addTodo(item) {
  if (item !== '') {
    // make a todo object, which has id, name, and completed properties
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // add it to todos array (either top or bottom depending on settings)
    if (window.localStorage.getItem('placeNewItem') === 'top') {
      todos.unshift(todo);
    } else {
      todos.push(todo);
    }
    addToLocalStorage(todos);

    // clear the input box value
    todoInput.value = '';
  }

}

// filter different kinds of todos
function filterItems(show) {
  let tempTodos = todos;

  if (show === 'pending') {
    tempTodos = todos.filter(function(item) {
      return item.completed !== true;
    });
  }
  else if (show === 'done') {
    tempTodos = todos.filter(function(item) {
      return item.completed !== false;
    });
  } 
  renderTodos(tempTodos);
}

// remove done items
function clearDone() {
  todos = todos.filter(function(item) {
    return item.completed !== true;
  });
  addToLocalStorage(todos);
  updateFilterMessages();
  renderTodos(tempTodos);
}

// ender given todos to screen
function renderTodos(todos) {
  todoItemsList.innerHTML = ''; // clear everything inside <ul> with class=todo-items

  todos.forEach(function(item) {
    // check if the item is completed
    const checked = item.completed ? 'checked': null;

    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);

    // if item is completed, then add a class to <li> called 'checked', which will add line-through style
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;
    // add the <li> to the <ul>
    todoItemsList.append(li);
    updateFilterMessages();
  });

}
function updateFilterMessages() {
  const all = document.getElementById('filter-all');
  const pending = document.getElementById('filter-pending');
  const done = document.getElementById('filter-done');

  const numAll = todos.length;
  const numPending = todos.filter(function(item) {return item.completed !== true;}).length;
  const numDone = numAll - numPending;

  all.innerText = 'Show All (' + numAll + ')';
  pending.innerText = 'Pending ('+ numPending + ')';
  done.innerText = 'Done ('+ numDone + ')';
}

function addToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos(todos);
}

function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}



todoItemsList.addEventListener('click', function(event) {
  if (event.target.type === 'checkbox') { // check if the event is on checkbox
    toggle(event.target.parentElement.getAttribute('data-key')); // toggle the state
  }

  else if (event.target.classList.contains('delete-button')) { // check if that is a delete-button
    deleteTodo(event.target.parentElement.getAttribute('data-key')); // get id from data-key attribute's value of parent <li>
  }
});

// toggle the value between completed and not completed
function toggle(id) {
  todos.forEach(function(item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}

function deleteTodo(id) {
  todos = todos.filter(function(item) {
    return item.id != id; // use != not !==, because here types are different. One is number and other is string
  });

  // update localStorage
  addToLocalStorage(todos);
}

// menu function
function toggleMenu(x) {
  x.classList.toggle("change");
  var menu = document.getElementById("menu");
  console.log(menu.style.display);
  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}

// function to update setting on where to place new todo items on list
function placeItems(position) {
  localStorage.setItem('placeNewItem', position);
}


// initially get everything from localStorage
getFromLocalStorage();

let copyright = document.getElementById('copyright');
if (copyright.innerHTML === '') {
  copyright.appendChild(document.createTextNode(new Date().getFullYear()))
}

new Sortable(sortablelist, {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onUpdate: function(/**Event*/evt) { // when changes happen on html, update javascript array to have new order.
    extractNewOrder();
	}
});

function extractNewOrder() {
  let sortablelist = document.getElementById('sortablelist').getElementsByTagName("li");
  let newTodos = [];
  for(let i=0; i<sortablelist.length; i++) {
    let newTodo = {};
    newTodo['id'] = sortablelist[i].getAttribute('data-key');
    newTodo['name'] = sortablelist[i].innerText.slice(0, -2).trim();
    newTodo['completed'] = sortablelist[i].classList.contains('checked');

    newTodos.push(newTodo);
  }
  todos = newTodos;
  addToLocalStorage(todos);

}