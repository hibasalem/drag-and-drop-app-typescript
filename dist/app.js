"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, desc, peopleNum, status) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.peopleNum = peopleNum;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }
    addProject(title, desc, peopleNum) {
        const newProject = new Project(Math.random().toString(), title, desc, peopleNum, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
    addListeners(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
const projectState = ProjectState.getInstance();
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
class UserInput {
    constructor() {
        this.templateEle = document.getElementById("project-input");
        this.hostEle = document.getElementById("app");
        const importedEle = document.importNode(this.templateEle.content, true);
        this.ele = importedEle.firstElementChild;
        this.ele.id = "user-input";
        this.titleInputElement = this.ele.querySelector("#title");
        this.descInputElement = this.ele.querySelector("#description");
        this.peopleInputElement = this.ele.querySelector("#people");
        this.configure();
        this.hostEle.insertAdjacentElement('afterbegin', this.ele);
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, peopleNum] = userInput;
            projectState.addProject(title, desc, peopleNum);
            this.clearUserInput();
        }
    }
    configure() {
        this.ele.addEventListener('submit', this.submitHandler);
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
            minLength: 5
        };
        const peopleValidatable = {
            value: +peopleNum,
            required: true,
            min: 1,
            max: 5
        };
        if (!this.validate(titleValidatable) ||
            !this.validate(descriptionValidatable) ||
            !this.validate(peopleValidatable)) {
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
    validate(validatableInput) {
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
}
__decorate([
    autoBind
], UserInput.prototype, "submitHandler", null);
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateEle = document.getElementById("project-list");
        this.hostEle = document.getElementById("app-section");
        this.assignedProjects = [];
        const importedEle = document.importNode(this.templateEle.content, true);
        this.ele = importedEle.firstElementChild;
        this.ele.id = `${this.type}-projects`;
        projectState.addListeners((projects) => {
            const filteredProjects = projects.filter(project => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                else {
                    return project.status === ProjectStatus.Finished;
                }
            });
            console.log(filteredProjects);
            this.assignedProjects = filteredProjects;
            this.renderProjects();
        });
        this.hostEle.insertAdjacentElement('beforeend', this.ele);
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.ele.querySelector('ul').id = listId;
        this.ele.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        if (this.assignedProjects.length) {
            const listItem = document.createElement('li');
            listItem.textContent = this.assignedProjects[this.assignedProjects.length - 1].title;
            listEl.appendChild(listItem);
        }
    }
}
const userInput = new UserInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
//# sourceMappingURL=app.js.map