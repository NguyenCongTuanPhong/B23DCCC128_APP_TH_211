import { Platform } from 'react-native';

/**
 * Cấu hình BASE_URL cho mock server json-server:
 * - Máy ảo Android: http://10.0.2.2:3000
 * - Máy ảo iOS Simulator: http://localhost:3000
 * - Điện thoại thật (Wi-Fi cùng mạng): http://<IP-LAN-của-máy-tính>:3000
 */
export const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

export let BASE_URL = DEFAULT_BASE_URL;

export const setBaseUrl = (url: string) => {
  BASE_URL = url;
};

export const API_TIMEOUT = 10000;

export default {
  BASE_URL,
  DEFAULT_BASE_URL,
  setBaseUrl,
  API_TIMEOUT,
};