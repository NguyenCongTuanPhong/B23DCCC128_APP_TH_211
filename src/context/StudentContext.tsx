import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import {
  initialAssignments,
  initialGradeRecords,
  initialSchedules,
  initialStudent,
  initialSubjects,
} from '../data/mockData';
import { ApiService } from '../services/api';
import { STORAGE_KEYS, StorageService } from '../services/storage';
import {
  Assignment,
  AssignmentStatus,
  GradeItem,
  ScheduleItem,
  Student,
  Subject,
} from '../types';

interface StudentContextType {
  student: Student;
  subjects: Subject[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  grades: GradeItem[];
  isLoading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncTime: Date | null;
  refreshData: (silent?: boolean) => Promise<void>;
  updateStudentProfile: (
    updates: Partial<Pick<Student, 'name' | 'fullName' | 'email' | 'phone' | 'studentClass' | 'className' | 'major'>>,
  ) => Promise<void>;
  toggleAssignmentStatus: (assignmentId: string | number) => Promise<void>;
  createAssignment: (data: {
    title: string;
    courseId: number | string;
    description: string;
    dueDate: string;
  }) => Promise<void>;
  syncOfflineQueue: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Bảng màu nhận diện môn học
const COLORS = [
  '#0F766E',
  '#0284C7',
  '#059669',
  '#0D9488',
  '#D97706',
  '#E11D48',
  '#7C3AED',
  '#2563EB',
];

const DAY_NAMES: Record<number, string> = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
  7: 'Thứ Bảy',
  8: 'Chủ Nhật',
};

/**
 * Chuẩn hóa dữ liệu sinh viên để vừa tương thích API vừa tương thích UI
 */
function normalizeStudent(raw: any): Student {
  if (!raw) return initialStudent;
  const fullName = raw.fullName || raw.name || 'Nguyễn Văn Đông';
  const studentCode = raw.studentCode || raw.id || 'B23DCCC040';
  const className = raw.className || raw.studentClass || 'CNTT-K21A';

  return {
    ...raw,
    id: studentCode,
    studentCode: studentCode,
    fullName: fullName,
    name: fullName, // alias
    className: className,
    studentClass: className, // alias
    major: raw.major || 'Công nghệ thông tin',
    faculty: raw.faculty || 'Khoa Công nghệ Thông tin',
    email: raw.email || 'dong.b23dccc040@stu.ptit.edu.vn',
    phone: raw.phone || '0912345678',
    academicYear: raw.academicYear || '2021 - 2025',
    gpa10: Number(raw.gpa10) || 8.65,
    gpa4: Number(raw.gpa4) || 3.68,
    cpa4: Number(raw.cpa4) || 3.65,
    creditsEarned: Number(raw.creditsEarned) || 118,
    totalCredits: Number(raw.totalCredits) || 145,
    academicStatus: raw.academicStatus || 'Xuất sắc',
    trainingScore: Number(raw.trainingScore) || 88,
    trainingStatus: raw.trainingStatus || 'Tốt',
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Chuẩn hóa môn học
 */
function normalizeCourse(raw: any, index: number = 0): Subject {
  return {
    ...raw,
    id: String(raw.id),
    code: raw.code || `INT${1000 + index}`,
    name: raw.name || 'Môn học',
    credits: Number(raw.credits) || 3,
    lecturer: raw.lecturer || 'Giảng viên',
    description: raw.description || '',
    semester: raw.semester || 'HK1 2026-2027',
    color: raw.color || COLORS[index % COLORS.length],
    email: raw.email || `${(raw.code || 'gv').toLowerCase()}@edu.vn`,
    room: raw.room || `P.${301 + index}-A2`,
    scheduleDay: raw.scheduleDay || 'Thứ Hai',
    scheduleTime: raw.scheduleTime || '07:00 - 09:30',
    status: 'active',
  };
}

/**
 * Chuẩn hóa buổi học (sessions)
 */
function normalizeSession(raw: any, index: number = 0): ScheduleItem {
  const course = raw.course;
  const dayOfWeek = Number(raw.dayOfWeek) || 2;
  return {
    ...raw,
    id: String(raw.id),
    courseId: raw.courseId,
    subjectId: String(raw.courseId),
    subjectCode: course?.code || `HP${raw.courseId}`,
    subjectName: course?.name || 'Môn học',
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek] || 'Thứ Hai',
    startTime: raw.startTime || '07:00',
    endTime: raw.endTime || '09:30',
    room: raw.room || 'P.301-A2',
    building: raw.room?.includes('-') ? `Tòa nhà ${raw.room.split('-')[1]}` : 'Tòa nhà A2',
    lecturer: course?.lecturer || 'Giảng viên',
    type: raw.note?.toLowerCase().includes('thực hành') ? 'Thực hành' : 'Lý thuyết',
    color: COLORS[index % COLORS.length],
    note: raw.note || '',
  };
}

/**
 * Chuẩn hóa bài tập (assignments)
 */
function normalizeAssignment(raw: any): Assignment {
  const course = raw.course;
  const isDone = raw.status === 'done' || raw.status === 'submitted' || raw.status === 'graded';
  const status: AssignmentStatus = isDone ? 'submitted' : 'pending';

  let dueDate = raw.dueDate || '2026-11-09';
  let dueTime = '23:59';
  if (dueDate.includes('T')) {
    const parts = dueDate.split('T');
    dueDate = parts[0];
    dueTime = parts[1].substring(0, 5);
  }

  return {
    ...raw,
    id: String(raw.id),
    courseId: raw.courseId,
    subjectId: String(raw.courseId),
    subjectCode: course?.code || `HP${raw.courseId}`,
    subjectName: course?.name || 'Môn học',
    title: raw.title || 'Bài tập',
    description: raw.description || '',
    dueDate,
    dueTime,
    status,
    priority: raw.priority || 'high',
    maxScore: Number(raw.maxScore) || 10,
    score: raw.score,
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Chuẩn hóa bảng điểm (grades)
 */
function normalizeGrade(raw: any): GradeItem {
  const course = raw.course;
  const fourPointMap: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'B+': 3.5,
    B: 3.0,
    'C+': 2.5,
    C: 2.0,
    'D+': 1.5,
    D: 1.0,
    F: 0.0,
  };

  const letter = raw.letter || 'B+';
  const total = Number(raw.total) || 8.0;

  return {
    ...raw,
    id: String(raw.id),
    courseId: raw.courseId,
    subjectCode: course?.code || `HP${raw.courseId}`,
    subjectName: course?.name || 'Môn học',
    credits: Number(course?.credits) || 3,
    attendance: Number(raw.attendance) || 10,
    midterm: Number(raw.midterm) || 8.0,
    final: Number(raw.final) || 8.0,
    totalScore: total,
    letterGrade: letter,
    fourPointScore: fourPointMap[letter] || 3.0,
    semester: raw.semester || 'HK1 2026-2027',
  };
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [grades, setGrades] = useState<GradeItem[]>(initialGradeRecords);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Lưu trạng thái online trước đó để phát hiện sự kiện vừa có mạng trở lại
  const prevOnlineRef = useRef<boolean>(true);

  /**
   * Cập nhật số lượng thao tác đang chờ đồng bộ
   */
  const updatePendingCount = useCallback(async () => {
    const queue = await StorageService.getSyncQueue();
    setPendingSyncCount(queue.length);
  }, []);

  /**
   * Tải toàn bộ dữ liệu từ bộ nhớ đệm (Cache) AsyncStorage
   */
  const loadFromCache = useCallback(async () => {
    try {
      const [cachedStudent, cachedCourses, cachedSessions, cachedAssignments, cachedGrades] =
        await Promise.all([
          StorageService.getFromCache<Student>(STORAGE_KEYS.STUDENT),
          StorageService.getFromCache<Subject[]>(STORAGE_KEYS.COURSES),
          StorageService.getFromCache<ScheduleItem[]>(STORAGE_KEYS.SESSIONS),
          StorageService.getFromCache<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS),
          StorageService.getFromCache<GradeItem[]>(STORAGE_KEYS.GRADES),
        ]);

      if (cachedStudent) setStudent(cachedStudent);
      if (cachedCourses && cachedCourses.length > 0) setSubjects(cachedCourses);
      if (cachedSessions && cachedSessions.length > 0) setSchedules(cachedSessions);
      if (cachedAssignments && cachedAssignments.length > 0) setAssignments(cachedAssignments);
      if (cachedGrades && cachedGrades.length > 0) setGrades(cachedGrades);

      await updatePendingCount();
    } catch (err) {
      console.warn('Lỗi khi tải dữ liệu từ cache AsyncStorage:', err);
    }
  }, [updatePendingCount]);

  /**
   * Tải lại toàn bộ dữ liệu từ REST API
   * Nếu thành công: Cập nhật state + Lưu vào cache AsyncStorage
   * Nếu thất bại: Chuyển sang trạng thái Offline + Giữ dữ liệu cache
   */
  const refreshData = useCallback(
    async (silent: boolean = false) => {
      if (!silent) setIsLoading(true);

      try {
        console.log('[API] Đang tải dữ liệu từ API...');
        const [rawStudent, rawCourses, rawSessions, rawAssignments, rawGrades] =
          await Promise.all([
            ApiService.getStudent(1),
            ApiService.getCourses(),
            ApiService.getSessions(),
            ApiService.getAssignments(),
            ApiService.getGrades(),
          ]);

        // Chuẩn hóa dữ liệu
        const normalizedStudent = normalizeStudent(rawStudent);
        const normalizedCourses = (rawCourses || []).map((c, i) => normalizeCourse(c, i));
        const normalizedSessions = (rawSessions || []).map((s, i) => normalizeSession(s, i));
        const normalizedAssignments = (rawAssignments || []).map(a => normalizeAssignment(a));
        const normalizedGrades = (rawGrades || []).map(g => normalizeGrade(g));

        // Cập nhật State
        setStudent(normalizedStudent);
        setSubjects(normalizedCourses);
        setSchedules(normalizedSessions);
        setAssignments(normalizedAssignments);
        setGrades(normalizedGrades);
        setIsOnline(true);
        setLastSyncTime(new Date());

        // Lưu vào Cache AsyncStorage
        await Promise.all([
          StorageService.saveToCache(STORAGE_KEYS.STUDENT, normalizedStudent),
          StorageService.saveToCache(STORAGE_KEYS.COURSES, normalizedCourses),
          StorageService.saveToCache(STORAGE_KEYS.SESSIONS, normalizedSessions),
          StorageService.saveToCache(STORAGE_KEYS.ASSIGNMENTS, normalizedAssignments),
          StorageService.saveToCache(STORAGE_KEYS.GRADES, normalizedGrades),
        ]);

        console.log('[API] Tải dữ liệu thành công và đã lưu vào Cache!');
      } catch (err) {
        console.warn('[API] Không thể kết nối tới server REST API, chuyển sang Offline Cache:', err);
        setIsOnline(false);
        // Tải từ Cache nếu API không phản hồi
        await loadFromCache();
      } finally {
        if (!silent) setIsLoading(false);
        await updatePendingCount();
      }
    },
    [loadFromCache, updatePendingCount],
  );

  /**
   * Đồng bộ hàng đợi offline (Offline Sync Queue) lên server
   */
  const syncOfflineQueue = useCallback(async () => {
    const queue = await StorageService.getSyncQueue();
    if (queue.length === 0) {
      setPendingSyncCount(0);
      return;
    }

    try {
      setIsSyncing(true);
      console.log(`[Sync] Bắt đầu đồng bộ ${queue.length} tác vụ offline...`);

      for (const item of queue) {
        try {
          await ApiService.executeSyncQueueItem({
            endpoint: item.endpoint,
            method: item.method,
            body: item.body,
          });
          await StorageService.removeSyncQueueItem(item.id);
        } catch (itemErr) {
          console.warn(`[Sync] Lỗi khi đồng bộ item ${item.id}:`, itemErr);
          // Tiếp tục thử các item khác nếu có
        }
      }

      await updatePendingCount();
      setLastSyncTime(new Date());

      // Sau khi gửi hàng đợi, tải lại dữ liệu mới nhất từ server
      await refreshData(true);
    } catch (err) {
      console.warn('[Sync] Quá trình đồng bộ gặp lỗi:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [refreshData, updatePendingCount]);

  /**
   * Khởi động ứng dụng:
   * 1. Lắng nghe trạng thái mạng qua NetInfo
   * 2. Tải cache ngay lập tức để người dùng không bị chờ màn hình trống
   * 3. Gọi API để lấy dữ liệu mới nhất
   */
  useEffect(() => {
    let isMounted = true;

    // 1. Tải cache trước
    loadFromCache().then(() => {
      if (isMounted) {
        // 2. Thử gọi API sau khi cache đã nạp
        refreshData();
      }
    });

    // 3. Lắng nghe thay đổi kết nối mạng
    const unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);

      // Nếu vừa mới có mạng trở lại (từ Offline -> Online), tự động đồng bộ hàng đợi
      if (!prevOnlineRef.current && online) {
        console.log('[Network] Kết nối mạng đã phục hồi! Tự động đồng bộ hàng đợi...');
        syncOfflineQueue();
      }

      prevOnlineRef.current = online;
    });

    return () => {
      isMounted = false;
      unsubscribeNetInfo();
    };
  }, [loadFromCache, refreshData, syncOfflineQueue]);

  /**
   * Chỉnh sửa thông tin cá nhân (PATCH /students/1)
   */
  const updateStudentProfile = async (
    updates: Partial<Pick<Student, 'name' | 'fullName' | 'email' | 'phone' | 'studentClass' | 'className' | 'major'>>,
  ) => {
    const updatedName: string = updates.fullName || updates.name || student.name || 'Nguyễn Văn Đông';
    const updatedClass: string = updates.className || updates.studentClass || student.studentClass || 'CNTT-K21A';

    const newStudent: Student = {
      ...student,
      ...updates,
      name: updatedName,
      fullName: updatedName,
      studentClass: updatedClass,
      className: updatedClass,
      updatedAt: new Date().toISOString(),
    };

    // 1. Optimistic update: Cập nhật giao diện & lưu vào cache ngay lập tức
    setStudent(newStudent);
    await StorageService.saveToCache(STORAGE_KEYS.STUDENT, newStudent);

    // 2. Nếu có mạng thì gọi API, nếu không có mạng thì đưa vào hàng đợi đồng bộ
    if (isOnline) {
      try {
        await ApiService.updateStudent(1, {
          fullName: updatedName,
          className: updatedClass,
          email: updates.email || student.email,
          phone: updates.phone || student.phone,
          major: updates.major || student.major,
        });
        console.log('[API] PATCH /students/1 thành công!');
      } catch (err) {
        console.warn('[API] PATCH /students/1 thất bại, thêm vào hàng đợi đồng bộ:', err);
        await StorageService.addToSyncQueue({
          type: 'UPDATE_STUDENT',
          endpoint: '/students/1',
          method: 'PATCH',
          body: {
            fullName: updatedName,
            className: updatedClass,
            email: updates.email || student.email,
            phone: updates.phone || student.phone,
            major: updates.major || student.major,
            updatedAt: new Date().toISOString(),
          },
        });
        await updatePendingCount();
      }
    } else {
      console.log('[Offline] Đang offline, lưu PATCH /students/1 vào hàng đợi đồng bộ');
      await StorageService.addToSyncQueue({
        type: 'UPDATE_STUDENT',
        endpoint: '/students/1',
        method: 'PATCH',
        body: {
          fullName: updatedName,
          className: updatedClass,
          email: updates.email || student.email,
          phone: updates.phone || student.phone,
          major: updates.major || student.major,
          updatedAt: new Date().toISOString(),
        },
      });
      await updatePendingCount();
    }
  };

  /**
   * Thay đổi trạng thái bài tập (PATCH /assignments/:id)
   */
  const toggleAssignmentStatus = async (assignmentId: string | number) => {
    const target = assignments.find(a => String(a.id) === String(assignmentId));
    if (!target) return;

    // Xác định trạng thái mới: từ todo/pending -> done/submitted và ngược lại
    const willBeDone = target.status === 'pending' || target.status === 'todo';
    const newStatus: AssignmentStatus = willBeDone ? 'submitted' : 'pending';
    const apiStatus = willBeDone ? 'done' : 'todo';

    // 1. Optimistic update
    const updatedAssignments = assignments.map(a => {
      if (String(a.id) === String(assignmentId)) {
        return {
          ...a,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setAssignments(updatedAssignments);
    await StorageService.saveToCache(STORAGE_KEYS.ASSIGNMENTS, updatedAssignments);

    // 2. Gửi API hoặc xếp hàng đợi
    if (isOnline) {
      try {
        await ApiService.updateAssignmentStatus(assignmentId, apiStatus);
        console.log(`[API] PATCH /assignments/${assignmentId} thành công (${apiStatus})!`);
      } catch (err) {
        console.warn(`[API] PATCH /assignments/${assignmentId} thất bại, thêm vào queue:`, err);
        await StorageService.addToSyncQueue({
          type: 'UPDATE_ASSIGNMENT',
          endpoint: `/assignments/${assignmentId}`,
          method: 'PATCH',
          body: {
            status: apiStatus,
            updatedAt: new Date().toISOString(),
          },
        });
        await updatePendingCount();
      }
    } else {
      console.log(`[Offline] Đang offline, lưu PATCH /assignments/${assignmentId} vào queue`);
      await StorageService.addToSyncQueue({
        type: 'UPDATE_ASSIGNMENT',
        endpoint: `/assignments/${assignmentId}`,
        method: 'PATCH',
        body: {
          status: apiStatus,
          updatedAt: new Date().toISOString(),
        },
      });
      await updatePendingCount();
    }
  };

  /**
   * Thêm bài tập mới (POST /assignments) - Chức năng mới trong TH4
   */
  const createAssignment = async (data: {
    title: string;
    courseId: number | string;
    description: string;
    dueDate: string;
  }) => {
    const course = subjects.find(s => String(s.id) === String(data.courseId));
    const nowIso = new Date().toISOString();

    const newAssignmentPayload = {
      courseId: Number(data.courseId) || 1,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: 'todo' as const,
      updatedAt: nowIso,
    };

    if (isOnline) {
      try {
        const created = await ApiService.createAssignment(newAssignmentPayload);
        const normalized = normalizeAssignment({
          ...created,
          course: course || { code: 'HP1', name: 'Môn học' },
        });

        const updatedList = [normalized, ...assignments];
        setAssignments(updatedList);
        await StorageService.saveToCache(STORAGE_KEYS.ASSIGNMENTS, updatedList);
        console.log('[API] POST /assignments thành công!', created);
      } catch (err) {
        console.warn('[API] POST /assignments thất bại, chuyển sang lưu offline:', err);
        // Fallback sang offline
        const tempId = `temp_${Date.now()}`;
        const localAssignment = normalizeAssignment({
          ...newAssignmentPayload,
          id: tempId,
          course: course || { code: 'HP1', name: 'Môn học' },
        });
        const updatedList = [localAssignment, ...assignments];
        setAssignments(updatedList);
        await StorageService.saveToCache(STORAGE_KEYS.ASSIGNMENTS, updatedList);

        await StorageService.addToSyncQueue({
          type: 'CREATE_ASSIGNMENT',
          endpoint: '/assignments',
          method: 'POST',
          body: newAssignmentPayload,
        });
        await updatePendingCount();
      }
    } else {
      // Offline mode
      console.log('[Offline] Đang offline, tạo bài tập cục bộ và thêm vào hàng đợi');
      const tempId = `temp_${Date.now()}`;
      const localAssignment = normalizeAssignment({
        ...newAssignmentPayload,
        id: tempId,
        course: course || { code: 'HP1', name: 'Môn học' },
      });
      const updatedList = [localAssignment, ...assignments];
      setAssignments(updatedList);
      await StorageService.saveToCache(STORAGE_KEYS.ASSIGNMENTS, updatedList);

      await StorageService.addToSyncQueue({
        type: 'CREATE_ASSIGNMENT',
        endpoint: '/assignments',
        method: 'POST',
        body: newAssignmentPayload,
      });
      await updatePendingCount();
    }
  };

  /**
   * Đặt lại toàn bộ dữ liệu mẫu mặc định
   */
  const resetToDefaults = async () => {
    try {
      await Promise.all([
        StorageService.removeFromCache(STORAGE_KEYS.STUDENT),
        StorageService.removeFromCache(STORAGE_KEYS.COURSES),
        StorageService.removeFromCache(STORAGE_KEYS.SESSIONS),
        StorageService.removeFromCache(STORAGE_KEYS.ASSIGNMENTS),
        StorageService.removeFromCache(STORAGE_KEYS.GRADES),
        StorageService.clearSyncQueue(),
      ]);

      setStudent(initialStudent);
      setSubjects(initialSubjects);
      setSchedules(initialSchedules);
      setAssignments(initialAssignments);
      setGrades(initialGradeRecords);
      setPendingSyncCount(0);

      // Thử tải lại từ server
      await refreshData();
    } catch (err) {
      console.warn('Lỗi khi khôi phục mặc định:', err);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        subjects,
        schedules,
        assignments,
        grades,
        isLoading,
        isOnline,
        isSyncing,
        pendingSyncCount,
        lastSyncTime,
        refreshData,
        updateStudentProfile,
        toggleAssignmentStatus,
        createAssignment,
        syncOfflineQueue,
        resetToDefaults,
      }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};