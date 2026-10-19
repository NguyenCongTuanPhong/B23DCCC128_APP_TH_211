import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge } from '../../components/Badge';
import { CommonHeader } from '../../components/CommonHeader';
import { Icon } from '../../components/Icon';
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

type ScheduleDetailRouteProp = RouteProp<RootStackParamList, 'ScheduleDetail'>;
type ScheduleDetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ScheduleDetailScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleDetailNavProp>();
  const route = useRoute<ScheduleDetailRouteProp>();
  const { schedule } = route.params;
  const { subjects } = useStudent();

  // Find related subject if exists
  const relatedSubject = subjects.find(s => s.id === schedule.subjectId || s.code === schedule.subjectCode);

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Chi Tiết Buổi Học"
        subtitle={`${schedule.dayName} • ${schedule.startTime} - ${schedule.endTime}`}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={[styles.topBar, { backgroundColor: schedule.color }]} />

          <View style={styles.badgeRow}>
            <Badge
              label={schedule.type}
              variant={schedule.type === 'Thực hành' ? 'info' : 'primary'}
              size="medium"
            />
            <View style={styles.timeBadge}>
              <Icon name="clock" size={13} color={Colors.primary} />
              <Text style={styles.timeBadgeText}>
                {schedule.startTime} - {schedule.endTime}
              </Text>
            </View>
          </View>

          <Text style={styles.subjectTitle}>{schedule.subjectName}</Text>
          <Text style={styles.subjectCode}>Mã môn học: {schedule.subjectCode}</Text>

          <View style={styles.divider} />

          {/* Time & Day */}
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Lịch học</Text>
              <Text style={styles.infoValue}>
                {schedule.dayName} ({schedule.startTime} - {schedule.endTime})
              </Text>
            </View>
          </View>

          {/* Classroom & Building */}
          <View style={styles.infoRow}>
            <Icon name="location" size={16} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Địa điểm học</Text>
              <Text style={styles.infoValue}>Phòng {schedule.room}</Text>
              <Text style={styles.infoSubValue}>{schedule.building}</Text>
            </View>
          </View>

          {/* Lecturer */}
          <View style={styles.infoRow}>
            <Icon name="user" size={16} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Giảng viên phụ trách</Text>
              <Text style={styles.infoValue}>{schedule.lecturer}</Text>
            </View>
          </View>
        </View>

        {/* Note / Instruction */}
        {schedule.note && (
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteIcon}>📌</Text>
              <Text style={styles.noteTitle}>Ghi chú buổi học</Text>
            </View>
            <Text style={styles.noteText}>{schedule.note}</Text>
          </View>
        )}

        {/* Quick action: Navigate to Subject details */}
        {relatedSubject && (
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SubjectDetail', { subject: relatedSubject })}>
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>📖</Text>
              <View>
                <Text style={styles.actionTitle}>Xem thông tin môn học</Text>
                <Text style={styles.actionSubtitle}>
                  {relatedSubject.name} ({relatedSubject.credits} tín chỉ)
                </Text>
              </View>
            </View>
            <Icon name="chevronRight" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  infoSubValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  noteCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  noteIcon: {
    fontSize: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warning,
  },
  noteText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
