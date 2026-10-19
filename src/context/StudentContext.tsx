import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialAssignments,
  initialGradeRecords,
  initialSchedules,
  initialStudent,
  initialSubjects,
} from '../data/mockData';
import { Assignment, GradeItem, ScheduleItem, Student, Subject } from '../types';

const STORAGE_KEY_STUDENT = '@app_student_profile_v2';
const STORAGE_KEY_ASSIGNMENTS = '@app_student_assignments_v2';

interface StudentContextType {
  student: Student;
  subjects: Subject[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  grades: GradeItem[];
  isLoading: boolean;
  updateStudentProfile: (updates: Partial<Pick<Student, 'name' | 'email' | 'phone' | 'studentClass' | 'major'>>) => Promise<void>;
  toggleAssignmentStatus: (assignmentId: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [schedules] = useState<ScheduleItem[]>(initialSchedules);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [grades] = useState<GradeItem[]>(initialGradeRecords);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-sync: immediately replace any cached "Nguyễn Văn An" with "Nguyễn Văn Đông"
  useEffect(() => {
    if (student.name.includes('An') || student.name !== 'Nguyễn Văn Đông') {
      const updated = {
        ...student,
        name: 'Nguyễn Văn Đông',
        email: 'dong.nv211234@sis.edu.vn',
      };
      setStudent(updated);
      AsyncStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(updated)).catch(() => {});
    }
  }, [student.name]);

  // Load persisted data on startup
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        await AsyncStorage.removeItem('@app_student_profile_v1').catch(() => {});
        const storedStudentStr = await AsyncStorage.getItem(STORAGE_KEY_STUDENT);
        if (storedStudentStr) {
          const parsedStudent = JSON.parse(storedStudentStr);
          if (parsedStudent.name && parsedStudent.name.includes('An')) {
            parsedStudent.name = initialStudent.name;
            parsedStudent.email = initialStudent.email;
          }
          setStudent(prev => ({ ...prev, ...parsedStudent }));
        } else {
          setStudent(initialStudent);
        }

        const storedAssignmentsStr = await AsyncStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
        if (storedAssignmentsStr) {
          const parsedAssignments = JSON.parse(storedAssignmentsStr);
          setAssignments(parsedAssignments);
        }
      } catch (err) {
        console.warn('Error loading data from AsyncStorage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Update student profile
  const updateStudentProfile = async (
    updates: Partial<Pick<Student, 'name' | 'email' | 'phone' | 'studentClass' | 'major'>>,
  ) => {
    try {
      const updatedStudent = { ...student, ...updates };
      setStudent(updatedStudent);
      await AsyncStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(updatedStudent));
    } catch (err) {
      console.warn('Error saving student profile to AsyncStorage:', err);
    }
  };

  // Toggle assignment completion status
  const toggleAssignmentStatus = async (assignmentId: string) => {
    try {
      const updated = assignments.map(a => {
        if (a.id === assignmentId) {
          const newStatus: 'pending' | 'submitted' | 'graded' =
            a.status === 'pending' ? 'submitted' : 'pending';
          return { ...a, status: newStatus };
        }
        return a;
      });

      setAssignments(updated);
      await AsyncStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving assignments to AsyncStorage:', err);
    }
  };

  // Reset to default mock data if desired
  const resetToDefaults = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('@app_student_profile_v1'),
        AsyncStorage.removeItem(STORAGE_KEY_STUDENT),
        AsyncStorage.removeItem('@app_student_assignments_v1'),
        AsyncStorage.removeItem(STORAGE_KEY_ASSIGNMENTS),
      ]);
      setStudent(initialStudent);
      setAssignments(initialAssignments);
    } catch (err) {
      console.warn('Error resetting data:', err);
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
        updateStudentProfile,
        toggleAssignmentStatus,
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
