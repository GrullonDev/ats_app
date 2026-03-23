import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference screen dimensions (based on a standard 375x812 display like iPhone X/11 Pro)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scales a value based on the screen width.
 * Best for: horizontal padding, margin, width, icons, etc.
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scales a value based on the screen height.
 * Best for: vertical padding, margin, height, etc.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Scales a value with a moderation factor. 
 * This prevents the scaling from becoming too exaggerated on very large or small screens.
 * Best for: font sizes, some padding/margins.
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Scales a value based on height with a moderation factor.
 */
export const moderateVerticalScale = (size: number, factor = 0.5) => size + (verticalScale(size) - size) * factor;

/**
 * Helpful constants for layout
 */
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const WINDOW_WIDTH = SCREEN_WIDTH;
export const WINDOW_HEIGHT = SCREEN_HEIGHT;

/**
 * Check if the device is a tablet
 */
export const IS_TABLET = SCREEN_WIDTH > 550;

/**
 * Responsive Font Size logic
 */
export const RFValue = (fontSize: number) => {
  const standardHeight = 812;
  const heightPercent = (SCREEN_HEIGHT * fontSize) / standardHeight;
  return Math.round(heightPercent);
};
