import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Filter } from 'lucide-react-native';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Filter size={20} color="#64748B" />
        <Text style={styles.headerText}>Filter Tasks</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilter,
              filter.id === 'high' && activeFilter === filter.id && styles.highPriorityActive,
              filter.id === 'medium' && activeFilter === filter.id && styles.mediumPriorityActive,
              filter.id === 'low' && activeFilter === filter.id && styles.lowPriorityActive,
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  highPriorityActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  mediumPriorityActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  lowPriorityActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
});