import React, { useMemo, useState } from 'react';
import {
  FlatList,
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
import { Assignment } from '../../types';

type AssignmentsNavProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'pending' | 'submitted' | 'graded';

export const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<AssignmentsNavProp>();
  const { assignments, toggleAssignmentStatus } = useStudent();
  const [filter, setFilter] = useState<FilterType>('all');

  // Filtered list
  const filteredAssignments = useMemo(() => {
    if (filter === 'all') return assignments;
    return assignments.filter(a => a.status === filter);
  }, [assignments, filter]);

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const processedCount = submittedCount + gradedCount;
  const progressPercent = assignments.length > 0 ? (processedCount / assignments.length) * 100 : 0;

  const renderAssignmentCard = ({ item }: { item: Assignment }) => {
    const isPending = item.status === 'pending';
    const isSubmitted = item.status === 'submitted';
    const isGraded = item.status === 'graded';

    const getStatusBadge = () => {
      if (isGraded) {
        return (
          <Badge
            label={`Đã chấm: ${item.score || 0}/${item.maxScore}đ`}
            variant="success"
            size="small"
          />
        );
      }
      if (isSubmitted) {
        return <Badge label="Đã nộp bài" variant="info" size="small" />;
      }
      return (
        <Badge
          label={`Hạn: ${item.dueDate}`}
          variant={item.priority === 'high' ? 'danger' : 'warning'}
          size="small"
        />
      );
    };

    return (
      <TouchableOpacity
        style={[styles.card, !isPending && styles.cardCompleted]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}>
        {/* Checkbox toggle */}
        <TouchableOpacity
          style={styles.checkboxTouchable}
          onPress={() => toggleAssignmentStatus(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View
            style={[
              styles.checkbox,
              isSubmitted && styles.checkboxSubmitted,
              isGraded && styles.checkboxGraded,
            ]}>
            {!isPending && <Icon name="check" size={12} color={Colors.white} />}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.subjectCode}>{item.subjectCode}</Text>
            {getStatusBadge()}
          </View>

          <Text
            style={[styles.assignmentTitle, !isPending && styles.assignmentTitleCompleted]}
            numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.subjectName}>{item.subjectName}</Text>

          <View style={styles.bottomRow}>
            <View style={styles.timeRow}>
              <Icon name="clock" size={12} color={Colors.textMuted} />
              <Text style={styles.timeText}>Trước {item.dueTime}</Text>
            </View>

            <View style={styles.statusAction}>
              <Text
                style={[
                  styles.statusText,
                  isPending && styles.statusTextPending,
                  isSubmitted && styles.statusTextSubmitted,
                  isGraded && styles.statusTextGraded,
                ]}>
                {isGraded
                  ? `Đã chấm (${item.score}đ)`
                  : isSubmitted
                  ? 'Đã nộp bài'
                  : 'Cần nộp'}
              </Text>
              <Icon name="chevronRight" size={14} color={Colors.textMuted} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Danh Sách Bài Tập"
        subtitle={`${processedCount}/${assignments.length} bài đã nộp & được chấm`}
      />

      {/* Progress & Summary Bar */}
      <View style={styles.summaryCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Tiến độ hoàn thành</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        {/* Filter Tabs: Tất cả, Cần nộp, Đã nộp, Đã chấm */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'all' && styles.tabBtnActive]}
            onPress={() => setFilter('all')}>
            <Text style={[styles.tabBtnText, filter === 'all' && styles.tabBtnTextActive]}>
              Tất cả ({assignments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'pending' && styles.tabBtnActive]}
            onPress={() => setFilter('pending')}>
            <Text style={[styles.tabBtnText, filter === 'pending' && styles.tabBtnTextActive]}>
              Cần nộp ({pendingCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'submitted' && styles.tabBtnActive]}
            onPress={() => setFilter('submitted')}>
            <Text style={[styles.tabBtnText, filter === 'submitted' && styles.tabBtnTextActive]}>
              Đã nộp ({submittedCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'graded' && styles.tabBtnActive]}
            onPress={() => setFilter('graded')}>
            <Text style={[styles.tabBtnText, filter === 'graded' && styles.tabBtnTextActive]}>
              Đã chấm ({gradedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Assignments List */}
      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.id}
        renderItem={renderAssignmentCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={filter === 'pending' ? '🎉' : '📋'}
            title={
              filter === 'pending'
                ? 'Không còn bài tập cần nộp'
                : filter === 'submitted'
                ? 'Chưa có bài tập nào đã nộp'
                : filter === 'graded'
                ? 'Chưa có bài tập nào được chấm'
                : 'Chưa có bài tập'
            }
            message="Bạn có thể kiểm tra các danh mục khác hoặc cập nhật trạng thái bài tập."
            actionText={filter !== 'all' ? 'Xem tất cả bài tập' : undefined}
            onAction={() => setFilter('all')}
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
  summaryCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardCompleted: {
    opacity: 0.9,
    backgroundColor: '#FAFAFA',
  },
  checkboxTouchable: {
    paddingRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSubmitted: {
    backgroundColor: Colors.info,
    borderColor: Colors.info,
  },
  checkboxGraded: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 3,
  },
  assignmentTitleCompleted: {
    color: Colors.textSecondary,
  },
  subjectName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPending: {
    color: Colors.warning,
  },
  statusTextSubmitted: {
    color: Colors.info,
  },
  statusTextGraded: {
    color: Colors.success,
  },
});
