import Controller from './controller';
import PubSub from 'pubsub-js';

export default (function Dom () {
    const _page = document.getElementById('content');
    const _projectList = document.createElement('ul');
    _projectList.classList.add('proj-list');
    const _addProjBtn = document.createElement('button');
    _addProjBtn.classList.add('new-proj-btn');
    const _basicStructure = (() => {
        const head = document.createElement('div');
        head.classList.add('head');
        _page.appendChild(head);
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        _page.appendChild(sidebar);
        const main = document.createElement('div');
        main.classList.add('main');
        _page.appendChild(main);
        return { head, sidebar, main };
    }) ();
    const _renderHead = (head) => {
        const title = document.createElement('h1');
        title.textContent = 'To Do It';
        title.classList.add('title');
        head.appendChild(title);
        const projectsButton = document.createElement('button');
        projectsButton.textContent = 'All Projects';
        projectsButton.classList.add('all-proj-button');
        head.appendChild(projectsButton);
    }
    const _renderSidebar = (project) => {
        _basicStructure.sidebar.innerHTML = '';
        const proj = document.createElement('li');
        proj.textContent = project.getTitle();
        proj.classList.add('proj-link');
        _projectList.appendChild(proj);
        _basicStructure.sidebar.appendChild(_projectList);
        _basicStructure.sidebar.appendChild(_addProjBtn);
    }
    const _renderTaskBtn = () => {

    }
    const _createTaskCard = () => {
        
    }
    const _renderDashboard = (project) => {
        const title = document.createElement('h2');
        title.textContent = project.getTitle();
        title.classList.add('proj-title');
        _basicStructure.main.appendChild(title);
        const tasks = project.getTasks();
        if (tasks.length !== 0) {
            tasks.forEach(task => {
                let taskCard = _createTaskCard(task);
                _basicStructure.main.appendChild(taskCard);
            });
        }
        _renderTaskBtn(); 
    }
    const renderHome = () => {
        const defaultProject = Controller.getDefaultProject()
        _renderHead(_basicStructure.head);
        _renderSidebar(defaultProject);
        _renderDashboard(defaultProject);
    }
    const _projSubscriber = (msg, proj) => {
        _renderSidebar(proj);
    }
    PubSub.subscribe('proj added', _projSubscriber);
    return { renderHome }
}) ();