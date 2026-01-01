
import TodoItem from "./ToDoItem";

const CompletedState = ({ tasks, setTasks, onEdit }) => {

  const toggleDone = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const editTask = (id) => {
    console.log("Edit completed", id);
  };

  return (
    <div className="empty-state">
      <h1>Completed tasks ({tasks.length})</h1>

      <div className="completed-list">
        {tasks.map(task => (
          <TodoItem
            key={task.id}
            task={task}
            onToggle={toggleDone}
            onDelete={deleteTask}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedState;
