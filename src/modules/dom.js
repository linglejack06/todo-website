import Controller from './controller';
import PubSub from 'pubsub-js';

export default (function Dom () {
    const _page = document.getElementById('content');
    const _projectList = document.createElement('ul');
    _projectList.classList.add('proj-list');
    let _addProjBtn;
    let _addTaskBtn;
    let _deleteTaskBtn;
    let _taskFormBtn;
    let _closeTaskFormBtn;
    let _projFormBtn;
    let _currentProj;
    const _taskForm = `
        <div class='form-header'>
            <h2 class='title'>New Task</h2>
            <button type='button' class='close-form' id='close-task-form'>X</button>
        </div>
        <div class='input-container'>
            <label for='task-name'>Task Title</label>
            <input type='text' id='task-name' name='title' class='task-name'>
        </div>
        <div class='input-container'>
            <label for='task-description'>Description</label>
            <input type='text' id='task-description' name='description' class='task-description'>
        </div>
        <div class='input-container'>
            <label for='task-date'>Due Date</label>
            <input type='datetime-local' id='task-date' name='date' class='task-date'
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
    }
    const _renderSidebar = (project) => {
        _basicStructure.sidebar.innerHTML = '';
        const proj = document.createElement('li');
        proj.textContent = project.getTitle();
        proj.classList.add('proj-link');
        _projectList.appendChild(proj);
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

        const title = document.createElement('h3');
        title.classList.add('task-title');
        title.textContent = task.getTitle();
        cardContainer.appendChild(title);

        const date = document.createElement('h3');
        date.classList.add('task-date');
        date.textContent = task.getFormattedDate();
        cardContainer.appendChild(date);

        const btn = document.createElement('button');
        btn.classList.add('delete-task-btn');
        btn.textContent = 'X';
        btn.dataset.task = task.getTitle();
        btn.dataset.project = project.getTitle();
        _deleteTaskBtn = btn;
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
        _taskFormBtn = document.getElementById('submit-task-btn');
        _closeTaskFormBtn = document.getElementById('close-task-form')
    }
    const _getFormInputs = (type) => {
        if (type === 'task') {
            const title = document.getElementById('task-title').value;
            const desc = document.getElementById('task-description').value;
            const date = document.getElementById('task-date').value;
            const priority = document.getElementById('task-priority').value;
            return { title, desc, date, priority }
        } else if (type === 'project') {

        }
    }
    const _closeTaskForm = () => {
        const newPage = document.querySelector('form-container');
        newPage.innerHTML = '';
        newPage.style.display = 'none';
        _page.style.display = 'grid';
    }
    const _renderProjectForm = () => {
        
    }
    const renderHome = () => {
        const defaultProject = Controller.getDefaultProject()
        _renderHead(_basicStructure.head);
        _renderSidebar(defaultProject);
        _renderDashboard(defaultProject);
        _addEvents();
    }
    const _projSubscriber = (msg, proj) => {
        _currentProj = proj;
        _renderSidebar(proj);
        _renderDashboard(proj);
    }
    const _taskSubscriber = (msg, proj) => {
        _renderDashboard(proj)
    }
    const _addEvents = () => {
        PubSub.subscribe('proj added', _projSubscriber);
        PubSub.subscribe('task added', _taskSubscriber);
        PubSub.subscribe('task deleted', _taskSubscriber);
        _checkBoxes.forEach(checkbox => {
            checkbox.addEventListener('input', () => {
                Controller.toggleTask(checkbox.dataset.project, checkbox.dataset.task);
            });
        });
        _deleteTaskBtn.addEventListener('click', () => {
            Controller.deleteTask(_deleteTaskBtn.dataset.project, _deleteTaskBtn.dataset.task);
        });
        //listener for submitting task
        _taskFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const taskInputs = _getFormInputs('task');
            Controller.addTask(_currentProj.getTitle(), taskInputs.title, taskInputs.date, taskInputs.desc, taskInputs.priority);
            _closeTaskForm();
        })
        // dont add the task only close the form
        _closeTaskFormBtn.addEventListener('click', _closeTaskForm);
    }
    return { renderHome }
}) ();