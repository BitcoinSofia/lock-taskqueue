function LockTaskQueue() {
    queue = [];
    isRunning = false;
    
    run = async function (task) {
        return new Promise((resolve,reject) => {
            var taskWrapper = async () => {
                try { resolve(await task()); }
                catch (error) { reject(error); }
            };
            queue.push(taskWrapper);
            runNextInQueue();
        })
    }

    runNextInQueue = async function () {
        if(isRunning) return;
        if(!queue.length) return;
        try {
            isRunning = true;
            var task = queue.splice(0,1)[0];
            await task();
        } finally {
        	isRunning = false;
            runNextInQueue();
        }
    }

    return run;
}

module.exports = () => LockTaskQueue()