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
            jsonTasks.push({title: task.getTitle(), desc: task.getDesc(), priority: task.getPriority(), date: task.getDate().toString(), isCompleted: task.isComplete()})
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
                completeTasks.push(Task(task.title, task.date, task.desc, task.priority, task.isCompleted))
            })
            const totalProj = Project(project.title, completeTasks)
            completeProjects.push(totalProj);
        })
        console.log(completeProjects);
        return completeProjects;
    }
    const storeTask = (project) => {
        let projects = JSON.parse(localStorage.getItem('projects'));
        let modifiedProj;
        projects.forEach(proj => {
            if (proj.title === project.getTitle()) {
                modifiedProj = proj;
                const i = projects.findIndex((projectIndex) => projectIndex === proj)
                projects.splice(i, 1);
            }
        })
        modifiedProj.tasks = project.getTasks();
        // temporarily add the projects array without modified
        localStorage.removeItem('projects')
        localStorage.setItem('projects', JSON.stringify(projects))
        // add the modified
        storeProject(Project(modifiedProj.title, modifiedProj.tasks))
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
        // temporarily add projects to the storage without the modified one
        localStorage.removeItem('projects');
        localStorage.setItem('projects', JSON.stringify(projects));
        // add the modified one
        storeProject(Project(modifiedProj.title, modifiedProj.tasks));

    }
    const updateTaskComplete = (project, task) => {
        // iterate through projects to find specific project needed
        let modifiedProj;
        let projects = JSON.parse(localStorage.getItem('projects'));
        projects.forEach(proj => {
            if (proj.title === project.getTitle()) {
                modifiedProj = proj;
                // remove that project from projects
                const i = projects.findIndex(projIndex => projIndex === proj);
                projects.splice(i, 1);
            }
        })
        // remove projects from storage and replace with modified array
        localStorage.removeItem('projects')
        localStorage.setItem('projects', JSON.stringify(projects))
        // find task that needs to be changed
        let modifiedTask;
        modifiedProj.tasks.forEach(jsonTask => {
            if (jsonTask.title === task.getTitle()) {
                modifiedTask = jsonTask;
                const i = modifiedProj.tasks.findIndex(taskIndex => taskIndex === jsonTask);
                // remove old task
                modifiedProj.tasks.splice(i, 1);
            }
            console.log(jsonTask);
        })
        // modify is completed value
        modifiedTask.isCompleted = task.isComplete();
        console.log(modifiedTask)
        modifiedProj.tasks.push(Task(modifiedTask.title, modifiedTask.date, modifiedTask.desc, modifiedTask.priority, modifiedTask.isComlete));
        storeProject(Project(modifiedProj.title, modifiedProj.tasks));

    }
    const _projSubscriber = (msg, project) => {
        storeProject(project);
    }
    const _taskSubscriber = (msg, project) => {
        storeTask(project)
    }
    const _deleteTaskSubscriber = (msg, project) => {
        console.log('start delete')
        deleteTask(project);
    }
    PubSub.subscribe('task added', _taskSubscriber);
    PubSub.subscribe('proj added', _projSubscriber);
    PubSub.subscribe('task deleted', _deleteTaskSubscriber);
    return {storeProject, getProjects, deleteTask, updateTaskComplete}
}) ();