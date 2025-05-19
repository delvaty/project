import { View, StyleSheet, Animated, Alert } from 'react-native';
import { useRef } from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';
import { completeTask, deleteTask, uncompleteTask } from '@/utils/taskUtils';
import { cancelTaskNotification } from '@/utils/notificationUtils';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
  isCompletedList?: boolean;
}

export default function TaskList({ 
  tasks, 
  onTasksChange,
  isCompletedList = false 
}: TaskListProps) {
  const rowRefs = useRef<{ [key: string]: any }>({});

  const closeRow = (taskId: string) => {
    if (rowRefs.current[taskId]) {
      rowRefs.current[taskId].close();
    }
  };

  const handleComplete = async (task: Task) => {
    closeRow(task.id);
    if (task.completed) {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id);
      await cancelTaskNotification(task.id);
    }
    onTasksChange();
  };

  const handleDelete = (task: Task) => {
    closeRow(task.id);
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            await cancelTaskNotification(task.id);
            onTasksChange();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={() => handleComplete(task)}
          onDelete={() => handleDelete(task)}
          rowRef={(ref) => (rowRefs.current[task.id] = ref)}
          isCompleted={isCompletedList}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});