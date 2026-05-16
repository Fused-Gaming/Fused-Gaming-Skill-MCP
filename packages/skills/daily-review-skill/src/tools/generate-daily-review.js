export function generateDailyReview(input) {
    const metrics = calculateMetrics(input.sessions, input.date);
    const review = {
        date: input.date,
        sessions: input.sessions,
        metrics,
        accomplishments: input.accomplishments,
        blockers: input.blockers || [],
        nextDayPriorities: input.nextDayPriorities || [],
        notes: input.notes,
    };
    return review;
}
function calculateMetrics(sessions, date) {
    const totalSessions = sessions.length;
    const totalDurationMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalArtifacts = sessions.reduce((sum, s) => sum + (s.artifacts || 0), 0);
    const averageFocusScore = totalSessions > 0 ? sessions.reduce((sum, s) => sum + s.focusScore, 0) / totalSessions : 0;
    const categories = {};
    sessions.forEach((session) => {
        if (session.category) {
            categories[session.category] = (categories[session.category] || 0) + 1;
        }
    });
    return {
        date,
        totalSessions,
        totalDurationMinutes,
        totalArtifacts,
        averageFocusScore: Math.round(averageFocusScore * 10) / 10,
        categories: Object.keys(categories).length > 0 ? categories : undefined,
    };
}
export function formatDailyReview(review) {
    let output = '';
    output += `═══════════════════════════════════════════════════════════════\n`;
    output += `DAILY REVIEW — ${review.date}\n`;
    output += `═══════════════════════════════════════════════════════════════\n\n`;
    output += `📊 METRICS:\n`;
    output += `  Sessions: ${review.metrics.totalSessions}\n`;
    output += `  Duration: ${Math.round(review.metrics.totalDurationMinutes / 60 * 10) / 10} hours\n`;
    output += `  Artifacts: ${review.metrics.totalArtifacts}\n`;
    output += `  Focus Score: ${review.metrics.averageFocusScore}/10\n\n`;
    if (review.accomplishments.length > 0) {
        output += `✅ ACCOMPLISHMENTS:\n`;
        review.accomplishments.forEach((acc) => {
            output += `  • ${acc}\n`;
        });
        output += `\n`;
    }
    if (review.blockers.length > 0) {
        output += `🚧 BLOCKERS:\n`;
        review.blockers.forEach((blocker) => {
            const status = blocker.resolved ? '✓' : '✗';
            output += `  ${status} ${blocker.issue} (${blocker.category})\n`;
        });
        output += `\n`;
    }
    if (review.nextDayPriorities.length > 0) {
        output += `📋 NEXT DAY PRIORITIES:\n`;
        review.nextDayPriorities.forEach((priority) => {
            output += `  • ${priority}\n`;
        });
        output += `\n`;
    }
    output += `═══════════════════════════════════════════════════════════════\n`;
    return output;
}
export function assessProductivity(metrics) {
    const focusScore = metrics.averageFocusScore;
    const sessionCount = metrics.totalSessions;
    if (focusScore >= 8.5 && sessionCount >= 4)
        return 'very-high';
    if (focusScore >= 7.5 && sessionCount >= 3)
        return 'high';
    if (focusScore >= 6.0 && sessionCount >= 2)
        return 'medium';
    if (focusScore >= 4.0)
        return 'low';
    return 'very-low';
}
//# sourceMappingURL=generate-daily-review.js.map