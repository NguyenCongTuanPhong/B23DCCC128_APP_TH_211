import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Icon } from './Icon';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  onSave: (name: string, email: string, phone: string) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialName,
  initialEmail,
  initialPhone,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when opened
  React.useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
    setPhone(initialPhone);
  }, [initialName, initialEmail, initialPhone, visible]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập họ và tên.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 8) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(trimmedName, trimmedEmail, trimmedPhone);
      setIsSaving(false);
      onClose();
    } catch {
      setIsSaving(false);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Chỉnh sửa thông tin</Text>
              <Text style={styles.subtitle}>Cập nhật thông tin liên hệ sinh viên</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            {/* Field: Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Họ và tên *</Text>
              <View style={styles.inputContainer}>
                <Icon name="user" size={16} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nhập họ và tên..."
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Field: Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email sinh viên *</Text>
              <View style={styles.inputContainer}>
                <Icon name="email" size={16} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập địa chỉ email..."
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Field: Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <View style={styles.inputContainer}>
                <Icon name="phone" size={16} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Nhập số điện thoại..."
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSaving}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
              <Text style={styles.saveBtnText}>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
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
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingVertical: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
