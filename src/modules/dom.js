export default (function Dom () {
    const _page = document.getElementById('content');
    const _projectList = document.createElement('ul');
    _projectList.classList.add('proj-list');
    const _addProjBtn = document.createElement('button');
    _addProjBtn.classList.add('new-proj-btn');
    const _renderStructure = () => {
        const head = document.createElement('div');
        head.classList.add('head');
        _page.appendChild(head);
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        _page.appendChild(sidebar);
        const main = document.createElement('div');
        main.classList.add('main');
        _page.appendChild(main);
        const foot = document.createElement('div');
        foot.classList.add('foot');
        _page.appendChild(foot);
        return { head, sidebar, main, foot };
    }
    const _renderHead = (head) => {
        const title = document.createElement('h1');
        title.textContent = 'To Do It';
        title.classList.add('title');
        const projectsButton = document.createElement('button');
        projectsButton.textContent = 'All Projects';
        projectsButton.classList.add('all-proj-button');
    }
    const _renderSidebar = (sidebar, project) => {
        sidebar.innerHTML = '';
        const project = document.createElement('li');
        project.textContet = project.title;
        project.classList.add('proj-link');
        _projectList.appendChild(project);
        sidebar.appendChild(projectList);
        sidebar.appendChild(_addProjBtn);
    }
    const renderHome = () => {
        const basicStructure = _renderStructure();
        _renderHead(basicStructure.head);
        _renderSidebar(basicStructure.sidebar, controller.getDefaultProject())
    }
    return { renderHome }
}) ();