import PubSub from 'pubsub-js';
import Task from './modules/task';
import Project from './modules/project';
import Dom from './modules/dom';

// EXAMPLE
// let subscriber = (msg, data) => {
//     console.log(msg, data);
// }
// let token = PubSub.subscribe('msg', subscriber);

// PubSub.publish('msg', 'hello world');
Dom.renderHome();
