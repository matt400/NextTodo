import { useEffect, useState } from 'react';
import { fetchTasks, editTask as apiEditTask, deleteTask as apiDeleteTask } from '../../api/taskApi';
import type { Task, Category } from '../../types';

import ToDoItem from '../ToDoItem';
import DeleteAllButton from '../DeleteAllButton';
import DeleteAllModal from '../ActiveTasks/DeleteAllModal';
import Loader from '../Loader';

import { Check } from 'lucide-react';
import styles from './CompletedTasks.module.css';

interface CompletedTasksProps {
  categories: Category[];
}

const CompletedTasks = ({ categories }: CompletedTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const completedTasks = tasks.filter((task) => task.done);

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      await apiEditTask(id, { isFinished: !task.done });
    } finally {
      await loadTasks();
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await apiDeleteTask(id);
    } finally {
      await loadTasks();
    }
  };

  const updateTask = async (id: number, updates: Record<string, unknown>) => {
    try {
      await apiEditTask(id, updates as Parameters<typeof apiEditTask>[1]);
    } finally {
      await loadTasks();
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await Promise.all(completedTasks.map((task) => apiDeleteTask(task.id)));
      setShowDeleteModal(false);
    } finally {
      await loadTasks();
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      {completedTasks.length > 0 && (
        <div className={styles.activeHeader}>
          <h2 className={styles.activeTasksCount}>Completed tasks ({completedTasks.length})</h2>
          <DeleteAllButton onClick={() => setShowDeleteModal(true)} />
        </div>
      )}

      <div className={styles.tasksList}>
        {completedTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyContainer}>
              <Check size={68} />
              <h3>Nothing completed yet</h3>
              <p>Your finished tasks will appear here</p>
            </div>
          </div>
        ) : (
          completedTasks.map((task, index) => (
            <ToDoItem
              key={task.id}
              task={task}
              index={index}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={updateTask}
              activePomodoroId={null}
              setActivePomodoroId={() => {}}
              activePomoData={null}
              setActivePomoData={() => {}}
              categories={categories}
            />
          ))
        )}
      </div>

      {showDeleteModal && (
        <DeleteAllModal
          type='completed'
          onConfirm={handleConfirmDeleteAll}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default CompletedTasks;
