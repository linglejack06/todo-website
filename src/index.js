import PubSub from "pubsub-js";
// EXAMPLE
let subscriber = (msg, data) => {
    console.log(msg, data);
}
let token = PubSub.subscribe('msg', subscriber);

PubSub.publish('msg', 'hello world');

