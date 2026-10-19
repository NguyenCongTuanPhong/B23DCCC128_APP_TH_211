import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { StudentResultCards } from '../../components/StudentResultCards';
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { Assignment, Subject } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { student, subjects, assignments, toggleAssignmentStatus } = useStudent();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  // Filter assignments by status: cần nộp, đã nộp, đã chấm
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');
  const upcomingAssignments = pendingAssignments.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header with Student Info */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingSubtitle}>Xin chào,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.studentName} numberOfLines={1}>
                {student.name}
              </Text>
              <View style={styles.nameGpaBadge}>
                <Text style={styles.nameGpaLabel}>GPA</Text>
                <Text style={styles.nameGpaValue}>{student.gpa4.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>MSSV: {student.id}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' } as any)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.name
                  .split(' ')
                  .map(w => w[0])
                  .slice(-2)
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Banner: Cần nộp, Đã nộp, Đã chấm */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.statItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MainTabs', { screen: 'AssignmentsTab' } as any)}>
            <Text style={[styles.statNumber, { color: Colors.warning }]}>
              {pendingAssignments.length}
            </Text>
            <Text style={styles.statLabel}>Bài tập cần nộp</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MainTabs', { screen: 'AssignmentsTab' } as any)}>
            <Text style={[styles.statNumber, { color: Colors.info }]}>
              {submittedAssignments.length}
            </Text>
            <Text style={styles.statLabel}>Bài tập đã nộp</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MainTabs', { screen: 'AssignmentsTab' } as any)}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>
              {gradedAssignments.length}
            </Text>
            <Text style={styles.statLabel}>Bài tập đã chấm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Section 1: Enrolled Subjects */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionTitle}>Môn học đang học</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{subjects.length}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'SubjectsTab' } as any)}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Subjects Scroll */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={subjects}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.subjectsHorizontalList}
          renderItem={({ item }: { item: Subject }) => (
            <TouchableOpacity
              style={styles.subjectCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SubjectDetail', { subject: item })}>
              <View style={[styles.subjectAccent, { backgroundColor: item.color }]} />
              <View style={styles.subjectContent}>
                <View style={styles.subjectCardTop}>
                  <Text style={styles.subjectCode}>{item.code}</Text>
                  <Badge label={`${item.credits} TC`} variant="primary" size="small" />
                </View>
                <Text style={styles.subjectName} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.subjectMeta}>
                  <Text style={styles.metaText} numberOfLines={1}>
                    📍 {item.room}
                  </Text>
                  <Text style={styles.metaText} numberOfLines={1}>
                    👨‍🏫 {item.lecturer}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Section 2: Upcoming / Pending Assignments */}
        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>⏰</Text>
            <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
            <View style={[styles.countPill, { backgroundColor: Colors.warningLight }]}>
              <Text style={[styles.countPillText, { color: Colors.warning }]}>
                {pendingAssignments.length}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: 'AssignmentsTab' } as any)}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {pendingAssignments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardIcon}>🎉</Text>
            <Text style={styles.emptyCardTitle}>Tuyệt vời!</Text>
            <Text style={styles.emptyCardSubtitle}>
              Bạn không còn bài tập nào cần nộp gấp.
            </Text>
          </View>
        ) : (
          upcomingAssignments.map((assignment: Assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('AssignmentDetail', { assignmentId: assignment.id })
              }>
              <TouchableOpacity
                style={styles.checkboxTouch}
                onPress={() => toggleAssignmentStatus(assignment.id)}>
                <View
                  style={[
                    styles.checkbox,
                    assignment.status !== 'pending' && styles.checkboxCompleted,
                  ]}>
                  {assignment.status !== 'pending' && (
                    <Icon name="check" size={12} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.assignmentInfo}>
                <View style={styles.assignmentTopRow}>
                  <Text style={styles.assignmentSubject}>{assignment.subjectCode}</Text>
                  <Badge
                    label={`Hạn: ${assignment.dueDate}`}
                    variant={assignment.priority === 'high' ? 'danger' : 'warning'}
                    size="small"
                  />
                </View>
                <Text style={styles.assignmentTitle} numberOfLines={2}>
                  {assignment.title}
                </Text>
                <Text style={styles.assignmentDueTime}>Giờ nộp: {assignment.dueTime}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Section 3: Kết Quả Cá Nhân (Từ yêu cầu: Học tập & Rèn luyện) */}
        <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>📊</Text>
            <Text style={styles.sectionTitle}>Kết quả cá nhân</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AcademicDetail')}>
            <Text style={styles.seeAllText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>

        <StudentResultCards
          student={student}
          onNavigateDetail={() => navigation.navigate('AcademicDetail')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  nameGpaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nameGpaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  nameGpaValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#92400E',
  },
  idBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  avatarBtn: {
    marginLeft: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: '75%',
    backgroundColor: Colors.divider,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderSpaced: {
    marginTop: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  subjectsHorizontalList: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  subjectCard: {
    width: 220,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  subjectAccent: {
    height: 5,
    width: '100%',
  },
  subjectContent: {
    padding: 14,
  },
  subjectCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    minHeight: 40,
    lineHeight: 20,
  },
  subjectMeta: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  assignmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
  },
  checkboxTouch: {
    paddingRight: 12,
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
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  assignmentDueTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  academicBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  academicBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  academicIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  academicIconText: {
    fontSize: 22,
  },
  academicBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  academicBannerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
