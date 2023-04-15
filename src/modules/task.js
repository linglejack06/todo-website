export default function Task(title, date, desc, priority) {
    let _isCompleted = false;
    let _title = title;
    let _date = date;
    let _desc = desc;
    let _priority = priority;
    const toggleComplete = () => {
        if(_isCompleted) {
            _isCompleted = false;
        } else {
            _isCompleted = true;
        }
    }
    const isComplete = () => _isCompleted;
    const setTitle = (title) => {
        _title = title
    }
    const getTitle = () => _title;
    const setPriority = (priority) => {
        _priority = priority;
    }
    const getPriority = () => _priority;
    const setDesc = (desc) => {
        _desc = desc;
    }
    const getDesc = () => _desc;
    return { getTitle, setTitle, getPriority, setPriority, setDesc, getDesc, toggleComplete, isComplete }
}