export interface Student {
  id: string; // Mã sinh viên
  name: string; // Họ và tên
  studentClass: string; // Lớp
  major: string; // Ngành học
  faculty: string; // Khoa
  email: string;
  phone: string;
  academicYear: string; // Niên khóa (vd: 2021 - 2025)
  gpa10: number; // Điểm TB tích lũy hệ 10
  gpa4: number; // Điểm TB tích lũy hệ 4
  cpa4: number; // Điểm CPA hệ 4
  creditsEarned: number; // Tín chỉ đã tích lũy
  totalCredits: number; // Tổng số tín chỉ chương trình
  academicStatus: string; // Xếp loại học lực
  trainingScore: number; // Điểm rèn luyện
  trainingStatus: string; // Xếp loại rèn luyện
}

export interface Subject {
  id: string;
  code: string; // Mã môn học
  name: string; // Tên môn học
  credits: number; // Số tín chỉ
  lecturer: string; // Giảng viên
  email: string; // Email giảng viên
  room: string; // Phòng học chính
  scheduleDay: string; // Ngày học trong tuần
  scheduleTime: string; // Khung giờ
  description: string; // Mô tả môn học
  semester: string; // Học kỳ (vd: 2024.1)
  color: string; // Màu nhận diện thẻ
  status: 'active' | 'completed';
}

export interface ScheduleItem {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  dayOfWeek: number; // 2 = Thứ Hai, 3 = Thứ Ba, ..., 7 = Thứ Bảy, 8 = Chủ Nhật
  dayName: string; // 'Thứ Hai', 'Thứ Ba'...
  startTime: string; // '06:45'
  endTime: string; // '09:15'
  room: string; // 'D9-301'
  building: string; // 'Nhà D9'
  lecturer: string;
  type: 'Lý thuyết' | 'Thực hành' | 'Thảo luận';
  color: string;
  note?: string;
}

export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  status: AssignmentStatus; // 'pending': Cần nộp | 'submitted': Đã nộp | 'graded': Đã chấm
  description: string;
  priority: 'high' | 'medium' | 'low';
  maxScore: number;
  score?: number; // Điểm đã chấm (vd: 9.5)
  feedback?: string; // Nhận xét của giáo viên
}

export interface GradeItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  attendance: number; // Điểm chuyên cần (10%)
  midterm: number; // Điểm giữa kỳ (30%)
  final: number; // Điểm cuối kỳ (60%)
  totalScore: number; // Điểm tổng kết hệ 10
  letterGrade: string; // A, B+, B, C+...
  fourPointScore: number; // Thang 4
  semester: string;
}
