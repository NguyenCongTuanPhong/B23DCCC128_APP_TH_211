import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStudent } from '../context/StudentContext';
import { Colors } from '../theme/colors';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, pendingSyncCount, syncOfflineQueue } = useStudent();

  // Nếu online và không có thay đổi nào trong hàng đợi đồng bộ thì ẩn banner
  if (isOnline && pendingSyncCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <View
      style={[
        styles.banner,
        !isOnline ? styles.bannerOffline : styles.bannerSyncPending,
      ]}>
      <View style={styles.content}>
        <Text style={styles.icon}>
          {isSyncing ? '⏳' : !isOnline ? '📡' : '🔄'}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isSyncing
              ? 'Đang đồng bộ dữ liệu...'
              : !isOnline
              ? 'Chế độ Ngoại tuyến (Offline)'
              : 'Chờ đồng bộ lên máy chủ'}
          </Text>
          <Text style={styles.subtitle}>
            {!isOnline
              ? pendingSyncCount > 0
                ? `Đang dùng Cache • Có ${pendingSyncCount} thay đổi chờ gửi khi có mạng`
                : 'Đang dùng Cache từ bộ nhớ máy (AsyncStorage)'
              : `Có ${pendingSyncCount} thao tác offline sẵn sàng đồng bộ`}
          </Text>
        </View>
      </View>

      {isSyncing ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        isOnline && pendingSyncCount > 0 && (
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={syncOfflineQueue}
            activeOpacity={0.8}>
            <Text style={styles.syncBtnText}>Đồng bộ</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 9999,
  },
  bannerOffline: {
    backgroundColor: '#DC2626', // Màu đỏ cảnh báo mất mạng
  },
  bannerSyncPending: {
    backgroundColor: '#D97706', // Màu cam đang có queue chờ gửi
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  syncBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  syncBtnText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
});