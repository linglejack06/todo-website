import Project from './project';
import Task from './task';
import Dom from './dom';
import PubSub from 'pubsub-js';

export default (function Controller () {
    const _defaultProj = Project('Home Project');
    const _projects = [];
    _projects.push(_defaultProj);
    const getDefaultProject = () => _defaultProj;
    const addNewProject = (title) => {
        const proj = Project(title);
        // send to dom to rerender
        // console.log(proj);
        PubSub.publish('proj added', proj);
    }
    const addTask = (projectTitle, taskTitle, date, desc, priority) => {
        const task = Task(taskTitle, date, desc, priority);
        const project = findProject(projectTitle);
        if (project !== null) {
            project.addTask(task);
            PubSub.publish('task added', task);
        } else {
            return;
        }
    }
    const findProject = (title) => {
        _projects.forEach(project => {
            if(project.title === title) {
                return project;
            } 
        })
    }
    return { getDefaultProject, addNewProject, addTask };
}) ();