import Controller from './controller';
import PubSub from 'pubsub-js';
import Storage from './storage';

export default (function Dom () {
    const _page = document.getElementById('content');
    const _projectList = document.createElement('ul');
    _projectList.classList.add('proj-list');
    let _projects = Storage.getProjects();
    let _addProjBtn;
    let _addTaskBtn;
    let _deleteTaskBtn;
    let _taskFormBtn;
    let _closeTaskFormBtn;
    let _projFormBtn;
    let _closeProjFormBtn;
    let _currentProj;
    const _taskForm = `
        <div class='form-header'>
            <h2 class='title'>New Task</h2>
            <button type='button' class='close-form' id='close-task-form'>X</button>
        </div>
        <div class='input-container'>
            <label for='task-name'>Task Title</label>
            <input type='text' id='task-name' name='title' class='task-name' required>
        </div>
        <div class='input-container'>
            <label for='task-description'>Description</label>
            <input type='text' id='task-description' name='description' class='task-description' required>
        </div>
        <div class='input-container'>
            <label for='task-date'>Due Date</label>
            <input type='datetime-local' id='task-date' name='date' class='task-date' required>
        </div>
        <div class='input-container'>
            <label for='task-priority'>Priority</label>
            <select id='task-priority' name='priority'>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
            </select>
        </div>
        <button type='submit' class='submit-btn' id='submit-task-btn'>Add Task</button>
    `;
    const _projectForm = `
    <div class='form-header'>
        <h2 class='title'>New Project</h2>
        <button type='button' class='close-form' id='close-proj-form'>X</button>
    </div>
    <div class='input-container'>
        <label for='project-title'>Project Title</label>
        <input type='text' id='project-title' name='projectTitle' class='project-name' required>
    </div>
    <button type='submit' class='submit-btn' id='submit-proj-btn'>Add Project</button>
`
    const _checkBoxes = [];
    const _projLinks = [];
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
    }
    const _renderSidebar = () => {
        const projects = Storage.getProjects();
        _projectList.innerHTML = '';
        _basicStructure.sidebar.innerHTML = '';
        console.log(projects.length)
        projects.forEach(project => {
            const proj = document.createElement('li');
            proj.textContent = project.getTitle();
            proj.classList.add('proj-link');
            proj.dataset.project = project.getTitle();
            _projectList.appendChild(proj);
            _projLinks.push(proj);
        })
        console.log(_projectList)
        _basicStructure.sidebar.appendChild(_projectList);
        _addProjBtn = document.createElement('button');
        _addProjBtn.classList.add('new-proj-btn');
        _addProjBtn.textContent = 'Add Project';
        _basicStructure.sidebar.appendChild(_addProjBtn);
    }
    const _renderTaskBtn = () => {
        const btn = document.createElement('button');
        btn.classList.add('add-task-btn');
        btn.textContent = 'Add New Task';
        _addTaskBtn = btn;
        _basicStructure.main.appendChild(btn);
    }
    const _renderTaskCard = (task, project) => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container', task.getPriority());
        cardContainer.dataset.task = task.getTitle();
        cardContainer.dataset.project = project.getTitle();

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'completed');
        checkbox.classList.add('task-complete-check');
        checkbox.dataset.task = task.getTitle();
        checkbox.dataset.project = project.getTitle();
        // checkbox checked by default if its completed
        if (task.isComplete()) {
            checkbox.checked = true;
        }
        _checkBoxes.push(checkbox);
        cardContainer.appendChild(checkbox);
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('text-container');
        const titleDateContainer = document.createElement('div');
        titleDateContainer.classList.add('title-date-container');
        const title = document.createElement('h3');
        title.classList.add('task-title');
        title.textContent = task.getTitle();
        titleDateContainer.appendChild(title);

        const date = document.createElement('h3');
        date.classList.add('task-date');
        date.textContent = task.getFormattedDate();
        titleDateContainer.appendChild(date);
        mainContainer.appendChild(titleDateContainer);

        const desc = document.createElement('p');
        desc.classList.add('task-desc');
        desc.setAttribute('id', task.getTitle());
        desc.textContent = task.getDesc();
        mainContainer.appendChild(desc);
        cardContainer.appendChild(mainContainer);

        const btn = document.createElement('button');
        btn.classList.add('delete-task-btn');
        btn.textContent = 'X';
        btn.dataset.task = task.getTitle();
        btn.dataset.project = project.getTitle();
        _deleteTaskBtn = btn;
        _addDeleteTaskEvent(btn);
        cardContainer.appendChild(btn);

        _basicStructure.main.appendChild(cardContainer);
    }
    const _renderDashboard = (project) => {
        _basicStructure.main.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = project.getTitle();
        title.classList.add('proj-title');
        _basicStructure.main.appendChild(title);
        const tasks = project.getTasks();
        if (tasks.length !== 0) {
            tasks.forEach(task => {
                _renderTaskCard(task, project);
            });
        }
        _renderTaskBtn(); 
    }
    const _renderTaskForm = () => {
        _page.style.display = 'none';
        const newPage = document.createElement('div');
        newPage.classList.add('form-container');
        const form = document.createElement('form');
        form.classList.add('form');
        form.innerHTML = _taskForm;
        newPage.appendChild(form);
        const body = document.querySelector('body');
        body.appendChild(newPage);
        _taskFormBtn = document.getElementById('submit-task-btn');
        _closeTaskFormBtn = document.getElementById('close-task-form')
    }
    const _getFormInputs = (type) => {
        if (type === 'task') {
            const titleInput = document.getElementById('task-name');
            const descInput = document.getElementById('task-description');
            const dateInput = document.getElementById('task-date');
            const priorityInput = document.getElementById('task-priority');
            const title = titleInput.value;
            const desc = descInput.value;
            let date = dateInput.value;
            if (!date) {
                date = '';
            }
            const priority = priorityInput.value;
            return { title, desc, date, priority }
        } else if (type === 'project') {
            const titleInput = document.getElementById('project-title');
            const title = titleInput.value;
            return title;
        }
    }
    const _closeForm = () => {
        const newPage = document.querySelector('.form-container');
        newPage.style.display = 'none';
        newPage.remove();
        _page.style.display = 'grid';
    }
    const _renderProjectForm = () => {
        _page.style.display = 'none';
        const newPage = document.createElement('div');
        newPage.classList.add('form-container');
        newPage.style.display = 'block';
        const form = document.createElement('form');
        form.classList.add('form');
        form.innerHTML = _projectForm;
        newPage.appendChild(form);
        const body = document.querySelector('body');
        body.appendChild(newPage);
        _projFormBtn = document.getElementById('submit-proj-btn');
        _closeProjFormBtn = document.getElementById('close-proj-form');
    }
    const renderHome = () => {
        _projects = Storage.getProjects();
        _currentProj = _projects[0];
        _renderHead(_basicStructure.head);
        _renderSidebar(_projects);
        _renderDashboard(_projects[0]);
        _addEvents();
    }
    const _projSubscriber = (msg, proj) => {
        _currentProj = proj;
        _renderSidebar();
        _renderDashboard(proj);
        _addEvents();
    }
    const _taskSubscriber = (msg, proj) => {
        _renderDashboard(proj)
        _addEvents();
    }
    const _addDeleteTaskEvent = (btn) => {
        btn.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            Controller.deleteTask(btn.dataset.project, btn.dataset.task);
        });
    }
    const _addEvents = () => {
        PubSub.subscribe('proj added', _projSubscriber);
        PubSub.subscribe('task added', _taskSubscriber);
        PubSub.subscribe('task deleted', _taskSubscriber);
        const taskCards = document.querySelectorAll('.card-container');
        taskCards.forEach(card => {
            card.addEventListener('click', () => {
                const desc = document.getElementById(card.dataset.task);
                // control visibility of full card aka showing description
                if (desc.classList.contains('hidden')) {
                    desc.classList.remove('hidden');
                    desc.classList.add('active');
                } else if (desc.classList.contains('active')) {
                    desc.classList.remove('active');
                    desc.classList.add('hidden');
                } else {
                    desc.classList.add('active');
                }
            })
        })
        _checkBoxes.forEach(checkbox => {
            checkbox.addEventListener('input', (event) => {
                event.stopImmediatePropagation();
                Controller.toggleTask(checkbox.dataset.project, checkbox.dataset.task);
            });
        });
        _projLinks.forEach(link => {
            link.addEventListener('click', () => {
                const proj = Controller.findProject(link.dataset.project)
                _currentProj = proj;
                _renderDashboard(proj);
                _addEvents()
            })
        })
        _addTaskBtn.addEventListener('click', () => {
            _renderTaskForm();
            // only add listeners for buttons when they are rendered
            _taskFormBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const taskInputs = _getFormInputs('task');
                // checks if date input has a value;
                if(taskInputs.date && taskInputs.title && taskInputs.desc) {
                    Controller.addTask(_currentProj.getTitle(), taskInputs.title, taskInputs.date, taskInputs.desc, taskInputs.priority);
                    _closeForm();
                } else {
                    alert('All Fields must be filled in');
                }
            })
            _closeTaskFormBtn.addEventListener('click', _closeForm);
        });
        _addProjBtn.addEventListener('click', () => {
            _renderProjectForm();
            _projFormBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const projTitle = _getFormInputs('project');
                Controller.addNewProject(projTitle);
                _closeForm();
            })
            _closeProjFormBtn.addEventListener('click', _closeForm);
        });
    }
    return { renderHome }
}) ();