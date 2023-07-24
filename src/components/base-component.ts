export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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