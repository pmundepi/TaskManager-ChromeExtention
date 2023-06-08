let tasks = [];

function renderTasks() {
  let taskList = document.getElementById("tasks");
  taskList.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let listItem = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      if (checkbox.checked) {
        listItem.classList.add("completed");
      } else {
        listItem.classList.remove("completed");
      }
      saveTasks();
    });
    listItem.appendChild(checkbox);
    let span = document.createElement("span");
    span.innerText = task.title; 
    if (task.completed) {
      span.classList.add("completed");
    }
    listItem.appendChild(span);
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", function () {
      tasks.splice(i, 1);
      saveTasks();
      renderTasks();
    });
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  }
}

function saveTasks() {
  chrome.storage.sync.set({ tasks: tasks });
}

function loadTasks() {
  chrome.storage.sync.get(["tasks"], function (result) {
    if (result.tasks) {
      tasks = result.tasks;
      renderTasks();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();

  let form = document.getElementById("task-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      let input = document.getElementById("task-input");
      let title = input.value.trim();

      if (title) {
        tasks.push({ title: title, completed: false });
        saveTasks();
        renderTasks();
        input.value = "";
        input.focus();
      }
    });
  }
});
