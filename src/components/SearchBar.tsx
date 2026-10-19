import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm môn học...',
  onClear,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon name="search" size={16} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close" size={12} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
