import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';
import { isToday, isFuture, isPast, startOfDay, endOfDay } from 'date-fns';

const STORAGE_KEY = 'taskManager_tasks';

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

// Save a new task
export const saveTask = async (task: Task): Promise<void> => {
  try {
    const tasks = await getAllTasks();
    const updatedTasks = [...tasks, task];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

// Update a task
export const updateTask = async (updatedTask: Task): Promise<void> => {
  try {
    const tasks = await getAllTasks();
    const updatedTasks = tasks.map((task) => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getAllTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Mark a task as complete
export const completeTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getAllTasks();
    const updatedTasks = tasks.map((task) => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error completing task:', error);
  }
};

// Mark a task as incomplete
export const uncompleteTask = async (taskId: string): Promise<void> => {
  try {
    const tasks = await getAllTasks();
    const updatedTasks = tasks.map((task) => 
      task.id === taskId ? { ...task, completed: false } : task
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error uncompleting task:', error);
  }
};

// Get today's tasks
export const getTodayTasks = async (): Promise<Task[]> => {
  try {
    const tasks = await getAllTasks();
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return isToday(dueDate) && !task.completed;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  } catch (error) {
    console.error('Error getting today tasks:', error);
    return [];
  }
};

// Get upcoming tasks
export const getUpcomingTasks = async (): Promise<Task[]> => {
  try {
    const tasks = await getAllTasks();
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return isFuture(dueDate) && !task.completed;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  } catch (error) {
    console.error('Error getting upcoming tasks:', error);
    return [];
  }
};

// Get completed tasks
export const getCompletedTasks = async (): Promise<Task[]> => {
  try {
    const tasks = await getAllTasks();
    return tasks.filter((task) => task.completed)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  } catch (error) {
    console.error('Error getting completed tasks:', error);
    return [];
  }
};