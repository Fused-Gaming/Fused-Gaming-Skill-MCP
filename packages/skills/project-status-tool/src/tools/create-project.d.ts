import { Project, ProjectStatus } from '../types.js';
export interface CreateProjectInput {
    name: string;
    description?: string;
    targetDate?: string;
    owner: string;
    teamMembers?: string[];
}
export declare function createProject(input: CreateProjectInput): Project;
export declare function updateProjectStatus(project: Project, newStatus: ProjectStatus, _notes?: string): Project;
export declare function updateProjectProgress(project: Project, tasksCompleted: number, tasksTotal: number): Project;
export declare function validateProject(project: Project): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=create-project.d.ts.map