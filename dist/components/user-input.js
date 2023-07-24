var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base-component.js';
import * as Validation from '../util/validation.js';
import { autoBind } from '../decorators/auto-bind.js';
import { projectState } from '../state/project-state.js';
export class UserInput extends Component {
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
            projectState.addProject(title, desc, peopleNum);
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
        if (!Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)) {
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
    autoBind
], UserInput.prototype, "submitHandler", null);
//# sourceMappingURL=user-input.js.map