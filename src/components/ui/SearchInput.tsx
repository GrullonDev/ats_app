import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '@utils/responsive';
import { Colors, BorderRadius, Shadows, Spacing, Typography } from '@constants/index';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  onFilterPress,
  showFilter = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Search...'}
          placeholderTextColor={Colors.textDisabled}
        />
      </View>
      {showFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="filter" size={20} color={Colors.primary[700]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[4],
    height: verticalScale(48),
    borderWidth: moderateScale(1),
    borderColor: Colors.border,
  },
  icon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.regular,
  },
  filterButton: {
    width: verticalScale(48),
    height: verticalScale(48),
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: moderateScale(1),
    borderColor: Colors.border,
  },
});
