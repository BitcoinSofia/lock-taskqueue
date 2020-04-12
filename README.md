# Lock - Task Queue


A super simple locking mechanism. Works like a task queue.

### Install

```
npm i --save lock-taskqueue
```

### Example

```js
const Lock = require("lock-taskqueue");

const lock = Lock();

async function asyncFunction() {
    lock(() => {
        // Do work
    })
}
```

The lock can also return values from the passed function. If the value from the code in the lock is a Promise - it will be awaited. 

```js
async function getValue() {
    return await lock(() => somewhere.getValueAsync())
}

// these calls will run in a queue
getValue().then(console.log)
getValue().then(console.log)
getValue().then(console.log)
getValue().then(console.log)
```

You can have more than one lock object.

```js
const Lock = require("lock-taskqueue");

const dbLock = Lock();
const fileLock = Lock();

async function useFile() {
    return await lock(() => {
        // Do work on file
    })
}

async function useDb() {
    return await lock(() => {
        // Do work on DB
    })
}
```

Lastly, here are some details about how it actually works:

```js
await   lock(getValue).then(console.log)        // 1 task in queue, awaited
        lock(getValue).then(console.log)        // 1 tasks in queue
        lock(getValue).then(console.log)        // 2 tasks in queue
await   lock(getValue).then(console.log)        // 3 tasks in queue, all awaited.
        lock(getValue).then(console.log)        // 1 task in queue
await   lock(getValue).then(console.log)        // 2 tasks in queue, all awaited.
```
