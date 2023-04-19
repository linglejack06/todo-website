import PubSub from 'pubsub-js';
import Project from './project';
import Task from './task';

export default (function Storage() {
    const _jsonProjects = []
    const storeProject = (project) => {
        const tasks = project.getTasks();
        const jsonTasks = []
        tasks.forEach(task => {
            jsonTasks.push({title: task.getTitle(), desc: task.getDesc(), priority: task.getPriority(), date: task.getDate().toString()})
        })
        const projObj = { title: project.getTitle(), tasks: jsonTasks }
        _jsonProjects.push(projObj);
        localStorage.setItem('projects', JSON.stringify(_jsonProjects))
        console.log(localStorage.getItem('projects'))
    }
    const getProjects = () => {
        const completeProjects = []
        const projects = Object.assign(JSON.parse(localStorage.getItem('rpojects')))
        projects.forEach(project => {
            const completeTasks = []
            const tasks = project.tasks;
            tasks.forEach (task => {
                completeTasks.push(Task(task.title, task.date, task.desc, task.priority))
            })
            const totalProj = Project(project.title, completeTasks)
        })
    }
    const _projSubscriber = (msg, project) => {
        storeProject(project);
        getProjects();
    }
    const _taskSubscriber = (msg, project) => {
        storeProject(project)
    }
    PubSub.subscribe('proj added', _projSubscriber);
    PubSub.subscribe('task added', _taskSubscriber);
    return {storeProject}
}) ();