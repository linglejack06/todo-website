export default function Project (title) {
    let _title = title;
    let _tasks = [];
    const setTitle = (title) => {
        _title = title;
    }
    const getTitle = () => _title;
    const addTask = (task) => {
        // wont allow duplicates
        if (_tasks.includes(task)) {
            return;
        }
       _tasks.push(task);
    }
    const deleteTask = (task) => {
        //checks if array contains task
        if (_tasks.includes(task)) {
            _tasks.pop(task);
        }
    }
    const getTasks = () => _tasks;
    return { setTitle, getTitle, addTask, deleteTask, getTasks }
}