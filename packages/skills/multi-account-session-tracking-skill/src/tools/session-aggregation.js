export function aggregateSessions(input) {
    const { date, accountSessions } = input;
    let totalSessions = 0;
    let totalDurationMinutes = 0;
    let totalArtifacts = 0;
    let totalCommits = 0;
    let totalActivities = 0;
    let totalFocusScore = 0;
    let totalTokens = 0;
    let totalInterruptions = 0;
    const accountDistribution = {};
    const focusComparison = {};
    const accomplishmentsByAccount = {};
    accountSessions.forEach((accountData) => {
        const accountId = accountData.account_id;
        const webSessions = accountData.web_chat_sessions.length;
        const codeSessions = accountData.code_sessions.length;
        const totalAcctSessions = webSessions + codeSessions;
        const webDuration = accountData.web_chat_sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
        const codeDuration = accountData.code_sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
        const acctDuration = webDuration + codeDuration;
        const artifacts = accountData.web_chat_sessions.reduce((sum, s) => sum + s.artifacts_created, 0);
        const commits = accountData.code_sessions.reduce((sum, s) => sum + s.commits, 0);
        const avgFocus = totalAcctSessions > 0
            ? (accountData.web_chat_sessions.reduce((sum, s) => sum + s.focus_score, 0) +
                accountData.code_sessions.reduce((sum, s) => sum + s.focus_score, 0)) /
                totalAcctSessions
            : 0;
        totalSessions += totalAcctSessions;
        totalDurationMinutes += acctDuration;
        totalArtifacts += artifacts;
        totalCommits += commits;
        totalActivities += accountData.github_activities.length;
        totalFocusScore += avgFocus;
        totalTokens += accountData.web_chat_sessions.reduce((sum, s) => sum + (s.context_tokens_used || 0), 0);
        focusComparison[accountId] = Math.round(avgFocus * 10) / 10;
        accountDistribution[accountId] = {
            session_count: totalAcctSessions,
            duration_minutes: acctDuration,
            artifacts: artifacts,
            percentage: 0,
        };
    });
    Object.keys(accountDistribution).forEach((accountId) => {
        accountDistribution[accountId].percentage =
            totalSessions > 0
                ? Math.round((accountDistribution[accountId].session_count / totalSessions) * 100)
                : 0;
    });
    const avgFocusScore = accountSessions.length > 0 ? Math.round((totalFocusScore / accountSessions.length) * 10) / 10 : 0;
    let productivityScore = 'medium';
    if (avgFocusScore >= 8.5 && totalSessions >= 5)
        productivityScore = 'very-high';
    else if (avgFocusScore >= 7.5 && totalSessions >= 4)
        productivityScore = 'high';
    else if (avgFocusScore < 5)
        productivityScore = 'low';
    const metrics = {
        combined: {
            total_sessions: totalSessions,
            total_duration_minutes: totalDurationMinutes,
            total_duration_hours: Math.round((totalDurationMinutes / 60) * 10) / 10,
            total_artifacts: totalArtifacts,
            total_commits: totalCommits,
            total_github_activities: totalActivities,
            average_focus_score: avgFocusScore,
            combined_productivity_score: productivityScore,
            average_energy: 4.5,
            average_stress: 1.5,
            total_interruptions: totalInterruptions,
            context_tokens_total: totalTokens,
        },
        account_distribution: accountDistribution,
        focus_comparison: focusComparison,
        productivity_per_hour: calculateProductivityPerHour(accountSessions),
    };
    const review = {
        date,
        review_type: 'multi-account-unified-daily-review',
        review_period: 'full-day',
        accounts_tracked: accountSessions.length,
        total_combined_duration_minutes: totalDurationMinutes,
        accounts: Object.fromEntries(accountSessions.map((a) => [a.account_id, a])),
        unified_metrics: metrics,
        accomplishments_by_account: accomplishmentsByAccount,
        blockers_by_account: {},
        next_day_priorities: {
            combined: [],
        },
        cross_account_analysis: {
            specialization_effectiveness: 'good',
            session_distribution: {},
            productivity_correlation: {},
            optimization_recommendations: [],
        },
    };
    return review;
}
function calculateProductivityPerHour(accountSessions) {
    const result = {};
    accountSessions.forEach((account) => {
        const totalDuration = account.web_chat_sessions.reduce((sum, s) => sum + s.duration_minutes, 0) +
            account.code_sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
        const totalArtifacts = account.web_chat_sessions.reduce((sum, s) => sum + s.artifacts_created, 0);
        const hoursWorked = totalDuration / 60;
        const artifactsPerHour = hoursWorked > 0 ? Math.round((totalArtifacts / hoursWorked) * 10) / 10 : 0;
        result[account.account_id] = artifactsPerHour;
    });
    return result;
}
export function formatUnifiedReview(review) {
    let output = '';
    output += `═══════════════════════════════════════════════════════════════\n`;
    output += `MULTI-ACCOUNT DAILY REVIEW — ${review.date}\n`;
    output += `═══════════════════════════════════════════════════════════════\n\n`;
    output += `📊 UNIFIED METRICS:\n`;
    output += `  Total Sessions: ${review.unified_metrics.combined.total_sessions}\n`;
    output += `  Combined Duration: ${review.unified_metrics.combined.total_duration_hours} hours\n`;
    output += `  Total Artifacts: ${review.unified_metrics.combined.total_artifacts}\n`;
    output += `  Average Focus: ${review.unified_metrics.combined.average_focus_score}/10\n`;
    output += `  Productivity: ${review.unified_metrics.combined.combined_productivity_score.toUpperCase()}\n\n`;
    output += `👥 ACCOUNT DISTRIBUTION:\n`;
    Object.entries(review.unified_metrics.account_distribution).forEach(([account, dist]) => {
        output += `  ${account}: ${dist.session_count} sessions (${dist.percentage}%) | ${dist.artifacts} artifacts\n`;
    });
    output += `\n═══════════════════════════════════════════════════════════════\n`;
    return output;
}
//# sourceMappingURL=session-aggregation.js.map