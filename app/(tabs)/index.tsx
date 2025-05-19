import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';
import { Task } from '@/types/task';
import { getTodayTasks } from '@/utils/taskUtils';

export default function TodayScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    const todayTasks = await getTodayTasks();
    setTasks(todayTasks);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Today's Tasks" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} onTasksChange={fetchTasks} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks for today</Text>
            <Text style={styles.emptySubText}>
              Add a new task or check your upcoming tasks
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