/**
 * @format
 */

import 'react-native';
import React from 'react';
import {it, expect} from '@jest/globals';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.BackHandler = {addEventListener: jest.fn(), removeEventListener: jest.fn()};
  return RN;
});

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}) => children,
  useNavigation: () => ({navigate: jest.fn(), goBack: jest.fn()}),
  useRoute: () => ({name: 'Home', params: {}}),
}));

jest.mock('@react-navigation/native-stack', () => {
  const {View} = require('react-native');
  return {createNativeStackNavigator: () => ({Navigator: ({children}) => children, Screen: ({children}) => <View>{children}</View>})};
});

jest.mock('react-native-paper', () => {
  const {View, Text, TouchableOpacity} = require('react-native');
  return {
    Provider: ({children}) => children,
    Button: ({children, onPress}) => <TouchableOpacity onPress={onPress}><Text>{children}</Text></TouchableOpacity>,
    Portal: ({children}) => children,
    DefaultTheme: {},
    useTheme: () => ({}),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

import renderer from 'react-test-renderer';
import App from '../src/App';

it('renders without crashing', () => {
  expect(() => renderer.create(<App />)).not.toThrow();
});
