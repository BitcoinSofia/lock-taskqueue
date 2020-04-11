class TaskQueue {
    queue = [];
    isRunning = false;
    
    run = async function (task) {
        return new Promise((resolve,reject) => {
            var taskWrapper = async () => {
                try { resolve(await task()); }
                catch (error) { reject(error); }
            };
            this.queue.push(taskWrapper);
            this.runNextInQueue();
        })
    }

    runNextInQueue = async function () {
        if(this.isRunning) return;
        if(!this.queue.length) return;
        try {
            this.isRunning = true;
            var task = this.queue.splice(0,1)[0];
            await task();
        } finally {
        	this.isRunning = false;
            this.runNextInQueue();
        }
    }
}

module.exports = () => new TaskQueue().run