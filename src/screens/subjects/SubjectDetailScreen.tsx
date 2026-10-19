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
import { Assignment } from '../../types';

type SubjectDetailRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;
type SubjectDetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export const SubjectDetailScreen: React.FC = () => {
  const navigation = useNavigation<SubjectDetailNavProp>();
  const route = useRoute<SubjectDetailRouteProp>();
  const { subject } = route.params;
  const { assignments } = useStudent();

  // Find assignments for this subject
  const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Chi Tiết Môn Học"
        subtitle={subject.code}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={[styles.colorBar, { backgroundColor: subject.color }]} />
          <View style={styles.cardHeader}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{subject.code}</Text>
            </View>
            <Badge label={`${subject.credits} Tín chỉ`} variant="primary" size="medium" />
          </View>

          <Text style={styles.subjectTitle}>{subject.name}</Text>
          <Text style={styles.semesterText}>Học kỳ: {subject.semester}</Text>

          <View style={styles.divider} />

          {/* Lecturer Info */}
          <View style={styles.infoRow}>
            <Icon name="user" size={16} color={Colors.primary} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Giảng viên phụ trách</Text>
              <Text style={styles.infoValue}>{subject.lecturer}</Text>
              <Text style={styles.infoSubValue}>{subject.email}</Text>
            </View>
          </View>

          {/* Classroom Info */}
          <View style={styles.infoRow}>
            <Icon name="location" size={16} color={Colors.secondary} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Phòng học</Text>
              <Text style={styles.infoValue}>{subject.room}</Text>
            </View>
          </View>

          {/* Schedule Info */}
          <View style={styles.infoRow}>
            <Icon name="clock" size={16} color={Colors.warning} containerStyle={styles.iconCircle} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Thời gian học</Text>
              <Text style={styles.infoValue}>
                {subject.scheduleDay} • {subject.scheduleTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>📖</Text>
            <Text style={styles.sectionTitle}>Mục tiêu & Mô tả môn học</Text>
          </View>
          <Text style={styles.descriptionText}>{subject.description}</Text>
        </View>

        {/* Assignments for this subject */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>Bài tập môn học</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{subjectAssignments.length}</Text>
            </View>
          </View>

          {subjectAssignments.length === 0 ? (
            <Text style={styles.noAssignmentText}>Hiện chưa có bài tập nào cho môn học này.</Text>
          ) : (
            subjectAssignments.map((assignment: Assignment) => (
              <TouchableOpacity
                key={assignment.id}
                style={styles.assignmentItem}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('AssignmentDetail', { assignmentId: assignment.id })
                }>
                <View style={styles.assignmentItemLeft}>
                  <Text style={styles.assignmentItemTitle}>{assignment.title}</Text>
                  <Text style={styles.assignmentItemDue}>
                    Hạn nộp: {assignment.dueDate} ({assignment.dueTime})
                  </Text>
                </View>
                <Badge
                  label={
                    assignment.status === 'graded'
                      ? `Đã chấm (${assignment.score}đ)`
                      : assignment.status === 'submitted'
                      ? 'Đã nộp bài'
                      : 'Cần nộp'
                  }
                  variant={
                    assignment.status === 'graded'
                      ? 'success'
                      : assignment.status === 'submitted'
                      ? 'info'
                      : 'warning'
                  }
                />
              </TouchableOpacity>
            ))
          )}
        </View>
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
    position: 'relative',
    overflow: 'hidden',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  codeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: 4,
  },
  semesterText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
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
    color: Colors.textMuted,
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  noAssignmentText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  assignmentItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  assignmentItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  assignmentItemDue: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
