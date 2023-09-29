import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../screens/Home/home';
import { FG_AlarmMenu } from '../screens/FG/FGList';
import { PartsInventory } from '../screens/FG/PartsInventory/partsInventory';
import { PayOut } from '../screens/FG/PartsInventory/payOut';
const Stack = createStackNavigator();

/**
 * ここに401エラーが返ってきたら、
 * ログイン画面にリダイレクトする処理を入れる
 *
 */

/**
 * 画面遷移のナビゲーション
 * @returns 画面遷移先のスクリーン
 */
export const AppStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home Screen" component={Home} />
			<Stack.Screen name="FG_AlarmMenu" component={FG_AlarmMenu} />
			<Stack.Screen name="PartsInventory" component={PartsInventory} />
			<Stack.Screen name="PayOut" component={PayOut} />
		</Stack.Navigator>
	);
};