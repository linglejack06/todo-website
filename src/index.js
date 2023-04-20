import Storage from './modules/storage';
import Dom from './modules/dom';

const storage = Storage();

const projects = storage.getProjects()
Dom.renderHome(projects);


