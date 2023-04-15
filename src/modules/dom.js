export default (function Dom () {
    const _page = document.getElementById('content');
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
    const renderHome = () => {
        const basicStructure = _renderStructure();
    }
    return { renderHome }
}) ();