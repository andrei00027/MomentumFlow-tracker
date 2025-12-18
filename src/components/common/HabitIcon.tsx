import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { Colors } from '../../constants/Colors';

interface Props {
  name: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  containerSize?: number;
}

export const HabitIcon: React.FC<Props> = ({
  name,
  size = 32,
  color = Colors.primary,
  backgroundColor,
  containerSize,
}) => {
  // Check if it's an emoji (non-ASCII characters)
  const isEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(name);

  if (isEmoji) {
    // Render emoji
    const emojiContainerStyle: ViewStyle[] = [styles.container];
    if (backgroundColor) {
      emojiContainerStyle.push({ backgroundColor });
    }
    if (containerSize) {
      emojiContainerStyle.push({ width: containerSize, height: containerSize });
    }

    return (
      <View style={emojiContainerStyle}>
        <Text style={{ fontSize: size }}>{name}</Text>
      </View>
    );
  }

  // Render Remix Icon
  // Convert icon ID to remix icon name format (e.g., 'heart-pulse' -> 'heart-pulse-fill')
  const iconName = (name.endsWith('-fill') || name.endsWith('-line') ? name : `${name}-fill`) as IconName;

  const iconContainerStyle: ViewStyle[] = [styles.container];
  if (backgroundColor) {
    iconContainerStyle.push({
      backgroundColor,
      borderRadius: (containerSize || size) / 2,
      padding: 4,
    });
  }
  if (containerSize) {
    iconContainerStyle.push({ width: containerSize, height: containerSize });
  }

  return (
    <View style={iconContainerStyle}>
      <Icon name={iconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
