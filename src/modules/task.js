import { format } from 'date-fns';

export default function Task(title, dateInput, desc, priority) {
    let _isCompleted = false;
    let _title = title;
    // date input should be of type datetime-local
    let _date = new Date(dateInput);
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
    const getFormattedDate = () => format (_date, 'Pp');
    const getDate = () => _date;
    const setDate = (dateInput) => {
        _date = new Date(dateInput);
    }
    return { getTitle, setTitle, getPriority, setPriority, setDesc, getDesc, toggleComplete, isComplete, getFormattedDate, getDate, setDate }
}