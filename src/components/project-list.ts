/// <reference path="base-component.ts" />
/// <reference path="../decorators/auto-bind.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/drag-drop.ts" />

namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.ele.querySelector('ul')!.id, prjItem);
      }
    }
  
    configure(): void {
      this.ele.addEventListener('dragover', this.dragOverHandler);
      this.ele.addEventListener('dragleave', this.dragLeaveHandler);
      this.ele.addEventListener('drop', this.dropHandler);
  
  
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
  
    @autoBind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
        const listEl = this.ele.querySelector('ul')!;
        listEl.classList.add('droppable');
      }
    }
  
    @autoBind
    dragLeaveHandler(_: DragEvent): void  {
      const listEl = this.ele.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }
  
    @autoBind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        prjId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }
  }
}