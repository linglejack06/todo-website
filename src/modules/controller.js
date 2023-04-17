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
            project.appendTask(task);
            PubSub.publish('task added', project);
        } else {
            return;
        }
    }
    const findProject = (title) => {
        let correctProject;
        _projects.forEach(project => {
            if(project.getTitle() === title) {
                correctProject = project;
            }
        })
        return correctProject;
    }
    addTask('Home Project', 'Clean home', new Date('2012-02-12'), 'clean all rooms', 'green');
    return { getDefaultProject, addNewProject, addTask };
}) ();