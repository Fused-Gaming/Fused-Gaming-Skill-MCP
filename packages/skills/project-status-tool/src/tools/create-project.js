export function createProject(input) {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project = {
        id: projectId,
        name: input.name,
        description: input.description,
        status: 'planning',
        health: 'good',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: input.targetDate,
        progress: 0,
        stats: {
            completionPercentage: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            blockedTasks: 0,
            inProgressTasks: 0,
        },
        team: input.teamMembers
            ? input.teamMembers.map((member) => ({
                name: member,
                role: 'team-member',
                tasksAssigned: 0,
                tasksCompleted: 0,
                lastActivity: new Date().toISOString(),
            }))
            : [],
        owner: input.owner,
        updatedAt: Date.now(),
    };
    return project;
}
export function updateProjectStatus(project, newStatus, _notes) {
    return {
        ...project,
        status: newStatus,
        updatedAt: Date.now(),
    };
}
export function updateProjectProgress(project, tasksCompleted, tasksTotal) {
    const completionPercentage = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;
    let health = 'good';
    if (completionPercentage >= 90)
        health = 'excellent';
    else if (completionPercentage < 30 && project.targetDate) {
        const now = new Date();
        const target = new Date(project.targetDate);
        const daysLeft = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 7)
            health = 'poor';
    }
    return {
        ...project,
        progress: completionPercentage,
        stats: {
            ...project.stats,
            completionPercentage,
            tasksCompleted,
            tasksTotal,
        },
        health: health,
        updatedAt: Date.now(),
    };
}
export function validateProject(project) {
    const errors = [];
    if (!project.name || project.name.trim().length === 0) {
        errors.push('Project name is required');
    }
    if (!project.owner || project.owner.trim().length === 0) {
        errors.push('Project owner is required');
    }
    if (project.progress < 0 || project.progress > 100) {
        errors.push('Progress must be between 0 and 100');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=create-project.js.map