enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public peopleNum: number,
    public status: ProjectStatus
  ) { }
}

class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() { }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, desc: string, peopleNum: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      peopleNum,
      ProjectStatus.Active
    )
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  addListeners(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }
}

const projectState = ProjectState.getInstance();


function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const bindFunction = originalMethod.bind(this);
      return bindFunction;
    }
  }

  return adjDescriptor;
}

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

class UserInput {
  templateEle: HTMLTemplateElement;
  hostEle: HTMLDivElement;
  ele: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateEle = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostEle = document.getElementById("app")! as HTMLDivElement;

    const importedEle = document.importNode(this.templateEle.content, true);
    this.ele = importedEle.firstElementChild as HTMLFormElement;
    this.ele.id = "user-input";

    this.titleInputElement = this.ele.querySelector("#title")! as HTMLInputElement;
    this.descInputElement = this.ele.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.ele.querySelector("#people")! as HTMLInputElement;

    this.configure();

    this.hostEle.insertAdjacentElement('afterbegin', this.ele);
  }

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

  private configure() {
    this.ele.addEventListener('submit', this.submitHandler)
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const desc = this.descInputElement.value;
    const peopleNum = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: desc,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +peopleNum,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !this.validate(titleValidatable) ||
      !this.validate(descriptionValidatable) ||
      !this.validate(peopleValidatable)
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

  private validate(validatableInput: Validatable) {
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

class ProjectList {
  templateEle: HTMLTemplateElement;
  hostEle: HTMLDivElement;
  ele: HTMLElement;
  assignedProjects: Project[];


  constructor(private type: 'active' | 'finished') {
    this.templateEle = document.getElementById("project-list")! as HTMLTemplateElement;
    this.hostEle = document.getElementById("app-section")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedEle = document.importNode(this.templateEle.content, true);
    this.ele = importedEle.firstElementChild as HTMLElement;
    this.ele.id = `${this.type}-projects`;

    projectState.addListeners((projects: any[]) => {
      const filteredProjects = projects.filter(project => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      })
      console.log(filteredProjects);
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });

    this.hostEle.insertAdjacentElement('beforeend', this.ele);

    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.ele.querySelector('ul')!.id = listId;
    this.ele.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    if (this.assignedProjects.length ){
      const listItem = document.createElement('li');
      listItem.textContent = this.assignedProjects[this.assignedProjects.length - 1].title;
      listEl.appendChild(listItem);
    }
  }
}

const userInput = new UserInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');