import Storage from './modules/storage';
import Dom from './modules/dom';

const projects = Storage.getProjects()
Dom.renderHome(projects);


