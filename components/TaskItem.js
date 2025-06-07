import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  PanResponder,
  Modal,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../lib/styles";

export default function TaskItem({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority || 'low');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const isEditingPriority = useRef(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe && !isEditing;
      },
      onPanResponderGrant: () => {
        setIsSwipeActive(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) { 
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSwipeActive(false);
        if (gestureState.dx < -100) {
          setShowDeleteConfirm(true);
          Animated.timing(pan, {
            toValue: { x: -300, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSave = () => {
    if (editText.trim()) {
      if (!['high', 'medium', 'low'].includes(editPriority)) {
        console.error("Invalid priority:", editPriority);
        return;
      }
      console.log("Saving task:", { id: task.id, text: editText.trim(), priority: editPriority });
      onEditTask(task.id, editText.trim(), editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority || 'low');
    setIsEditing(false);
  };

  const handleDelete = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDeleteTask(task.id);
      setShowDeleteConfirm(false);
      opacity.setValue(1);
    });
  };

  const handleDeleteButtonPress = () => {
    console.log("Delete button pressed"); 
    setShowDeleteConfirm(true);
  };

  const handlePriorityPress = (priority) => {
    isEditingPriority.current = true;
    console.log("Setting priority to:", priority);
    setEditPriority(priority);
    setTimeout(() => {
      isEditingPriority.current = false;
    }, 100);
  };

  const handleTextInputBlur = () => {
    if (!isEditingPriority.current) {
      handleSave();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return { backgroundColor: colors.red500 };
      case "medium":
        return { backgroundColor: colors.mutedGold };
      case "low":
        return { backgroundColor: colors.green500 };
      default:
        return { backgroundColor: colors.green500 };
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.taskItemContainer,
          { transform: [{ translateX: pan.x }], opacity: opacity },
        ]}
        {...(!isEditing ? panResponder.panHandlers : {})}
      >
        <View style={styles.taskItemContent}>
          <Pressable
            onPress={() => onToggleComplete(task.id)}
            style={({ pressed }) => [
              styles.checkbox,
              task.completed
                ? styles.checkboxCompleted
                : styles.checkboxIncomplete,
            ]}
            accessibilityLabel={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && <Feather name="check" size={14} color={colors.softCloudWhite} />}
          </Pressable>

          <View style={styles.taskTextContainer}>
            {isEditing ? (
              <View style={styles.editModeContainer}>
                <TextInput
                  value={editText}
                  onChangeText={setEditText}
                  style={styles.editTextInput}
                  autoFocus
                  onBlur={handleTextInputBlur} 
                  onSubmitEditing={handleSave} 
                />
                <View style={styles.editPriorityContainer}>
                  <Text style={styles.editPriorityLabel}>Priority:</Text>
                  <View style={styles.editPriorityButtons}>
                    {(["high", "medium", "low"]).map((p) => (
                      <Pressable
                        key={p}
                        onPress={() => handlePriorityPress(p)}
                        style={({ pressed }) => [
                          styles.editPriorityButton,
                          getPriorityColor(p),
                          editPriority === p
                            ? { borderColor: colors.deepNightBlue }
                            : { borderColor: colors.smokeGray50 },
                          pressed && { opacity: 0.7 },
                        ]}
                        accessibilityLabel={`Set priority to ${p}`}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.editActions}>
                  <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Feather name="save" size={14} color={colors.softCloudWhite} />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                  <Pressable onPress={handleCancel} style={styles.cancelButton}>
                    <Feather name="x" size={14} color={colors.softCloudWhite} />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.viewModeContainer}>
                <Pressable
                  onPress={() => !task.completed && setIsEditing(true)}
                  style={styles.taskTextPressable}
                >
                  <Text
                    style={[
                      styles.taskText,
                      task.completed && styles.taskTextCompleted,
                    ]}
                  >
                    {task.text}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleDeleteButtonPress}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed
                  ]}
                  accessibilityLabel="Delete task"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="trash-2" size={16} color={colors.smokeGray} />
                </Pressable>
              </View>
            )}
            {!isEditing && (
              <View style={styles.priorityAndEditContainer}>
                <View style={styles.priorityDisplay}>
                  <View style={[styles.priorityDot, getPriorityColor(task.priority)]} />
                  <Text style={styles.priorityText}>
                    {getPriorityLabel(task.priority)} Priority
                  </Text>
                </View>
                {!task.completed && (
                  <Pressable
                    onPress={() => setIsEditing(true)}
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed && styles.editButtonPressed
                    ]}
                    accessibilityLabel="Edit task"
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <Feather name="edit-3" size={14} color={colors.smokeGray} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>

        {isSwipeActive && (
          <Animated.View
            style={[
              styles.swipeIndicator,
              {
                opacity: pan.x.interpolate({
                  inputRange: [-100, -20],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <Feather name="trash-2" size={20} color={colors.red500} />
          </Animated.View>
        )}
      </Animated.View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDeleteConfirm(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this task? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowDeleteConfirm(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={styles.modalDeleteButton}
              >
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  taskItemContainer: {
    backgroundColor: colors.softCloudWhite95,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.softCloudWhite50,
  },
  taskItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: colors.mutedGold,
    borderColor: colors.mutedGold,
  },
  checkboxIncomplete: {
    borderColor: colors.smokeGray,
  },
  taskTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  viewModeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskTextPressable: {
    flex: 1,
    marginRight: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.smokeGray,
    flexShrink: 1,
  },
  taskTextCompleted: {
    color: colors.mutedGold,
    textDecorationLine: "line-through",
    opacity: 0.75,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonPressed: {
    backgroundColor: colors.smokeGray20,
  },
  priorityAndEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    color: colors.smokeGray,
    fontWeight: "500",
  },
  editButton: {
    padding: 8,
    borderRadius: 4,
  },
  editButtonPressed: {
    backgroundColor: colors.smokeGray20,
  },
  editModeContainer: {
    gap: 12,
  },
  editTextInput: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.smokeGray30,
    borderRadius: 8,
    color: colors.deepNightBlue,
    fontSize: 16,
  },
  editPriorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editPriorityLabel: {
    color: colors.smokeGray,
    fontSize: 14,
  },
  editPriorityButtons: {
    flexDirection: "row",
    gap: 4,
  },
  editPriorityButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.royalBlue,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.softCloudWhite,
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.smokeGray,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: colors.softCloudWhite,
    fontSize: 14,
    fontWeight: "500",
  },
  swipeIndicator: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.softCloudWhite,
    borderRadius: 12,
    padding: 24,
    maxWidth: 380,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.deepNightBlue,
    marginBottom: 8,
  },
  modalMessage: {
    color: colors.smokeGray,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.smokeGray20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: colors.smokeGray,
    fontWeight: "500",
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.red500,
    borderRadius: 8,
    alignItems: "center",
  },
  modalDeleteButtonText: {
    color: colors.white,
    fontWeight: "500",
  },
});