import { Project } from "../../../Model/Project";

export class Reader {
    public create(text: string): Project {
        const project: Project = new Project();


        return project;
    }

}