export function generateDashboard(input) {
    const projects = input.projects;
    const totalProjects = projects.length;
    const completedProjects = projects.filter((p) => p.status === 'completed').length;
    const inProgressProjects = projects.filter((p) => p.status === 'in-progress').length;
    const blockedProjects = projects.filter((p) => p.status === 'blocked').length;
    const healthScores = {
        excellent: 5,
        good: 4,
        fair: 3,
        poor: 2,
        critical: 1,
    };
    const avgHealth = projects.length > 0
        ? projects.reduce((sum, p) => sum + (healthScores[p.health] || 3), 0) / projects.length
        : 5;
    const overallHealth = avgHealth >= 4.5
        ? 'excellent'
        : avgHealth >= 3.5
            ? 'good'
            : avgHealth >= 2.5
                ? 'fair'
                : avgHealth >= 1.5
                    ? 'poor'
                    : 'critical';
    const criticalRisks = projects
        .flatMap((p) => p.risks || [])
        .filter((r) => r.probability === 'high' &&
        r.impact === 'high' &&
        r.status !== 'mitigated')
        .sort((a, b) => b.title.localeCompare(a.title))
        .slice(0, 5);
    const openBlockers = projects
        .flatMap((p) => p.blockers || [])
        .filter((b) => b.status === 'open' || b.status === 'in-progress')
        .sort((a, b) => {
        const impactScore = { high: 3, medium: 2, low: 1 };
        return (impactScore[b.impact] || 0) - (impactScore[a.impact] || 0);
    })
        .slice(0, 5);
    const teamCapacity = {};
    projects.forEach((p) => {
        p.team?.forEach((member) => {
            if (!teamCapacity[member.name]) {
                teamCapacity[member.name] = 0;
            }
            teamCapacity[member.name] += member.tasksAssigned;
        });
    });
    return {
        timestamp: Date.now(),
        projects,
        totalProjects,
        completedProjects,
        inProgressProjects,
        blockedProjects,
        overallHealth,
        criticalRisks,
        openBlockers,
        teamCapacity,
    };
}
export function formatDashboard(dashboard) {
    let output = '';
    output += `═══════════════════════════════════════════════════════════════\n`;
    output += `PROJECT STATUS DASHBOARD\n`;
    output += `═══════════════════════════════════════════════════════════════\n\n`;
    output += `📊 OVERVIEW:\n`;
    output += `  Total Projects: ${dashboard.totalProjects}\n`;
    output += `  Completed: ${dashboard.completedProjects}\n`;
    output += `  In Progress: ${dashboard.inProgressProjects}\n`;
    output += `  Blocked: ${dashboard.blockedProjects}\n`;
    output += `  Overall Health: ${dashboard.overallHealth.toUpperCase()}\n\n`;
    if (dashboard.openBlockers.length > 0) {
        output += `🚧 OPEN BLOCKERS:\n`;
        dashboard.openBlockers.slice(0, 5).forEach((blocker) => {
            output += `  • [${blocker.impact.toUpperCase()}] ${blocker.title}\n`;
        });
        output += `\n`;
    }
    if (dashboard.criticalRisks.length > 0) {
        output += `⚠️ CRITICAL RISKS:\n`;
        dashboard.criticalRisks.slice(0, 5).forEach((risk) => {
            output += `  • ${risk.title}\n`;
        });
        output += `\n`;
    }
    output += `📋 PROJECT STATUS:\n`;
    dashboard.projects.forEach((project) => {
        output += `  ${project.status === 'completed' ? '✓' : '○'} ${project.name} (${project.progress}%) [${project.status}]\n`;
    });
    output += `\n═══════════════════════════════════════════════════════════════\n`;
    return output;
}
export function getHealthIndicator(health) {
    const indicators = {
        excellent: '🟢 EXCELLENT',
        good: '🟢 GOOD',
        fair: '🟡 FAIR',
        poor: '🔴 POOR',
        critical: '🔴 CRITICAL',
    };
    return indicators[health] || '⚪ UNKNOWN';
}
//# sourceMappingURL=dashboard.js.map