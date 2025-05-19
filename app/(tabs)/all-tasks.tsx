import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import { Task } from '@/types/task';
import { getAllTasks } from '@/utils/taskUtils';
import { ListFilter } from 'lucide-react-native';

export default function AllTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    const allTasks = await getAllTasks();
    setTasks(allTasks);
    applyFilter(allTasks, activeFilter);
  };

  const applyFilter = (allTasks: Task[], filter: string) => {
    let filtered = [...allTasks];
    
    if (filter === 'high') {
      filtered = filtered.filter(task => task.priority === 'high');
    } else if (filter === 'medium') {
      filtered = filtered.filter(task => task.priority === 'medium');
    } else if (filter === 'low') {
      filtered = filtered.filter(task => task.priority === 'low');
    }
    
    filtered.sort((a, b) => {
      // Sort by completion status first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    setFilteredTasks(filtered);
    setActiveFilter(filter);
  };

  const handleFilterChange = (filter: string) => {
    applyFilter(tasks, filter);
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
      <Header title="All Tasks" />
      <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} onTasksChange={fetchTasks} />
        ) : (
          <View style={styles.emptyContainer}>
            <ListFilter size={48} color="#94A3B8" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptySubText}>
              Try changing your filter or add some new tasks
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
  emptyIcon: {
    marginBottom: 16,
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
    maxWidth: '80%',
  },
});