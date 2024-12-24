

import { Capacitor } from '@capacitor/core';
import { Geolocation, Position, PermissionStatus } from '@capacitor/geolocation';

async function getNativePosition(): Promise<GeolocationPosition | null> {
  try {
    let permission: PermissionStatus = await Geolocation.checkPermissions();
    if (permission.location !== 'granted') {
      permission = await Geolocation.requestPermissions();
    }
    if (permission.location === 'granted') {
      return await Geolocation.getCurrentPosition() as any;
    }
    return null;
  } catch (error) {
    console.error('Error getting native position:', error);
    return null;
  }
}

function getWebPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

export async function getPosition(): Promise<GeolocationPosition | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      return await getNativePosition();
    } else {
      return await getWebPosition();
    }
  } catch (error) {
    console.error('Error getting position:', error);
    return null;
  }
}