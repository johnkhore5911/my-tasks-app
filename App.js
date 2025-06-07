import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { generateTaskId } from "./lib/storage";
import { colors } from "./lib/styles";

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const STORAGE_KEY = "myTasks";

const loadTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load tasks from storage", e);
    return [];
  }
};

const saveTasks = async (tasks) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save tasks to storage", e);
  }
};

function MainAppContent() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getTasks = async () => {
      const savedTasks = await loadTasks();
      setTasks(savedTasks);
      setIsLoaded(true);
    };
    getTasks();
  }, []);

useEffect(() => {
  const intervalId = setInterval(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("myTasks");
      const savedTasks = jsonValue != null ? JSON.parse(jsonValue) : [];
      const incompleteTasks = savedTasks.filter(task => !task.completed);

      for (let i = 0; i < incompleteTasks.length; i++) {
        const task = incompleteTasks[i];
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Task Reminder",
            body: `Time to complete: ${task.text}`,
            sound: 'default',
          },
          trigger: {
            seconds: i * 3, 
          },
        });
      }

    } catch (e) {
      console.error("Error scheduling notifications", e);
    }
  }, 15000); // every 15 seconds

  return () => clearInterval(intervalId);
}, []);


  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const addTask = (taskData) => {
    const newTask = {
      id: generateTaskId(),
      text: taskData.text,
      completed: false,
      priority: taskData.priority,
      createdAt: Date.now(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? Date.now() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const editTask = (taskId, newText, newPriority) => {
    if (!['high', 'medium', 'low'].includes(newPriority)) {
      console.error("Invalid priority received:", newPriority);
      return;
    }
    console.log("Editing task:", { taskId, newText, newPriority });
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, text: newText, priority: newPriority }
          : task
      )
    );
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.mutedGold} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.deepNightBlue} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Tasks</Text>
            {totalCount > 0 && (
              <Text style={styles.headerSubtitle}>
                {completedCount} of {totalCount} completed
              </Text>
            )}
          </View>
          {totalCount > 0 && (
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageText}>
                {Math.round((completedCount / totalCount) * 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* Task Input */}
        <TaskInput onAddTask={addTask} />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleTaskCompletion}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Stay Organized! ✨</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainAppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepNightBlue,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepNightBlue,
    maxWidth: 768,
    alignSelf: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.deepNightBlue,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.softCloudWhite20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.royalBlue,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.softCloudWhite,
  },
  headerSubtitle: {
    color: colors.softCloudWhite70,
    fontSize: 14,
    marginTop: 4,
  },
  percentageCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mutedGold20,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    color: colors.mutedGold,
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: {
    marginTop: "auto",
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    color: colors.softCloudWhite50,
    fontSize: 14,
    fontWeight: "500",
  },
});