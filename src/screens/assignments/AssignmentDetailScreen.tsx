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

type AssignmentDetailRouteProp = RouteProp<RootStackParamList, 'AssignmentDetail'>;
type AssignmentDetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export const AssignmentDetailScreen: React.FC = () => {
  const navigation = useNavigation<AssignmentDetailNavProp>();
  const route = useRoute<AssignmentDetailRouteProp>();
  const { assignmentId } = route.params;
  const { assignments, toggleAssignmentStatus, subjects } = useStudent();

  const assignment = assignments.find(a => a.id === assignmentId);

  if (!assignment) {
    return (
      <View style={styles.container}>
        <CommonHeader title="Chi Tiết Bài Tập" onBackPress={() => navigation.goBack()} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy bài tập được yêu cầu.</Text>
        </View>
      </View>
    );
  }

  const isPending = assignment.status === 'pending';
  const isSubmitted = assignment.status === 'submitted';
  const isGraded = assignment.status === 'graded';
  const relatedSubject = subjects.find(
    s => s.id === assignment.subjectId || s.code === assignment.subjectCode,
  );

  const getStatusBadge = () => {
    if (isGraded) {
      return (
        <Badge
          label={`✓ Đã chấm (${assignment.score || 0}/${assignment.maxScore}đ)`}
          variant="success"
          size="medium"
        />
      );
    }
    if (isSubmitted) {
      return <Badge label="✓ Đã nộp bài (Chờ chấm)" variant="info" size="medium" />;
    }
    return <Badge label="⏳ Cần nộp bài" variant="warning" size="medium" />;
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Chi Tiết Bài Tập"
        subtitle={assignment.subjectCode}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={styles.badgeRow}>
            {getStatusBadge()}
            <Badge
              label={`Mức độ: ${
                assignment.priority === 'high'
                  ? 'Cao'
                  : assignment.priority === 'medium'
                  ? 'Trung bình'
                  : 'Thấp'
              }`}
              variant={assignment.priority === 'high' ? 'danger' : 'neutral'}
              size="medium"
            />
          </View>

          <Text style={styles.title}>{assignment.title}</Text>

          <View style={styles.subjectBox}>
            <Icon name="book" size={16} color={Colors.primary} />
            <Text style={styles.subjectBoxText}>{assignment.subjectName}</Text>
          </View>

          <View style={styles.divider} />

          {/* Due date info */}
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Hạn nộp bài</Text>
              <Text style={styles.infoValue}>
                {assignment.dueDate} (Trước {assignment.dueTime})
              </Text>
            </View>
          </View>

          {/* Max score info */}
          <View style={styles.infoRow}>
            <Icon name="star" size={16} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Thang điểm tối đa</Text>
              <Text style={styles.infoValue}>{assignment.maxScore} điểm</Text>
            </View>
          </View>
        </View>

        {/* Graded Result Card (if graded) */}
        {isGraded && (
          <View style={styles.gradedCard}>
            <View style={styles.gradedHeader}>
              <View>
                <Text style={styles.gradedTitle}>Kết quả chấm điểm</Text>
                <Text style={styles.gradedSubtitle}>Giảng viên đã hoàn thành chấm bài</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreNumber}>{assignment.score}</Text>
                <Text style={styles.scoreMax}>/{assignment.maxScore}</Text>
              </View>
            </View>
            {assignment.feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>Nhận xét của giảng viên:</Text>
                <Text style={styles.feedbackText}>{assignment.feedback}</Text>
              </View>
            )}
          </View>
        )}

        {/* Detailed Description */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionTitle}>Nội dung & Yêu cầu bài tập</Text>
          </View>
          <Text style={styles.descriptionText}>{assignment.description}</Text>
        </View>

        {/* Action Toggle Button */}
        <TouchableOpacity
          style={[
            styles.toggleStatusBtn,
            isPending ? styles.toggleStatusBtnPending : styles.toggleStatusBtnDone,
          ]}
          activeOpacity={0.85}
          onPress={() => toggleAssignmentStatus(assignment.id)}>
          <Icon
            name={isPending ? 'check' : 'close'}
            size={18}
            color={Colors.white}
            style={styles.toggleBtnIcon}
          />
          <Text style={styles.toggleBtnText}>
            {isPending
              ? 'Nộp bài tập (Đánh dấu ĐÃ NỘP)'
              : 'Đánh dấu CẦN NỘP LẠI'}
          </Text>
        </TouchableOpacity>

        {/* Related Subject Link */}
        {relatedSubject && (
          <TouchableOpacity
            style={styles.subjectLinkCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SubjectDetail', { subject: relatedSubject })}>
            <View style={styles.subjectLinkLeft}>
              <Text style={styles.subjectLinkIcon}>📚</Text>
              <View>
                <Text style={styles.subjectLinkTitle}>Xem môn học này</Text>
                <Text style={styles.subjectLinkSub}>{relatedSubject.name}</Text>
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
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
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 25,
    marginBottom: 12,
  },
  subjectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  subjectBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  toggleStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleStatusBtnDone: {
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
  },
  toggleStatusBtnPending: {
    backgroundColor: Colors.warning,
    shadowColor: Colors.warning,
  },
  toggleBtnIcon: {
    marginRight: 8,
  },
  toggleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  subjectLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  subjectLinkIcon: {
    fontSize: 22,
  },
  subjectLinkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subjectLinkSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  gradedCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  gradedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  gradedSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
  scoreMax: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  feedbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: '#064E3B',
    lineHeight: 19,
  },
});
