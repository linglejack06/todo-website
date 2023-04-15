import PubSub from 'pubsub-js';
import Task from './modules/task'
// EXAMPLE
// let subscriber = (msg, data) => {
//     console.log(msg, data);
// }
// let token = PubSub.subscribe('msg', subscriber);

// PubSub.publish('msg', 'hello world');
let task = Task('clean dogs', 'february', 'clean dogs with soap', 'orange');
console.log(task);
task.setDesc('boob');
console.log(task.getDesc());
