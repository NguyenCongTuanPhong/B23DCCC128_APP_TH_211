import React, { useState } from 'react';
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
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { GradeItem } from '../../types';

type AcademicNavProp = NativeStackNavigationProp<RootStackParamList>;

export const AcademicDetailScreen: React.FC = () => {
  const navigation = useNavigation<AcademicNavProp>();
  const { student, grades } = useStudent();
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const semesters = ['all', '2024.1', '2023.2', '2023.1'];

  const filteredGrades =
    selectedSemester === 'all'
      ? grades
      : grades.filter(g => g.semester === selectedSemester);

  const getLetterBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  const renderGradeCard = ({ item }: { item: GradeItem }) => (
    <View style={styles.gradeCard}>
      <View style={styles.cardHeader}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectCode}>{item.subjectCode}</Text>
          <Text style={styles.subjectName}>{item.subjectName}</Text>
          <Text style={styles.semesterTag}>Học kỳ: {item.semester}</Text>
        </View>
        <View style={styles.gradeBadgeContainer}>
          <Badge
            label={item.letterGrade}
            variant={getLetterBadgeVariant(item.letterGrade)}
            size="medium"
          />
          <Text style={styles.fourPointText}>{item.fourPointScore.toFixed(1)} / 4.0</Text>
        </View>
      </View>

      <View style={styles.scoreGrid}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreColLabel}>Tín chỉ</Text>
          <Text style={styles.scoreColValue}>{item.credits}</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCol}>
          <Text style={styles.scoreColLabel}>Chuyên cần (10%)</Text>
          <Text style={styles.scoreColValue}>{item.attendance.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCol}>
          <Text style={styles.scoreColLabel}>Giữa kỳ (30%)</Text>
          <Text style={styles.scoreColValue}>{item.midterm.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCol}>
          <Text style={styles.scoreColLabel}>Cuối kỳ (60%)</Text>
          <Text style={styles.scoreColValue}>{item.final.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCol}>
          <Text style={styles.scoreColLabel}>Tổng kết</Text>
          <Text style={[styles.scoreColValue, styles.scoreTotalHighlight]}>
            {item.totalScore.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Bảng Điểm Học Tập"
        subtitle={`Sinh viên: ${student.name} • ${student.id}`}
        onBackPress={() => navigation.goBack()}
      />

      {/* GPA Summary Top Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewItem}>
          <Text style={styles.overviewNumber}>{student.gpa4.toFixed(2)}</Text>
          <Text style={styles.overviewLabel}>GPA (Thang 4)</Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewItem}>
          <Text style={styles.overviewNumber}>{student.gpa10.toFixed(2)}</Text>
          <Text style={styles.overviewLabel}>GPA (Thang 10)</Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewItem}>
          <Text style={styles.overviewNumber}>
            {student.creditsEarned}/{student.totalCredits}
          </Text>
          <Text style={styles.overviewLabel}>Tín chỉ tích lũy</Text>
        </View>
        <View style={styles.overviewDivider} />
        <View style={styles.overviewItem}>
          <Text style={[styles.overviewNumber, styles.academicStatusText]}>
            {student.academicStatus}
          </Text>
          <Text style={styles.overviewLabel}>Xếp loại</Text>
        </View>
      </View>

      {/* Filter by Semester */}
      <View style={styles.semesterTabs}>
        {semesters.map(sem => (
          <TouchableOpacity
            key={sem}
            style={[styles.semTab, selectedSemester === sem && styles.semTabActive]}
            onPress={() => setSelectedSemester(sem)}>
            <Text
              style={[
                styles.semTabText,
                selectedSemester === sem && styles.semTabTextActive,
              ]}>
              {sem === 'all' ? 'Tất cả các kỳ' : `Kỳ ${sem}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grades List */}
      <FlatList
        data={filteredGrades}
        keyExtractor={item => item.id}
        renderItem={renderGradeCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  academicStatusText: {
    color: Colors.success,
    fontSize: 15,
  },
  overviewLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
  overviewDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.divider,
    alignSelf: 'center',
  },
  semesterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  semTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  semTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  semTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  semTabTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  gradeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
    marginRight: 10,
  },
  subjectCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  semesterTag: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gradeBadgeContainer: {
    alignItems: 'flex-end',
  },
  fourPointText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 3,
  },
  scoreGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreColLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 3,
    textAlign: 'center',
  },
  scoreColValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scoreTotalHighlight: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  scoreDivider: {
    width: 1,
    height: '75%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
});
