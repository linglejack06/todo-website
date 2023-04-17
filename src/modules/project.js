export default function Project (title) {
    let _title = title;
    let _tasks = [];
    const setTitle = (title) => {
        _title = title;
    }
    const getTitle = () => _title;
    const appendTask = (task) => {
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
    const findTask = (task) => _tasks.find(task);
    const getTasks = () => _tasks;
    return { setTitle, getTitle, appendTask, deleteTask, getTasks, findTask }
}