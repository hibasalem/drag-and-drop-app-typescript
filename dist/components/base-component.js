export default class Component {
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
//# sourceMappingURL=base-component.js.map