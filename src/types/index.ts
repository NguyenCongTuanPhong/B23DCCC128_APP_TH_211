export interface Student {
  id: string | number; // ID sinh viên trong DB
  studentCode?: string; // Mã số sinh viên (VD: B23DCCC128 / SV2021001)
  fullName?: string; // Họ và tên
  className?: string; // Lớp hành chính
  major: string; // Ngành học
  email: string; // Email
  phone: string; // Số điện thoại
  updatedAt?: string;

  // Thuộc tính tương thích giao diện
  name: string; // Họ và tên
  studentClass: string; // Lớp
  faculty: string; // Khoa
  academicYear: string; // Niên khóa
  gpa10: number; // Điểm hệ 10
  gpa4: number; // Điểm hệ 4
  cpa4: number; // Điểm CPA hệ 4
  creditsEarned: number; // Số tín chỉ đã tích lũy
  totalCredits: number; // Tổng số tín chỉ chương trình
  academicStatus: string; // Xếp loại học lực
  trainingScore: number; // Điểm rèn luyện
  trainingStatus: string; // Xếp loại rèn luyện
}

export interface Course {
  id: string | number;
  code: string; // Mã môn học
  name: string; // Tên môn học
  credits: number; // Số tín chỉ
  lecturer: string; // Giảng viên
  description: string; // Mô tả môn học
  semester: string; // Học kỳ (VD: HK1 2026-2027)

  // Thuộc tính tương thích giao diện
  email?: string;
  room?: string;
  scheduleDay?: string;
  scheduleTime?: string;
  color?: string;
  status?: 'active' | 'completed';
}

export type Subject = Course;

export interface SessionItem {
  id: string | number;
  courseId?: string | number;
  dayOfWeek: number; // 2 = Thứ Hai, 3 = Thứ Ba, ..., 7 = Thứ Bảy, 8 = Chủ Nhật
  startTime: string; // "07:00"
  endTime: string; // "09:30"
  room: string; // "P.301-A2"
  note?: string; // "Mang laptop"
  course?: Course; // Mở rộng từ _expand=course

  // Thuộc tính tương thích giao diện
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  dayName?: string; // 'Thứ Hai', 'Thứ Ba'...
  building?: string;
  lecturer?: string;
  type?: 'Lý thuyết' | 'Thực hành' | 'Thảo luận' | string;
  color?: string;
}

export type ScheduleItem = SessionItem;

export type AssignmentStatus = 'todo' | 'done' | 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string | number;
  courseId?: string | number;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD hoặc ISO 8601
  status: AssignmentStatus;
  updatedAt?: string;
  course?: Course; // Mở rộng từ _expand=course

  // Thuộc tính tương thích giao diện
  dueTime?: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  priority?: 'high' | 'medium' | 'low';
  maxScore?: number;
  score?: number;
  feedback?: string;
}

export interface GradeItem {
  id: string | number;
  courseId?: string | number;
  semester: string;
  attendance: number; // Chuyên cần
  midterm: number; // Giữa kỳ
  final: number; // Cuối kỳ
  total?: number; // Tổng kết
  letter?: string; // Điểm chữ: A, B+, B, C+...
  course?: Course; // Mở rộng từ _expand=course

  // Thuộc tính tương thích giao diện
  subjectCode: string;
  subjectName: string;
  credits: number;
  totalScore: number;
  letterGrade: string;
  fourPointScore: number;
}

export interface SyncQueueItem {
  id: string; // UUID hoặc timestamp ngẫu nhiên
  type: 'UPDATE_STUDENT' | 'UPDATE_ASSIGNMENT' | 'CREATE_ASSIGNMENT';
  endpoint: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body: any;
  createdAt: string;
}