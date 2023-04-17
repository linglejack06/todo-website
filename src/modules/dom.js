import Controller from './controller';
import PubSub from 'pubsub-js';

export default (function Dom () {
    const _page = document.getElementById('content');
    const _projectList = document.createElement('ul');
    _projectList.classList.add('proj-list');
    const _addProjBtn = document.createElement('button');
    _addProjBtn.classList.add('new-proj-btn');
    let _taskBtn;
    const _checkBoxes = [];
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
        const btn = document.createElement('button');
        btn.classList.add('add-task-btn');
        btn.textContent = 'Add New Task';
        _taskBtn = btn;
        _basicStructure.main.appendChild(btn);
    }
    const _renderTaskCard = (task) => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container', task.getPriority());

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'completed');
        checkbox.classList.add('task-complete-check');
        _checkBoxes.push(checkbox);
        cardContainer.appendChild(checkbox);

        const title = document.createElement('h3');
        title.classList.add('task-title');
        title.textContent = task.getTitle();
        cardContainer.appendChild(title);

        const date = document.createElement('h3');
        date.classList.add('task-date');
        date.textContent = task.getFormattedDate();
        cardContainer.appendChild(date);

        _basicStructure.main.appendChild(cardContainer);
    }
    const _renderDashboard = (project) => {
        const title = document.createElement('h2');
        title.textContent = project.getTitle();
        title.classList.add('proj-title');
        _basicStructure.main.appendChild(title);
        const tasks = project.getTasks();
        if (tasks.length !== 0) {
            tasks.forEach(task => {
                _renderTaskCard(task);
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
        _renderDashboard(proj);
    }
    const _taskSubscriber = (msg, proj) => {
        _renderDashboard(proj)
    }
    PubSub.subscribe('proj added', _projSubscriber);
    PubSub.subscribe('task added', _taskSubscriber);
    return { renderHome }
}) ();