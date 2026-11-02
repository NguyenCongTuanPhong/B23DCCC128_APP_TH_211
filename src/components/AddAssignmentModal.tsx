import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useStudent } from '../context/StudentContext';
import { Colors } from '../theme/colors';

interface AddAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  visible,
  onClose,
}) => {
  const { subjects, createAssignment, isOnline } = useStudent();

  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | string>(
    subjects.length > 0 ? subjects[0].id : 1,
  );
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tiêu đề bài tập.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createAssignment({
        title: title.trim(),
        courseId: Number(selectedCourseId) || selectedCourseId,
        description: description.trim() || 'Không có mô tả chi tiết.',
        dueDate: `${dueDate}T23:59:00Z`,
      });

      Alert.alert(
        'Thành công',
        isOnline
          ? 'Bài tập mới đã được tạo và lưu lên server!'
          : 'Đang ở chế độ Offline. Bài tập đã được lưu cục bộ và sẽ tự động đồng bộ khi có mạng!',
      );

      // Reset form
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo bài tập mới.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Thêm Bài Tập Mới</Text>
              <Text style={styles.subtitle}>API: POST /assignments</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}>
            {/* Tiêu đề */}
            <Text style={styles.label}>Tiêu đề bài tập *</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Bài tập lớn Socket TCP"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Môn học */}
            <Text style={styles.label}>Môn học *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.subjectSelector}>
              {subjects.map(s => {
                const isSelected = String(s.id) === String(selectedCourseId);
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.subjectChip,
                      isSelected && styles.subjectChipActive,
                    ]}
                    onPress={() => setSelectedCourseId(s.id)}>
                    <Text
                      style={[
                        styles.subjectChipText,
                        isSelected && styles.subjectChipTextActive,
                      ]}>
                      {s.code} - {s.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Hạn nộp */}
            <Text style={styles.label}>Hạn nộp (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-11-20"
              placeholderTextColor={Colors.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
            />

            {/* Mô tả */}
            <Text style={styles.label}>Mô tả yêu cầu</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập mô tả hoặc yêu cầu nộp bài..."
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Footer actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSubmitting}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              <Text style={styles.submitText}>
                {isSubmitting ? 'Đang lưu...' : 'Thêm bài tập'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
  },
  subjectSelector: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  subjectChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subjectChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subjectChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  subjectChipTextActive: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});