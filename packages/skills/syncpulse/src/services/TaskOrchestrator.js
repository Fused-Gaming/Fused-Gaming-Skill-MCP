export class TaskOrchestrator {
    constructor() {
        this.executedTasks = new Map();
    }
    setSwarm(swarm) {
        this.swarm = swarm;
    }
    run(tasks, swarmId) {
        const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
        const results = [];
        for (const task of sorted) {
            task.status = "running";
            task.startedAt = Date.now();
            let assignedAgent = null;
            if (this.swarm && swarmId) {
                assignedAgent = this.swarm.assignTask(swarmId, task);
            }
            try {
                task.result = {
                    executedAt: Date.now(),
                    agentId: assignedAgent?.id,
                };
                task.status = "completed";
                const success = true;
                if (this.swarm && swarmId && assignedAgent) {
                    this.swarm.releaseTask(swarmId, assignedAgent.id, success, task.id);
                }
                results.push({ task, success });
            }
            catch (e) {
                task.status = "failed";
                task.error = e instanceof Error ? e.message : String(e);
                if (this.swarm && swarmId && assignedAgent) {
                    this.swarm.releaseTask(swarmId, assignedAgent.id, false, task.id);
                }
                results.push({ task, success: false });
            }
            task.completedAt = Date.now();
            this.executedTasks.set(task.id, results[results.length - 1]);
        }
        return results;
    }
    getTaskResult(taskId) {
        return this.executedTasks.get(taskId);
    }
    listExecutedTasks() {
        return Array.from(this.executedTasks.values());
    }
}
//# sourceMappingURL=TaskOrchestrator.js.map