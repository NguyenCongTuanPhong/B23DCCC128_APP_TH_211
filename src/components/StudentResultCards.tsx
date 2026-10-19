import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Student } from '../types';

interface StudentResultCardsProps {
  student: Student;
  onNavigateDetail: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 36;

export const StudentResultCards: React.FC<StudentResultCardsProps> = ({
  student,
  onNavigateDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'academic' | 'training'>('academic');

  // Calculate training score percentage for marker position
  const trainingScore = student.trainingScore || 88;
  const scorePercent = Math.min(Math.max(trainingScore, 0), 100);

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'academic' && styles.tabButtonActive]}
          onPress={() => setActiveTab('academic')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'academic' && styles.tabButtonTextActive,
            ]}>
            Kết quả học tập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'training' && styles.tabButtonActive]}
          onPress={() => setActiveTab('training')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'training' && styles.tabButtonTextActive,
            ]}>
            Kết quả rèn luyện
          </Text>
        </TouchableOpacity>
      </View>

      {/* CARD 1: KẾT QUẢ HỌC TẬP */}
      {activeTab === 'academic' && (
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.cardTitle}>Kết quả học tập</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {student.academicStatus || 'Chưa xếp loại'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onNavigateDetail} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.redArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Donut Chart / Circular Credits Progress */}
          <View style={styles.donutSection}>
            <View style={styles.donutContainer}>
              <View style={styles.donutTrack}>
                {/* Yellow Arc Simulation */}
                <View style={styles.donutArcYellow} />
                {/* Teal Top Accent Dot */}
                <View style={styles.donutTealDot} />
                {/* Inner white circle */}
                <View style={styles.donutCenter}>
                  <Text style={styles.donutCreditNumber}>{student.creditsEarned}</Text>
                  <Text style={styles.donutCreditLabel}>Tín chỉ</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Metrics breakdown */}
          <View style={styles.metricsList}>
            {/* Row 1: GPA */}
            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View style={[styles.metricDot, { backgroundColor: '#0D9488' }]} />
                <Text style={styles.metricLabel}>
                  GPA <Text style={styles.metricSub}>({student.gpa4 ? '/4' : '/4'})</Text>
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: '#0D9488' }]}>
                {student.gpa4.toFixed(2)}
              </Text>
            </View>

            {/* Row 2: CPA */}
            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View style={[styles.metricDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.metricLabel}>
                  CPA <Text style={styles.metricSub}>({student.cpa4 ? '/4' : '/4'})</Text>
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
                {(student.cpa4 || student.gpa4).toFixed(2)}
              </Text>
            </View>

            {/* Row 3: STC */}
            <View style={styles.metricRow}>
              <View style={styles.metricLeft}>
                <View style={[styles.metricDot, { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.metricLabel}>
                  STC <Text style={styles.metricSub}>({`/${student.totalCredits}`})</Text>
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: '#64748B' }]}>
                {student.creditsEarned}
              </Text>
            </View>
          </View>

          {/* Slider bar indicator */}
          <View style={styles.sliderPillContainer}>
            <View style={styles.sliderPill} />
          </View>

          {/* Smart Calculator button */}
          <TouchableOpacity
            style={styles.calculatorBtn}
            activeOpacity={0.85}
            onPress={onNavigateDetail}>
            <Text style={styles.calculatorText}>Máy tính thông minh</Text>
            <Text style={styles.calculatorArrow}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CARD 2: KẾT QUẢ RÈN LUYỆN */}
      {activeTab === 'training' && (
        <View style={styles.card}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.cardTitle}>Kết quả rèn luyện</Text>
              <Text style={styles.currentSubtitle}>(Hiện tại)</Text>
            </View>
            <TouchableOpacity onPress={onNavigateDetail} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.redArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Score Gauge & Scale */}
          <View style={styles.gaugeContainer}>
            {/* Tooltip speech bubble */}
            <View style={[styles.tooltipWrapper, { left: `${Math.max(scorePercent - 14, 0)}%` }]}>
              <View style={styles.tooltipBubble}>
                <Text style={styles.tooltipText}>{trainingScore} điểm</Text>
              </View>
              <View style={styles.tooltipArrow} />
            </View>

            {/* Segmented multi-color progress bar */}
            <View style={styles.colorBarContainer}>
              <View style={[styles.barSegment, { flex: 35, backgroundColor: '#CBD5E1' }]} />
              <View style={[styles.barSegment, { flex: 15, backgroundColor: '#DC2626' }]} />
              <View style={[styles.barSegment, { flex: 15, backgroundColor: '#F59E0B' }]} />
              <View style={[styles.barSegment, { flex: 15, backgroundColor: '#2563EB' }]} />
              <View style={[styles.barSegment, { flex: 10, backgroundColor: '#0D9488' }]} />
              <View style={[styles.barSegment, { flex: 10, backgroundColor: '#16A34A' }]} />
            </View>

            {/* Scale markers */}
            <View style={styles.scaleRow}>
              <Text style={styles.scaleText}>0</Text>
              <Text style={styles.scaleText}>35</Text>
              <Text style={styles.scaleText}>50</Text>
              <Text style={styles.scaleText}>65</Text>
              <Text style={styles.scaleText}>80</Text>
              <Text style={styles.scaleText}>90</Text>
              <Text style={styles.scaleText}>100</Text>
            </View>
          </View>

          {/* Classification Legend Table */}
          <View style={styles.legendTable}>
            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#CBD5E1' }]} />
                <Text style={styles.legendLabel}>Loại kém</Text>
              </View>
              <Text style={styles.legendRange}>&lt;35</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendLabel}>Loại yếu</Text>
              </View>
              <Text style={styles.legendRange}>35&lt;50</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendLabel}>Loại trung bình</Text>
              </View>
              <Text style={styles.legendRange}>50&lt;65</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#2563EB' }]} />
                <Text style={styles.legendLabel}>Loại khá</Text>
              </View>
              <Text style={styles.legendRange}>65&lt;80</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#0D9488' }]} />
                <Text style={styles.legendLabel}>Loại tốt</Text>
              </View>
              <Text style={styles.legendRange}>80&lt;90</Text>
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendSquare, { backgroundColor: '#16A34A' }]} />
                <Text style={styles.legendLabel}>Loại xuất sắc</Text>
              </View>
              <Text style={styles.legendRange}>90&lt;100</Text>
            </View>
          </View>

          {/* Slider bar indicator */}
          <View style={styles.sliderPillContainer}>
            <View style={styles.sliderPill} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: '#64748B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  currentSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  redArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 6,
  },
  donutSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  donutContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTrack: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 12,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutArcYellow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 12,
    borderColor: '#FBBF24',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  donutTealDot: {
    position: 'absolute',
    top: -10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0D9488',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  donutCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCreditNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  donutCreditLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  metricsList: {
    paddingHorizontal: 6,
    marginTop: 6,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  sliderPillContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sliderPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E293B',
  },
  calculatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  calculatorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  calculatorArrow: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  gaugeContainer: {
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  tooltipWrapper: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
  },
  tooltipBubble: {
    backgroundColor: '#94A3B8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#94A3B8',
  },
  colorBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  barSegment: {
    height: '100%',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  scaleText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  legendTable: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  legendRange: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
