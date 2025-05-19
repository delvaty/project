import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { formatDistanceToNow, isPast } from 'date-fns';
import { Check, Trash2 } from 'lucide-react-native';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onComplete: () => void;
  onDelete: () => void;
  rowRef: (ref: any) => void;
  isCompleted?: boolean;
}

export default function TaskItem({ 
  task, 
  onComplete, 
  onDelete,
  rowRef,
  isCompleted = false
}: TaskItemProps) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !task.completed;
  
  const renderLeftActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity 
        style={[styles.leftAction, task.completed ? styles.uncompleteAction : styles.completeAction]} 
        onPress={onComplete}
      >
        <Animated.View
          style={{
            transform: [{ translateX: trans }],
          }}
        >
          <Check size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0, 1],
      outputRange: [0, 0, 10, 0],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity 
        style={styles.rightAction}
        onPress={onDelete}
      >
        <Animated.View
          style={{
            transform: [{ translateX: trans }],
          }}
        >
          <Trash2 size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const getPriorityStyle = () => {
    if (task.priority === 'high') {
      return styles.highPriority;
    } else if (task.priority === 'medium') {
      return styles.mediumPriority;
    }
    return styles.lowPriority;
  };

  return (
    <Swipeable
      ref={rowRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      leftThreshold={30}
      rightThreshold={40}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={onComplete}
        >
          {task.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text 
              style={[
                styles.title, 
                task.completed && styles.titleCompleted
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={[styles.priorityBadge, getPriorityStyle()]}>
              <Text style={styles.priorityText}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
          </View>
          
          {task.description ? (
            <Text 
              style={[
                styles.description, 
                task.completed && styles.descriptionCompleted
              ]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
          
          <Text 
            style={[
              styles.dueDate, 
              isOverdue && styles.overdue,
              task.completed && styles.dueDateCompleted
            ]}
          >
            {isOverdue 
              ? `Overdue by ${formatDistanceToNow(dueDate)}`
              : `Due ${formatDistanceToNow(dueDate, { addSuffix: true })}`
            }
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  highPriority: {
    backgroundColor: '#EF4444',
  },
  mediumPriority: {
    backgroundColor: '#F59E0B',
  },
  lowPriority: {
    backgroundColor: '#10B981',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  descriptionCompleted: {
    color: '#94A3B8',
  },
  dueDate: {
    fontSize: 12,
    color: '#64748B',
  },
  dueDateCompleted: {
    color: '#94A3B8',
  },
  overdue: {
    color: '#EF4444',
    fontWeight: '500',
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 8,
    paddingRight: 20,
    marginBottom: 12,
  },
  completeAction: {
    backgroundColor: '#10B981',
    flex: 1,
  },
  uncompleteAction: {
    backgroundColor: '#F59E0B',
    flex: 1,
  },
  rightAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginBottom: 12,
    flex: 1,
  },
});