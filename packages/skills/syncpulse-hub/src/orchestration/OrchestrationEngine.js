export class OrchestrationEngine {
    constructor() {
        this.tasks = new Map();
        this.results = new Map();
        this.maxConcurrent = 4;
    }
    addTask(task) {
        this.tasks.set(task.id, task);
    }
    async executeParallel() {
        const queue = this.buildExecutionQueue();
        for (const batch of queue) {
            await Promise.all(batch.map(task => this.executeTask(task).catch(err => ({
                error: true,
                message: err.message
            }))));
        }
        return this.results;
    }
    buildExecutionQueue() {
        const batches = [];
        const visited = new Set();
        let remainingTasks = Array.from(this.tasks.values());
        while (remainingTasks.length > 0) {
            const batch = [];
            const batchIds = new Set();
            for (const task of remainingTasks) {
                if (task.dependencies.every(dep => visited.has(dep))) {
                    batch.push(task);
                    batchIds.add(task.id);
                }
            }
            if (batch.length === 0)
                break;
            batch.forEach(t => visited.add(t.id));
            batches.push(batch);
            remainingTasks = remainingTasks.filter(t => !batchIds.has(t.id));
        }
        return batches;
    }
    async executeTask(task) {
        try {
            await task.execute();
            this.results.set(task.id, { success: true });
        }
        catch (error) {
            this.results.set(task.id, { success: false, error });
        }
    }
}
//# sourceMappingURL=OrchestrationEngine.js.map