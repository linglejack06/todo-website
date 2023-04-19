import PubSub from 'pubsub-js';

export default (function Storage() {
    const storeProject = (project) => {
        const tasks = project.getTasks();
        const jsonTasks = []
        tasks.forEach(task => {
            jsonTasks.push({title: task.getTitle(), desc: task.getDesc(), priority: task.getPriority(), date: task.getDate().toString()})
        })
        const projObj = { title: project.getTitle(), tasks: jsonTasks }
        localStorage.setItem('project', JSON.stringify(projObj))
        console.log(localStorage.getItem('project'))
    }
    const _projSubscriber = (msg, project) => {
        storeProject(project);
    }
    const _taskSubscriber = (msg, project) => {
        storeProject(project)
    }
    PubSub.subscribe('proj added', _projSubscriber);
    PubSub.subscribe('task added', _taskSubscriber);
    return {storeProject}
}) ();