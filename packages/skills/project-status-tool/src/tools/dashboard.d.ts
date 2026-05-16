import { Project, ProjectDashboard, HealthStatus } from '../types.js';
export interface GenerateDashboardInput {
    projects: Project[];
}
export declare function generateDashboard(input: GenerateDashboardInput): ProjectDashboard;
export declare function formatDashboard(dashboard: ProjectDashboard): string;
export declare function getHealthIndicator(health: HealthStatus): string;
//# sourceMappingURL=dashboard.d.ts.map