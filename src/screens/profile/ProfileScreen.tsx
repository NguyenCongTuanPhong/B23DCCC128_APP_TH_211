import React, { useState } from 'react';
import {
  Alert,
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
import { EditProfileModal } from '../../components/EditProfileModal';
import { Icon } from '../../components/Icon';
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { student, updateStudentProfile, resetToDefaults } = useStudent();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleSaveProfile = async (name: string, email: string, phone: string) => {
    await updateStudentProfile({ name, email, phone });
    Alert.alert('Thành công', 'Thông tin sinh viên đã được cập nhật!');
  };

  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu gốc',
      'Bạn có chắc chắn muốn đặt lại toàn bộ thông tin cá nhân và bài tập về mặc định ban đầu không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: async () => {
            await resetToDefaults();
            Alert.alert('Đã đặt lại', 'Dữ liệu đã được khôi phục về trạng thái gốc.');
          },
        },
      ],
    );
  };

  const creditsPercent = (student.creditsEarned / student.totalCredits) * 100;

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Cá Nhân & Kết Quả"
        subtitle={`Sinh viên: ${student.name}`}
        rightAction={{
          icon: '✏️',
          onPress: () => setIsEditModalVisible(true),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
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
            <View style={styles.mainInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={styles.badgeRow}>
                <Badge label={`MSSV: ${student.id}`} variant="primary" size="small" />
                <Badge label={student.academicStatus} variant="success" size="small" />
              </View>
              <Text style={styles.majorText}>{student.major}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Quick specs grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Lớp sinh viên</Text>
              <Text style={styles.specValue}>{student.studentClass}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Khoa đào tạo</Text>
              <Text style={styles.specValue}>{student.faculty}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Niên khóa</Text>
              <Text style={styles.specValue}>{student.academicYear}</Text>
            </View>
          </View>

          {/* Edit button */}
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => setIsEditModalVisible(true)}>
            <Icon name="edit" size={15} color={Colors.primary} />
            <Text style={styles.editBtnText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📇</Text>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          </View>

          <View style={styles.contactItem}>
            <Icon name="email" size={16} containerStyle={styles.contactIconBg} />
            <View style={styles.contactItemInfo}>
              <Text style={styles.contactLabel}>Email sinh viên</Text>
              <Text style={styles.contactValue}>{student.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Icon name="phone" size={16} containerStyle={styles.contactIconBg} />
            <View style={styles.contactItemInfo}>
              <Text style={styles.contactLabel}>Số điện thoại</Text>
              <Text style={styles.contactValue}>{student.phone}</Text>
            </View>
          </View>
        </View>

        {/* Academic Overview Card */}
        <View style={styles.academicCard}>
          <View style={styles.academicHeader}>
            <View>
              <Text style={styles.academicTitle}>Kết quả học tập tích lũy</Text>
              <Text style={styles.academicSubtitle}>Cập nhật mới nhất học kỳ hiện tại</Text>
            </View>
            <Badge label={student.academicStatus} variant="success" size="medium" />
          </View>

          <View style={styles.gpaRow}>
            <View style={styles.gpaBox}>
              <Text style={styles.gpaLabel}>Điểm GPA (Thang 4)</Text>
              <Text style={styles.gpaNumber}>{student.gpa4.toFixed(2)}</Text>
              <Text style={styles.gpaSub}>Thang điểm 4.0</Text>
            </View>
            <View style={styles.gpaDivider} />
            <View style={styles.gpaBox}>
              <Text style={styles.gpaLabel}>Điểm GPA (Thang 10)</Text>
              <Text style={styles.gpaNumber}>{student.gpa10.toFixed(2)}</Text>
              <Text style={styles.gpaSub}>Thang điểm 10.0</Text>
            </View>
          </View>

          {/* Credits progress */}
          <View style={styles.creditProgressSection}>
            <View style={styles.creditProgressHeader}>
              <Text style={styles.creditLabel}>Số tín chỉ tích lũy</Text>
              <Text style={styles.creditValue}>
                {student.creditsEarned} / {student.totalCredits} TC ({Math.round(creditsPercent)}%)
              </Text>
            </View>
            <View style={styles.creditTrack}>
              <View style={[styles.creditFill, { width: `${creditsPercent}%` }]} />
            </View>
          </View>

          {/* View Detailed Academic Record */}
          <TouchableOpacity
            style={styles.viewDetailBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AcademicDetail')}>
            <Text style={styles.viewDetailBtnText}>Xem chi tiết bảng điểm</Text>
            <Icon name="chevronRight" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Utility Reset Data */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
          <Text style={styles.resetBtnText}>🔄 Khôi phục dữ liệu mẫu ban đầu</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialName={student.name}
        initialEmail={student.email}
        initialPhone={student.phone}
        onSave={handleSaveProfile}
      />
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
    paddingBottom: 36,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  mainInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  majorText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 14,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
  },
  contactItemInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  academicCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  academicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  academicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  academicSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gpaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  gpaBox: {
    flex: 1,
    alignItems: 'center',
  },
  gpaLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  gpaNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  gpaSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  gpaDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  creditProgressSection: {
    marginBottom: 16,
  },
  creditProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  creditLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  creditValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  creditTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
    overflow: 'hidden',
  },
  creditFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  viewDetailBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
