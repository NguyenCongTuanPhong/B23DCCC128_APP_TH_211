import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncQueueItem } from '../types';

export const STORAGE_KEYS = {
  STUDENT: '@cache_student_v4',
  COURSES: '@cache_courses_v4',
  SESSIONS: '@cache_sessions_v4',
  ASSIGNMENTS: '@cache_assignments_v4',
  GRADES: '@cache_grades_v4',
  SYNC_QUEUE: '@offline_sync_queue_v4',
  BASE_URL: '@config_base_url_v4',
};

export const StorageService = {
  /**
   * Lưu dữ liệu vào cache AsyncStorage
   */
  async saveToCache<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.warn(`Lỗi khi lưu cache [${key}]:`, e);
    }
  },

  /**
   * Đọc dữ liệu từ cache AsyncStorage
   */
  async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.warn(`Lỗi khi đọc cache [${key}]:`, e);
      return null;
    }
  },

  /**
   * Xóa một key trong cache
   */
  async removeFromCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`Lỗi khi xóa cache [${key}]:`, e);
    }
  },

  /**
   * Lấy toàn bộ danh sách hàng đợi đồng bộ Offline
   */
  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queue = await this.getFromCache<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE);
      return queue || [];
    } catch (e) {
      console.warn('Lỗi khi lấy hàng đợi đồng bộ:', e);
      return [];
    }
  },

  /**
   * Thêm một thao tác vào hàng đợi đồng bộ Offline
   */
  async addToSyncQueue(
    item: Omit<SyncQueueItem, 'id' | 'createdAt'>,
  ): Promise<SyncQueueItem> {
    const queue = await this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedQueue = [...queue, newItem];
    await this.saveToCache(STORAGE_KEYS.SYNC_QUEUE, updatedQueue);
    return newItem;
  },

  /**
   * Xóa một phần tử khỏi hàng đợi sau khi đã đồng bộ thành công
   */
  async removeSyncQueueItem(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    const updatedQueue = queue.filter(item => item.id !== id);
    await this.saveToCache(STORAGE_KEYS.SYNC_QUEUE, updatedQueue);
  },

  /**
   * Xóa sạch hàng đợi đồng bộ
   */
  async clearSyncQueue(): Promise<void> {
    await this.saveToCache(STORAGE_KEYS.SYNC_QUEUE, []);
  },
};