// @ts-nocheck
import "./style.css";

class Observable {
  constructor() {
    this.observers = [];
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }

  subscribe(f) {
    this.observers.push(f);
  }
}

class TaskService {
  constructor() {
    this.tasks = [];
    this.taskObservable = new Observable();
  }

  getTaskObservable() {
    return this.taskObservable;
  }

  addTask(newTask) {
    this.tasks.push(newTask);
    this.taskObservable.notify(this.tasks);
  }
}

class TaskListComponent {
  constructor(taskService) {
    this.tasksElement = document.getElementById("tasks");

    this.taskService = taskService;
    taskService.getTaskObservable().subscribe((tasks) => this.render(tasks));
  }

  render(tasks) {
    while (this.tasksElement.hasChildNodes())
      this.tasksElement.removeChild(this.tasksElement.firstElementChild);
    tasks.forEach((task) => {
      const taskElement = document.createElement("li");
      taskElement.innerText = task;
      this.tasksElement.appendChild(taskElement);
    });
  }
}

class TaskCountComponent {
  constructor(taskService) {
    this.taskCountElement = document.getElementById("task-count");
    this.taskService = taskService;

    this.taskService
      .getTaskObservable()
      .subscribe((tasks) => this.render(tasks));
  }

  render(tasks) {
    this.taskCountElement.innerText = `${tasks.length} tasks`;
  }
}

const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

const taskService = new TaskService();
new TaskCountComponent(taskService);
new TaskListComponent(taskService);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = new FormData(e.currentTarget).get("task-input").trim();
  if (newTask) {
    taskService.addTask(newTask);
    taskInput.value = "";
  }
});
