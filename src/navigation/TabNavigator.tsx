import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../components/Icon';
import { useStudent } from '../context/StudentContext';
import { AssignmentsScreen } from '../screens/assignments/AssignmentsScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ScheduleScreen } from '../screens/schedule/ScheduleScreen';
import { SubjectsScreen } from '../screens/subjects/SubjectsScreen';
import { Colors } from '../theme/colors';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const renderHomeIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Icon name="home" size={20} color={color} />
  </View>
);

const renderSubjectsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Icon name="book" size={20} color={color} />
  </View>
);

const renderScheduleIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Icon name="calendar" size={20} color={color} />
  </View>
);

const renderAssignmentsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Icon name="clipboard" size={20} color={color} />
  </View>
);

const renderProfileIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
    <Icon name="user" size={20} color={color} />
  </View>
);

export const TabNavigator: React.FC = () => {
  const { assignments } = useStudent();
  const pendingCount = assignments.filter(a => a.status === 'pending').length;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: renderHomeIcon,
        }}
      />

      <Tab.Screen
        name="SubjectsTab"
        component={SubjectsScreen}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: renderSubjectsIcon,
        }}
      />

      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: renderScheduleIcon,
        }}
      />

      <Tab.Screen
        name="AssignmentsTab"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: renderAssignmentsIcon,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  iconWrapper: {
    width: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryLight,
  },
  badgeStyle: {
    backgroundColor: Colors.danger,
    fontSize: 10,
    fontWeight: '800',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    lineHeight: 14,
  },
});
