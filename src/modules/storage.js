import PubSub from 'pubsub-js';
import Project from './project';
import Task from './task';

export default (function Storage() {
    const storeProject = (project) => {
        let jsonProjects = JSON.parse(localStorage.getItem('projects'));
        if (!jsonProjects) {
            jsonProjects = [];
        }
        const tasks = project.getTasks();
        const jsonTasks = []
        tasks.forEach(task => {
            jsonTasks.push({title: task.getTitle(), desc: task.getDesc(), priority: task.getPriority(), date: task.getDate().toString()})
        })
        const projObj = { title: project.getTitle(), tasks: jsonTasks }
        jsonProjects.push(projObj);
        // prevent duplicates
        localStorage.removeItem('projects');
        localStorage.setItem('projects', JSON.stringify(jsonProjects))

    }
    const getProjects = () => {
        const completeProjects = []
        let projects = JSON.parse(localStorage.getItem('projects'))
        if (!projects) {
            storeProject(Project('Home', []));
            projects = JSON.parse(localStorage.getItem('projects'));
        }
        projects.forEach(project => {
            const completeTasks = []
            const tasks = project.tasks;
            tasks.forEach (task => {
                completeTasks.push(Task(task.title, task.date, task.desc, task.priority))
            })
            const totalProj = Project(project.title, completeTasks)
            completeProjects.push(totalProj);
        })
        console.log(completeProjects);
        return completeProjects;
    }
    const deleteTask = (project) => {
        let projects = JSON.parse(localStorage.getItem('projects'));
        let modifiedProj;
        projects.forEach(proj => {
            if (proj.title === project.getTitle()) {
                modifiedProj = proj;
                const i = projects.findIndex((projectIndex) => projectIndex === proj);
                projects.splice(i, 1);
            }
        })
        modifiedProj.tasks = project.getTasks();
        localStorage.removeItem('projects');
        localStorage.setItem('projects', JSON.stringify(projects));
        storeProject(Project(modifiedProj.title, modifiedProj.tasks));

    }
    const _projSubscriber = (msg, project) => {
        storeProject(project);
    }
    const _taskSubscriber = (msg, project) => {
        storeProject(project)
    }
    const _deleteTaskSubscriber = (msg, project) => {
        console.log('start delete')
        deleteTask(project);
    }
    PubSub.subscribe('task added', _taskSubscriber);
    PubSub.subscribe('proj added', _projSubscriber);
    PubSub.subscribe('task deleted', _deleteTaskSubscriber);
    return {storeProject, getProjects}
}) ();