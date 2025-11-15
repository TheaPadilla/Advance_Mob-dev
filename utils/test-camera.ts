// Test script for camera functionality
// This file can be used to test the camera components

import { CameraType, CameraView } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

// Test camera permissions
export const testCameraPermissions = async () => {
  try {
    const { status } = await CameraView.requestCameraPermissionsAsync();
    console.log("Camera permission status:", status);
    return status === "granted";
  } catch (error) {
    console.error("Error requesting camera permission:", error);
    return false;
  }
};

// Test image manipulation
export const testImageManipulation = async (imageUri: string) => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ rotate: 90 }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log("Image manipulation successful:", result.uri);
    return result.uri;
  } catch (error) {
    console.error("Error manipulating image:", error);
    return null;
  }
};

// Test filter intensity calculation
export const testFilterIntensity = (intensity: number) => {
  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  const percentage = Math.round(clampedIntensity * 100);
  console.log(`Filter intensity: ${percentage}%`);
  return { intensity: clampedIntensity, percentage };
};

// Test camera type switching
export const testCameraTypeSwitch = (currentType: CameraType): CameraType => {
  const newType = currentType === "back" ? "front" : "back";
  console.log(`Switching camera from ${currentType} to ${newType}`);
  return newType;
};

// Test photo dimensions calculation
export const testPhotoDimensions = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = uri;
  });
};

console.log("Camera test utilities loaded successfully");