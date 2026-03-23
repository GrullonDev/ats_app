import React from 'react';
import { View, Image, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Typography } from '@constants/index';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  isOnline?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  isOnline,
  style,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image source={{ uri }} style={[styles.image, { borderRadius: size / 2 }]} />
        ) : (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}
      </View>
      {isOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size / 4,
              height: size / 4,
              borderRadius: size / 8,
              bottom: 2,
              right: 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[100],
  },
  initials: {
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: Colors.accent.green,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
