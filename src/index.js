import PubSub from 'pubsub-js';
import Task from './modules/task'
// EXAMPLE
// let subscriber = (msg, data) => {
//     console.log(msg, data);
// }
// let token = PubSub.subscribe('msg', subscriber);

// PubSub.publish('msg', 'hello world');
let task = Task('clean dogs', new Date('2015-02-12'), 'clean dogs with soap', 'orange');
console.log(task);
