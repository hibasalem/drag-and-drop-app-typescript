namespace App {
  export enum ProjectStatus {
    Active,
    Finished
  }
  
  export class Project {
    constructor(
      public id: string,
      public title: string,
      public desc: string,
      public peopleNum: number,
      public status: ProjectStatus
    ) { }
  }
  
}