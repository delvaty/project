import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '@/types/task';

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'web') {
    // Web doesn't support notifications in the same way
    return false;
  }
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

// Configure notifications
export const configureNotifications = () => {
  if (Platform.OS === 'web') return;
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Schedule a notification for a task
export const scheduleTaskNotification = async (task: Task) => {
  if (Platform.OS === 'web') return null;
  
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;
    
    const dueDate = new Date(task.dueDate);
    
    // Don't schedule if the due date is in the past
    if (dueDate <= new Date()) return null;
    
    // Cancel any existing notification for this task
    await cancelTaskNotification(task.id);
    
    // Schedule two notifications:
    // 1. One hour before due time
    const oneHourBefore = new Date(dueDate);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);
    
    if (oneHourBefore > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `"${task.title}" is due in 1 hour`,
          data: { taskId: task.id },
        },
        trigger: oneHourBefore,
        identifier: `${task.id}-reminder`,
      });
    }
    
    // 2. At the exact due time
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Due Now',
        body: `"${task.title}" is due now`,
        data: { taskId: task.id },
      },
      trigger: dueDate,
      identifier: task.id,
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a scheduled notification
export const cancelTaskNotification = async (taskId: string) => {
  if (Platform.OS === 'web') return;
  
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-reminder`);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};