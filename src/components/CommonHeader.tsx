import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icon';

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="back" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={rightAction.onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.rightActionIcon}>{rightAction.icon}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  rightButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  rightActionIcon: {
    fontSize: 18,
  },
});
