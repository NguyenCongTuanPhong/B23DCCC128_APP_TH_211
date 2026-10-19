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
import { SearchBar } from '../../components/SearchBar';
import { useStudent } from '../../context/StudentContext';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { Subject } from '../../types';

type SubjectsScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation<SubjectsScreenNavProp>();
  const { subjects } = useStudent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '2' | '3'>('all');

  // Filter subjects by search query (name or code) & credits
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const matchQuery =
        subject.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchFilter =
        selectedFilter === 'all'
          ? true
          : selectedFilter === '2'
          ? subject.credits === 2
          : subject.credits >= 3;

      return matchQuery && matchFilter;
    });
  }, [subjects, searchQuery, selectedFilter]);

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SubjectDetail', { subject: item })}>
      <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{item.code}</Text>
            <Text style={styles.semesterText}>{item.semester}</Text>
          </View>
          <Badge label={`${item.credits} Tín chỉ`} variant="primary" size="medium" />
        </View>

        <Text style={styles.subjectName}>{item.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="user" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.lecturer}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="location" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.room}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.scheduleInfo}>
            <Icon name="clock" size={13} color={Colors.primary} />
            <Text style={styles.scheduleText}>
              {item.scheduleDay} ({item.scheduleTime})
            </Text>
          </View>
          <View style={styles.detailLink}>
            <Text style={styles.detailLinkText}>Chi tiết</Text>
            <Icon name="chevronRight" size={14} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Danh Sách Môn Học"
        subtitle={`Tổng cộng ${subjects.length} môn trong học kỳ`}
      />

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm môn học theo tên hoặc mã môn..."
        />

        {/* Filter chips */}
        <View style={styles.filterChipsContainer}>
          <TouchableOpacity
            style={[styles.chip, selectedFilter === 'all' && styles.activeChip]}
            onPress={() => setSelectedFilter('all')}>
            <Text
              style={[
                styles.chipText,
                selectedFilter === 'all' && styles.activeChipText,
              ]}>
              Tất cả ({subjects.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedFilter === '3' && styles.activeChip]}
            onPress={() => setSelectedFilter('3')}>
            <Text
              style={[
                styles.chipText,
                selectedFilter === '3' && styles.activeChipText,
              ]}>
              3+ Tín chỉ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedFilter === '2' && styles.activeChip]}
            onPress={() => setSelectedFilter('2')}>
            <Text
              style={[
                styles.chipText,
                selectedFilter === '2' && styles.activeChipText,
              ]}>
              2 Tín chỉ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="Không tìm thấy môn học"
            message={`Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Vui lòng thử lại.`}
            actionText="Xóa bộ lọc"
            onAction={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    width: '100%',
  },
  cardBody: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  semesterText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  scheduleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
