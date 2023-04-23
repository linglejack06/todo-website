import Storage from './modules/storage';
import Dom from './modules/dom';
import Style from './style.css';

const projects = Storage.getProjects()
Dom.renderHome(projects);
projects.forEach (proj => {
    let tasks = proj.getTasks();
    tasks.forEach(task => {
        console.log(task.isComplete())
    })
})

