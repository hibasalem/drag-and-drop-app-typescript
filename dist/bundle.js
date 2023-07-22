"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateEle = document.getElementById(templateId);
            this.hostEle = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateEle.content, true);
            this.ele = importedNode.firstElementChild;
            if (newElementId) {
                this.ele.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostEle.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.ele);
        }
    }
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    function autoBind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const bindFunction = originalMethod.bind(this);
                return bindFunction;
            }
        };
        return adjDescriptor;
    }
    App.autoBind = autoBind;
})(App || (App = {}));
var App;
(function (App) {
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length > 0;
        }
        if (typeof validatableInput.value == 'string') {
            if (validatableInput.minLength != null) {
                isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
            }
            if (validatableInput.maxLength != null) {
                isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
            }
        }
        if (typeof validatableInput.value == 'number') {
            if (validatableInput.min != null) {
                isValid = isValid && validatableInput.value >= validatableInput.min;
            }
            if (validatableInput.max != null) {
                isValid = isValid && validatableInput.value <= validatableInput.max;
            }
        }
        return isValid;
    }
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListeners(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new ProjectState();
            }
            return this.instance;
        }
        addProject(title, desc, peopleNum) {
            const newProject = new App.Project(Math.random().toString(), title, desc, peopleNum, App.ProjectStatus.Active);
            this.projects.push(newProject);
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    class UserInput extends App.Component {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputElement = this.ele.querySelector("#title");
            this.descInputElement = this.ele.querySelector("#description");
            this.peopleInputElement = this.ele.querySelector("#people");
            this.configure();
        }
        configure() {
            this.ele.addEventListener('submit', this.submitHandler);
        }
        renderContent() { }
        submitHandler(e) {
            e.preventDefault();
            const userInput = this.getUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, peopleNum] = userInput;
                App.projectState.addProject(title, desc, peopleNum);
                this.clearUserInput();
            }
        }
        getUserInput() {
            const title = this.titleInputElement.value;
            const desc = this.descInputElement.value;
            const peopleNum = this.peopleInputElement.value;
            const titleValidatable = {
                value: title,
                required: true
            };
            const descriptionValidatable = {
                value: desc,
                required: true,
                minLength: 3
            };
            const peopleValidatable = {
                value: +peopleNum,
                required: true,
                min: 1,
                max: 10
            };
            if (!App.validate(titleValidatable) ||
                !App.validate(descriptionValidatable) ||
                !App.validate(peopleValidatable)) {
                alert('Invalid input, please try again!');
                return;
            }
            else {
                return [title, desc, +peopleNum];
            }
        }
        clearUserInput() {
            this.titleInputElement.value = "";
            this.descInputElement.value = "";
            this.peopleInputElement.value = "";
        }
    }
    __decorate([
        App.autoBind
    ], UserInput.prototype, "submitHandler", null);
    App.UserInput = UserInput;
})(App || (App = {}));
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, desc, peopleNum, status) {
            this.id = id;
            this.title = title;
            this.desc = desc;
            this.peopleNum = peopleNum;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
        constructor(type) {
            super("project-list", "app-section", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.ele.querySelector('ul').id = listId;
            this.ele.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = '';
            for (const prjItem of this.assignedProjects) {
                new App.ProjectItem(this.ele.querySelector('ul').id, prjItem);
            }
        }
        configure() {
            this.ele.addEventListener('dragover', this.dragOverHandler);
            this.ele.addEventListener('dragleave', this.dragLeaveHandler);
            this.ele.addEventListener('drop', this.dropHandler);
            App.projectState.addListeners((projects) => {
                const filteredProjects = projects.filter(project => {
                    if (this.type === 'active') {
                        return project.status === App.ProjectStatus.Active;
                    }
                    else {
                        return project.status === App.ProjectStatus.Finished;
                    }
                });
                this.assignedProjects = filteredProjects;
                this.renderProjects();
            });
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.ele.querySelector('ul');
                listEl.classList.add('droppable');
            }
        }
        dragLeaveHandler(_) {
            const listEl = this.ele.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData('text/plain');
            App.projectState.moveProject(prjId, this.type === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
    }
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        App.autoBind
    ], ProjectList.prototype, "dropHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    new App.UserInput();
    new App.ProjectList('active');
    new App.ProjectList('finished');
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        get peopleCount() {
            return this.project.peopleNum + (this.project.peopleNum == 1 ? ' person' : ' people') + ' assigned';
        }
        constructor(hostId, project) {
            super("single-project", hostId, true, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        configure() {
            this.ele.addEventListener('dragstart', this.dragStartHandler);
        }
        renderContent() {
            this.ele.querySelector('h2').textContent = this.project.title;
            this.ele.querySelector('h3').textContent = this.peopleCount;
            this.ele.querySelector('p').textContent = this.project.desc;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
    }
    __decorate([
        App.autoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map