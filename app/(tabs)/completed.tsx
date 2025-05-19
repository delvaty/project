import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';
import { Task } from '@/types/task';
import { getCompletedTasks } from '@/utils/taskUtils';

export default function CompletedScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    const completedTasks = await getCompletedTasks();
    setTasks(completedTasks);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Completed Tasks" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} onTasksChange={fetchTasks} isCompletedList />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed tasks</Text>
            <Text style={styles.emptySubText}>
              Your completed tasks will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});