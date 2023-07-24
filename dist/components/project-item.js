var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base-component.js';
import { autoBind } from '../decorators/auto-bind.js';
export class ProjectItem extends Component {
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
    autoBind
], ProjectItem.prototype, "dragStartHandler", null);
//# sourceMappingURL=project-item.js.map