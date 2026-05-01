import { useEffect, useState } from 'react';
import {
  fetchTasks,
  addTask as apiAddTask,
  editTask as apiEditTask,
  deleteTask as apiDeleteTask,
} from '../../api/taskApi';
import { fetchTasksByCategory } from '../../api/categoryApi';
import type { Task, PomoData, Category } from '../../types';

import ToDoItem from '../ToDoItem';
import CreateTaskButton from '../CreateTaskButton';
import AddTaskModal from '../AddTaskModal';
import DeleteAllButton from '../DeleteAllButton';
import DeleteAllModal from './DeleteAllModal';
import Loader from '../Loader';

import { Plus, Search } from 'lucide-react';
import styles from './ActiveTasks.module.css';

interface ActiveTasksProps {
  activePomodoroId: number | null;
  setActivePomodoroId: (id: number | null) => void;
  activePomoData: PomoData | null;
  setActivePomoData: (data: PomoData | null) => void;
  categories: Category[];
  selectedCategoryId: number | null;
}

const ActiveTasks = ({
  activePomodoroId,
  setActivePomodoroId,
  activePomoData,
  setActivePomoData,
  categories,
  selectedCategoryId,
}: ActiveTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const activeTasks = tasks.filter((task) => !task.done);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data =
        selectedCategoryId !== null
          ? await fetchTasksByCategory(selectedCategoryId)
          : await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedCategoryId]);

  const addTask = async ({
    title,
    description,
    categoryId,
  }: {
    title: string;
    description: string;
    categoryId: number | null;
  }) => {
    try {
      const created = await apiAddTask(title, description);
      if (categoryId !== null && created?.id) {
        await apiEditTask(created.id, { categoryId });
      }
    } finally {
      await loadTasks();
    }
  };

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

  const updateTask = async (id: number, data: Record<string, unknown>) => {
    try {
      await apiEditTask(id, data as Parameters<typeof apiEditTask>[1]);
    } finally {
      await loadTasks();
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await Promise.all(activeTasks.map((task) => apiDeleteTask(task.id)));
      setShowDeleteModal(false);
    } finally {
      await loadTasks();
    }
  };

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const headerLabel = activeCategory
    ? `${activeCategory.name} (${activeTasks.length})`
    : `Active tasks (${activeTasks.length})`;

  return (
    <div className={styles.container}>
      {loading && <Loader />}

      {activeTasks.length > 0 && (
        <div className={styles.activeHeader}>
          <h2 className={styles.activeTasksCount}>{headerLabel}</h2>
          <DeleteAllButton onClick={() => setShowDeleteModal(true)} />
        </div>
      )}

      <div className={styles.tasksList}>
        {activeTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyContainer}>
              <Search size={68} />
              <h3>No active tasks</h3>
              <p>Create your first task to get started</p>
            </div>
          </div>
        ) : (
          activeTasks.map((task) => (
            <ToDoItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={updateTask}
              activePomodoroId={activePomodoroId}
              setActivePomodoroId={setActivePomodoroId}
              activePomoData={activePomoData}
              setActivePomoData={setActivePomoData}
              categories={categories}
            />
          ))
        )}
      </div>

      <div className={styles.activeFooter}>
        <CreateTaskButton onClick={() => setShowCreateModal(true)}>
          <Plus /> Create New Task
        </CreateTaskButton>
      </div>

      {showCreateModal && (
        <AddTaskModal
          onAdd={addTask}
          onClose={() => setShowCreateModal(false)}
          categories={categories}
          defaultCategoryId={selectedCategoryId}
        />
      )}

      {showDeleteModal && (
        <DeleteAllModal
          type='active'
          onConfirm={handleConfirmDeleteAll}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ActiveTasks;
