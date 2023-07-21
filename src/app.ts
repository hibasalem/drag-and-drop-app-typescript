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

type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListeners(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEle: HTMLTemplateElement;
  hostEle: T;
  ele: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEle = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEle = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateEle.content,
      true
    );
    this.ele = importedNode.firstElementChild as U;
    if (newElementId) {
      this.ele.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostEle.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.ele
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

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

class UserInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: desc,
      required: true,
      minLength: 3
    };
    const peopleValidatable: Validatable = {
      value: +peopleNum,
      required: true,
      min: 1,
      max: 10
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
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
  private project: Project;

  get peopleCount() : string {
    return this.project.peopleNum + (this.project.peopleNum == 1 ? ' person' : ' people') + ' assigned';
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure(): void { }

  renderContent(): void {
    this.ele.querySelector('h2')!.textContent = this.project.title;
    this.ele.querySelector(
      'h3'
    )!.textContent = this.peopleCount;
    this.ele.querySelector('p')!.textContent = this.project.desc;
  }

}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super(
      "project-list", "app-section", false, `${type}-projects`
    );

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.ele.querySelector('ul')!.id = listId;
    this.ele.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  renderProjects() {
    if (this.assignedProjects.length) {

      new ProjectItem ( this.ele.querySelector('ul')!.id , this.assignedProjects[this.assignedProjects.length - 1]);
    }
  }

  configure(): void {
    projectState.addListeners((projects: Project[]) => {
      const filteredProjects = projects.filter(project => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      })
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }
}

const userInput = new UserInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');