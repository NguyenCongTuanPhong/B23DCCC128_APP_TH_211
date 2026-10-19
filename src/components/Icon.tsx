import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

export type IconName =
  | 'home'
  | 'book'
  | 'calendar'
  | 'clipboard'
  | 'user'
  | 'search'
  | 'back'
  | 'check'
  | 'close'
  | 'clock'
  | 'location'
  | 'edit'
  | 'award'
  | 'star'
  | 'chevronRight'
  | 'building'
  | 'email'
  | 'phone'
  | 'sparkles'
  | 'flag'
  | 'info';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  bg?: string;
}

const ICON_MAP: Record<IconName, string> = {
  home: '🏠',
  book: '📖',
  calendar: '📅',
  clipboard: '📝',
  user: '👤',
  search: '🔍',
  back: '←',
  check: '✓',
  close: '✕',
  clock: '🕒',
  location: '📍',
  edit: '✏️',
  award: '🎓',
  star: '⭐',
  chevronRight: '›',
  building: '🏛️',
  email: '✉️',
  phone: '📞',
  sparkles: '✨',
  flag: '🚩',
  info: 'ℹ️',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = Colors.textPrimary,
  style,
  containerStyle,
  bg,
}) => {
  const symbol = ICON_MAP[name] || '•';
  const isArrowOrSymbol = name === 'back' || name === 'check' || name === 'close' || name === 'chevronRight';

  const iconElement = (
    <Text
      style={[
        styles.iconText,
        {
          fontSize: size,
          lineHeight: size * 1.25,
          color: isArrowOrSymbol ? color : undefined,
        },
        style,
      ]}>
      {symbol}
    </Text>
  );

  if (bg || containerStyle) {
    return (
      <View
        style={[
          styles.container,
          {
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: (size * 1.8) / 2,
            backgroundColor: bg || Colors.primaryLight,
          },
          containerStyle,
        ]}>
        {iconElement}
      </View>
    );
  }

  return iconElement;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
