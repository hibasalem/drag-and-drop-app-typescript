import Component from './base-component.js';
import * as Validation from '../util/validation.js';
import { autoBind } from '../decorators/auto-bind.js';
import { projectState } from '../state/project-state.js';

export class UserInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.ele.querySelector("#title")! as HTMLInputElement;
    this.descInputElement = this.ele.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.ele.querySelector("#people")! as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.ele.addEventListener('submit', this.submitHandler)
  }

  renderContent(): void { }

  @autoBind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, peopleNum] = userInput;
      projectState.addProject(title, desc, peopleNum);
      this.clearUserInput();
    }
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const desc = this.descInputElement.value;
    const peopleNum = this.peopleInputElement.value;

    const titleValidatable: Validation.Validatable  = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validation.Validatable  = {
      value: desc,
      required: true,
      minLength: 3
    };
    const peopleValidatable: Validation.Validatable  = {
      value: +peopleNum,
      required: true,
      min: 1,
      max: 10
    };

    if (
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [title, desc, +peopleNum];
    }

  }

  private clearUserInput() {
    this.titleInputElement.value = "";
    this.descInputElement.value = "";
    this.peopleInputElement.value = "";
  }

}
