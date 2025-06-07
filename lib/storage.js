import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "myTasks";

export const loadTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load tasks from storage", e);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save tasks to storage", e);
  }
};

export const generateTaskId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};