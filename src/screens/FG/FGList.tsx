import React from "react";
import { Button, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from "../styles"
import { useAuth } from "../../hooks/useAuth";
import { ThemeProvider } from "styled-components";
import theme from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";

/**
 * FG 警報器の入出庫画面の遷移
 * @returns 入庫/出庫の登録画面
 */
export const FG_AlarmMenu = () => {
	const navigation = useNavigation();
	const navigateToOther = () => {
		navigation.navigate('PartsInventory' as never)
	}
	const anotherNavigation = () => {
		navigation.navigate('PayOut' as never)
	}
	return (
		<ThemeProvider theme={theme}>
			<View style={styles.container}>
				<Text style={styles.title}>入出庫登録</Text>
				<View style={[styles.buttonContainer, { justifyContent: "space-around" }]}>
					<Button
						title="入庫/出庫/仕損登録"
						onPress={navigateToOther}
						color={theme.colors.purple}
					/>
				</View>
				<View style={[styles.buttonContainer, { justifyContent: "space-around" }]}>
					<Button
						title="出庫登録"
						onPress={anotherNavigation}
						color={theme.colors.purple}
					/>
				</View>
			</View>
		</ThemeProvider>
	);
}