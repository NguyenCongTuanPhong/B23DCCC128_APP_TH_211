import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge } from '../../components/Badge';
import { CommonHeader } from '../../components/CommonHeader';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { ScheduleItem } from '../../types';

type ScheduleNavProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS = [
  { dayOfWeek: 2, label: 'Thứ 2', short: 'T2' },
  { dayOfWeek: 3, label: 'Thứ 3', short: 'T3' },
  { dayOfWeek: 4, label: 'Thứ 4', short: 'T4' },
  { dayOfWeek: 5, label: 'Thứ 5', short: 'T5' },
  { dayOfWeek: 6, label: 'Thứ 6', short: 'T6' },
  { dayOfWeek: 7, label: 'Thứ 7', short: 'T7' },
  { dayOfWeek: 8, label: 'Chủ Nhật', short: 'CN' },
];

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleNavProp>();
  const { schedules } = useStudent();
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to Monday

  // Filter schedules for the selected day
  const dailySchedules = useMemo(() => {
    return schedules
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay]);

  const activeDayObj = DAYS.find(d => d.dayOfWeek === selectedDay);

  const renderScheduleCard = ({ item }: { item: ScheduleItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ScheduleDetail', { schedule: item })}>
      <View style={[styles.cardColorStrip, { backgroundColor: item.color }]} />

      <View style={styles.cardContent}>
        {/* Top row: Type & Time */}
        <View style={styles.topRow}>
          <Badge
            label={item.type}
            variant={item.type === 'Thực hành' ? 'info' : 'primary'}
            size="small"
          />
          <View style={styles.timeContainer}>
            <Icon name="clock" size={13} color={Colors.primary} />
            <Text style={styles.timeText}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
        </View>

        {/* Subject name */}
        <Text style={styles.subjectName}>{item.subjectName}</Text>
        <Text style={styles.subjectCode}>Mã học phần: {item.subjectCode}</Text>

        <View style={styles.divider} />

        {/* Bottom row: Room & Lecturer */}
        <View style={styles.bottomRow}>
          <View style={styles.metaCol}>
            <View style={styles.metaRow}>
              <Icon name="location" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaHighlight}>{item.room}</Text>
              <Text style={styles.metaSub}>({item.building})</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Icon name="user" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.lecturer}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Thời Khóa Biểu"
        subtitle={`Lịch học theo tuần • ${activeDayObj?.label}`}
      />

      {/* Weekday Selector Bar */}
      <View style={styles.daysBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysBarContent}>
          {DAYS.map(day => {
            const isSelected = day.dayOfWeek === selectedDay;
            const countForDay = schedules.filter(s => s.dayOfWeek === day.dayOfWeek).length;

            return (
              <TouchableOpacity
                key={day.dayOfWeek}
                style={[styles.dayTab, isSelected && styles.dayTabActive]}
                onPress={() => setSelectedDay(day.dayOfWeek)}>
                <Text style={[styles.dayTabShort, isSelected && styles.dayTabShortActive]}>
                  {day.short}
                </Text>
                <Text style={[styles.dayTabLabel, isSelected && styles.dayTabLabelActive]}>
                  {day.label}
                </Text>
                {countForDay > 0 && (
                  <View
                    style={[
                      styles.dayDot,
                      isSelected ? styles.dayDotActive : styles.dayDotInactive,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Class Sessions List */}
      <FlatList
        data={dailySchedules}
        keyExtractor={item => item.id}
        renderItem={renderScheduleCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="☕"
            title={`Không có lịch học ${activeDayObj?.label}`}
            message="Hôm nay bạn không có tiết học nào trên giảng đường. Hãy thư giãn hoặc tự học nhé!"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  daysBarWrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  daysBarContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  dayTab: {
    width: 68,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  dayTabShort: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dayTabShortActive: {
    color: Colors.white,
  },
  dayTabLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dayTabLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
  dayDotActive: {
    backgroundColor: Colors.white,
  },
  dayDotInactive: {
    backgroundColor: Colors.primary,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardColorStrip: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  subjectCode: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metaSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    maxWidth: 150,
  },
});
