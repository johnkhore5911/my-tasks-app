// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Animated,
//   Easing,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { Feather } from "@expo/vector-icons"; 
// import { colors } from "../lib/styles"; 

// export default function TaskInput({ onAddTask }) {
//   const [text, setText] = useState("");
//   const [priority, setPriority] = useState("medium");
//   const [error, setError] = useState("");

//   const handleSubmit = () => {
//     if (!text.trim()) {
//       setError("Please enter a task");
//       setTimeout(() => setError(""), 3000);
//       return;
//     }

//     onAddTask({ text: text.trim(), priority });
//     setText("");
//     setPriority("medium");
//     setError("");
//   };

//   const getPriorityColorStyle = (p) => {
//     switch (p) {
//       case "high":
//         return { backgroundColor: colors.red500 };
//       case "medium":
//         return { backgroundColor: colors.mutedGold };
//       case "low":
//         return { backgroundColor: colors.green500 };
//       default:
//         return {};
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.keyboardAvoidingView}
//     >
//       <View style={styles.container}>
//         <View>
//           <TextInput
//             value={text}
//             onChangeText={setText}
//             placeholder="Add a new task..."
//             placeholderTextColor={colors.smokeGray}
//             style={styles.textInput}
//             maxLength={200}
//             returnKeyType="done"
//             onSubmitEditing={handleSubmit} 
//           />
//           {error && (
//             <View style={styles.errorContainer}>
//               <Feather name="alert-circle" size={14} color={colors.red400} />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.priorityAndButtonContainer}>
//           <View style={styles.prioritySelection}>
//             <Text style={styles.priorityLabel}>Priority:</Text>
//             <View style={styles.priorityButtons}>
//               {["high", "medium", "low"].map((p) => (
//                 <Pressable
//                   key={p}
//                   onPress={() => setPriority(p)}
//                   style={({ pressed }) => [
//                     styles.priorityButton,
//                     getPriorityColorStyle(p),
//                     priority === p
//                       ? {
//                           borderColor: colors.softCloudWhite,
//                           backgroundColor: getPriorityColorStyle(p).backgroundColor, 
//                         }
//                       : {
//                           borderColor: colors.softCloudWhite50,
//                           backgroundColor: `${getPriorityColorStyle(p).backgroundColor}50`, 
//                         },
//                     pressed && { opacity: 0.7 }, 
//                   ]}
//                   accessibilityLabel={`Set priority to ${p}`}
//                 />
//               ))}
//             </View>
//           </View>

//           <Pressable
//             onPress={handleSubmit}
//             style={({ pressed }) => [
//               styles.addTaskButton,
//             ]}
//           >
//             <Feather name="plus" size={20} color={colors.softCloudWhite} />
//             <Text style={styles.addTaskButtonText}>Add Task</Text>
//           </Pressable>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   keyboardAvoidingView: {
//     zIndex: 10,
//   },
//   container: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.softCloudWhite20,
//     backgroundColor: colors.deepNightBlue,
//   },
//   textInput: {
//     width: "100%",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: colors.softCloudWhite95,
//     color: colors.deepNightBlue,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "transparent",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   errorContainer: {
//     position: "absolute",
//     bottom: -28,
//     left: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   errorText: {
//     color: colors.red400,
//     fontSize: 12,
//   },
//   priorityAndButtonContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 12,
//   },
//   prioritySelection: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   priorityLabel: {
//     color: colors.softCloudWhite,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   priorityButtons: {
//     flexDirection: "row",
//     gap: 4,
//   },
//   priorityButton: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     transitionDuration: 200,
//   },
//   addTaskButton: {
//     marginLeft: "auto",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: colors.royalBlue,
//     borderRadius: 12,
//   },
//   addTaskButtonText: {
//     color: colors.softCloudWhite,
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons"; 
import { colors } from "../lib/styles"; 

export default function TaskInput({ onAddTask }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Please enter a task");
      setTimeout(() => setError(""), 3000);
      return;
    }

    onAddTask({ text: text.trim(), priority });
    setText("");
    setPriority("medium");
    setError("");
  };

  const getPriorityColorStyle = (p) => {
    switch (p) {
      case "high":
        return { backgroundColor: colors.red500 };
      case "medium":
        return { backgroundColor: colors.mutedGold };
      case "low":
        return { backgroundColor: colors.green500 };
      default:
        return {};
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.container}>
        <View>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a new task..."
            placeholderTextColor={colors.smokeGray}
            style={styles.textInput}
            maxLength={200}
            returnKeyType="done"
            onSubmitEditing={handleSubmit} 
          />
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={14} color={colors.red400} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.priorityAndButtonContainer}>
          <View style={styles.prioritySelection}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {["high", "medium", "low"].map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={({ pressed }) => [
                    styles.priorityButton,
                    getPriorityColorStyle(p),
                    priority === p
                      ? {
                          borderColor: colors.softCloudWhite,
                          backgroundColor: getPriorityColorStyle(p).backgroundColor, 
                        }
                      : {
                          borderColor: colors.softCloudWhite50,
                          backgroundColor: `${getPriorityColorStyle(p).backgroundColor}50`, 
                        },
                    pressed && { opacity: 0.7 }, 
                  ]}
                  accessibilityLabel={`Set priority to ${p}`}
                />
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.addTaskButton,
            ]}
          >
            <Feather name="plus" size={20} color={colors.softCloudWhite} />
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    zIndex: 10,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.softCloudWhite20,
    backgroundColor: colors.deepNightBlue, 
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.softCloudWhite95,
    color: colors.deepNightBlue,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    position: "absolute",
    bottom: -28, 
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    color: colors.red400,
    fontSize: 12,
  },
  priorityAndButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  prioritySelection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityLabel: {
    color: colors.softCloudWhite,
    fontSize: 14,
    fontWeight: "500",
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 4,
  },
  priorityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    transitionDuration: 200,
  },
  addTaskButton: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.royalBlue,
    borderRadius: 12,
  },
  addTaskButtonText: {
    color: colors.softCloudWhite,
    fontWeight: "600",
    fontSize: 16,
  },
});