import Project from './project';
import Task from './task';
import PubSub from 'pubsub-js';
import Storage from './storage';

export default (function Controller () {
    const _projects = Storage.getProjects();
    const addNewProject = (title) => {
        const proj = Project(title, []);
        _projects.push(proj);
        // send to dom to rerender + storage to store
        PubSub.publish('proj added', proj);
    }
    const addTask = (projectTitle, taskTitle, date, desc, priority) => {
        const task = Task(taskTitle, date, desc, priority);
        const project = findProject(projectTitle);
        if (project !== null) {
            project.appendTask(task);
            PubSub.publish('task added', project);
        } else {
            return;
        }
    }
    const findProject = (title) => {
        let correctProject;
        console.log(_projects);
        _projects.forEach(project => {
            if(project.getTitle() === title) {
                //console.log(`Title: ${title} Actual Project Title: ${project.getTitle()}`);
                correctProject = project;
            }
        })
        return correctProject;
    }
    const findTask = (projectTitle, taskTitle) => {
        const project = findProject(projectTitle);
        let correctTask;
        const tasks = project.getTasks();
        tasks.forEach(task => {
            if (task.getTitle() === taskTitle) {
                correctTask = task;
            }
        });
        return correctTask;
    }
    const toggleTask = (projectTitle, taskTitle) => {
        const task = findTask(projectTitle, taskTitle);
        const project = findProject(projectTitle)
        task.toggleComplete();
        Storage.updateTaskComplete(project, task);
    }
    const deleteTask = (projectTitle, taskTitle) => {
        const task = findTask(projectTitle, taskTitle);
        const project = findProject(projectTitle);
        project.deleteTask(task);
        PubSub.publish('task deleted', project);
    }
    return { addNewProject, addTask, findProject, findTask, toggleTask, deleteTask };
}) ();