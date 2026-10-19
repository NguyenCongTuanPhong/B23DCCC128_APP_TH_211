import { NavigatorScreenParams } from '@react-navigation/native';
import { ScheduleItem, Subject } from '../types';

export type BottomTabParamList = {
  HomeTab: undefined;
  SubjectsTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  SubjectDetail: { subject: Subject };
  ScheduleDetail: { schedule: ScheduleItem };
  AssignmentDetail: { assignmentId: string };
  AcademicDetail: undefined;
};
