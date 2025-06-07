import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";
import { colors } from "../lib/styles"; 

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return b.createdAt - a.createdAt;
  });

  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.taskList}>
        {/* Incomplete Tasks */}
        {incompleteTasks.length > 0 && (
          <View style={styles.taskSection}>
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.taskSection}>
            {incompleteTasks.length > 0 && (
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>
                  Completed ({completedTasks.length})
                </Text>
                <View style={styles.separatorLine} />
              </View>
            )}
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 24, 
  },
  taskList: {
    gap: 12, 
  },
  taskSection: {
    gap: 12,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.softCloudWhite30,
  },
  separatorText: {
    color: colors.softCloudWhite70,
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 12,
  },
});