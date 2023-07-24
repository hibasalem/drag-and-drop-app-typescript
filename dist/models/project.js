export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
export class Project {
    constructor(id, title, desc, peopleNum, status) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.peopleNum = peopleNum;
        this.status = status;
    }
}
//# sourceMappingURL=project.js.map