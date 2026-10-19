import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'small',
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: styles.bgSuccess, text: styles.textSuccess };
      case 'warning':
        return { bg: styles.bgWarning, text: styles.textWarning };
      case 'danger':
        return { bg: styles.bgDanger, text: styles.textDanger };
      case 'info':
        return { bg: styles.bgInfo, text: styles.textInfo };
      case 'neutral':
        return { bg: styles.bgNeutral, text: styles.textNeutral };
      case 'primary':
      default:
        return { bg: styles.bgPrimary, text: styles.textPrimary };
    }
  };

  const variantStyles = getVariantStyles();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        variantStyles.bg,
        style,
      ]}>
      {icon ? <Text style={styles.badgeIcon}>{icon} </Text> : null}
      <Text
        style={[
          styles.badgeText,
          isSmall ? styles.textSmall : styles.textMedium,
          variantStyles.text,
          textStyle,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
  badgeSmall: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeMedium: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  badgeIcon: {
    fontSize: 11,
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  bgPrimary: {
    backgroundColor: Colors.primaryLight,
  },
  textPrimary: {
    color: Colors.primary,
  },
  bgSuccess: {
    backgroundColor: Colors.successLight,
  },
  textSuccess: {
    color: Colors.success,
  },
  bgWarning: {
    backgroundColor: Colors.warningLight,
  },
  textWarning: {
    color: Colors.warning,
  },
  bgDanger: {
    backgroundColor: Colors.dangerLight,
  },
  textDanger: {
    color: Colors.danger,
  },
  bgInfo: {
    backgroundColor: Colors.infoLight,
  },
  textInfo: {
    color: Colors.info,
  },
  bgNeutral: {
    backgroundColor: Colors.divider,
  },
  textNeutral: {
    color: Colors.textSecondary,
  },
});
