import { BASE_URL, API_TIMEOUT } from '../config';
import { Assignment, Course, GradeItem, SessionItem, Student } from '../types';

/**
 * Hàm gọi API chung với cơ chế Timeout
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout sau ${API_TIMEOUT}ms`);
    }
    throw error;
  }
}

/**
 * Tầng API Services (Tách biệt hoàn toàn khỏi giao diện)
 */
export const ApiService = {
  /**
   * GET /students/1 - Lấy thông tin sinh viên
   */
  async getStudent(id: number | string = 1): Promise<Student> {
    return request<Student>(`/students/${id}`);
  },

  /**
   * PATCH /students/1 - Chỉnh sửa thông tin sinh viên
   */
  async updateStudent(id: number | string = 1, data: Partial<Student>): Promise<Student> {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return request<Student>(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * GET /courses - Lấy danh sách toàn bộ môn học
   */
  async getCourses(): Promise<Course[]> {
    return request<Course[]>('/courses');
  },

  /**
   * GET /courses/:id - Lấy thông tin chi tiết một môn học
   */
  async getCourseById(id: number | string): Promise<Course> {
    return request<Course>(`/courses/${id}`);
  },

  /**
   * GET /sessions?_expand=course - Lấy thời khóa biểu kèm thông tin môn học
   */
  async getSessions(): Promise<SessionItem[]> {
    return request<SessionItem[]>('/sessions?_expand=course');
  },

  /**
   * GET /assignments?_expand=course&_sort=dueDate - Lấy danh sách bài tập sắp xếp theo hạn nộp
   */
  async getAssignments(): Promise<Assignment[]> {
    return request<Assignment[]>('/assignments?_expand=course&_sort=dueDate');
  },

  /**
   * PATCH /assignments/:id - Cập nhật trạng thái bài tập (todo / done)
   */
  async updateAssignmentStatus(
    id: number | string,
    status: 'todo' | 'done',
  ): Promise<Assignment> {
    const payload = {
      status,
      updatedAt: new Date().toISOString(),
    };
    return request<Assignment>(`/assignments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /assignments - Thêm mới một bài tập
   */
  async createAssignment(
    assignmentData: Omit<Assignment, 'id'>,
  ): Promise<Assignment> {
    const payload = {
      ...assignmentData,
      updatedAt: new Date().toISOString(),
    };
    return request<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * GET /grades?_expand=course - Lấy danh sách kết quả học tập kèm môn học
   */
  async getGrades(): Promise<GradeItem[]> {
    return request<GradeItem[]>('/grades?_expand=course');
  },

  /**
   * Hàm gọi động cho hàng đợi đồng bộ Offline (Offline Sync Queue)
   */
  async executeSyncQueueItem(item: {
    endpoint: string;
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: any;
  }): Promise<any> {
    return request(item.endpoint, {
      method: item.method,
      body: item.body ? JSON.stringify(item.body) : undefined,
    });
  },
};