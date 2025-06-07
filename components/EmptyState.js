import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../lib/styles"; 

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <Feather name="check-circle" size={48} color={colors.mutedGold} />
          </View>
          <View style={styles.sparkle}>
            <Feather name="zap" size={20} color={colors.mutedGold} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>No tasks yet!</Text>
          <Text style={styles.description}>
            Add your first task above to get started on your journey to better
            organization.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Stay Organized!</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: {
    alignItems: "center",
    gap: 24, 
    maxWidth: 380,
  },
  iconContainer: {
    position: "relative",
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.mutedGold20,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    top: -8, 
    right: -8, 
  },
  textContainer: {
    gap: 12, 
    alignItems: "center", 
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.softCloudWhite,
  },
  description: {
    color: colors.softCloudWhite70,
    fontSize: 16,
    lineHeight: 24, 
    textAlign: "center",
  },
  footer: {
    paddingTop: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.mutedGold20,
    borderRadius: 9999, 
  },
  tagText: {
    color: colors.mutedGold,
    fontSize: 14,
    fontWeight: "500",
  },
});