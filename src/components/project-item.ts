import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import Component from './base-component.js';
import { autoBind } from '../decorators/auto-bind.js';


export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

  configure(): void {
    this.ele.addEventListener('dragstart',this.dragStartHandler);
  }

  renderContent(): void {
    this.ele.querySelector('h2')!.textContent = this.project.title;
    this.ele.querySelector(
      'h3'
    )!.textContent = this.peopleCount;
    this.ele.querySelector('p')!.textContent = this.project.desc;
  }


  @autoBind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }
}  
