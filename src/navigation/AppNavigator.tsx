import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AcademicDetailScreen } from '../screens/profile/AcademicDetailScreen';
import { AssignmentDetailScreen } from '../screens/assignments/AssignmentDetailScreen';
import { ScheduleDetailScreen } from '../screens/schedule/ScheduleDetailScreen';
import { SubjectDetailScreen } from '../screens/subjects/SubjectDetailScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
      <Stack.Screen name="AcademicDetail" component={AcademicDetailScreen} />
    </Stack.Navigator>
  );
};
