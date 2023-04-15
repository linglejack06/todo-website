import Project from './project';
import Task from './task';
import PubSub from 'pubsub-js';

export default (function Controller () {
    const _defaultProj = Project('Home Project');
    const getDefaultProject = () => _defaultProj;
    const addNewProject = (title) => {
        const proj = Project(title);
        // send to dom to rerender
        PubSub.publish('proj added', proj);
    }
    return { getDefaultProject, addNewProject };
}) ();