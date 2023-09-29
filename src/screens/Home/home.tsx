import React from "react";
import { Button, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from "../styles"
import { useAuth } from "../../hooks/useAuth";
import { ThemeProvider } from "styled-components/native";
import theme from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { FG_AlarmMenu } from "../FG/FGList";


export const Home = () => {
	const auth = useAuth();
	const signOut = () => {
		auth.signOut();
	};

	const navigation = useNavigation();
	const navigateToOther = () => {
		navigation.navigate('FG_AlarmMenu' as never);
	}

	return (
		<ThemeProvider theme={theme}>
			<View style={styles.container}>
				<Text style={styles.title}>メニュー</Text>
				<View style={[styles.buttonContainer, { justifyContent: "space-around" }]}>
					<Button title="FG警報器"
						onPress={navigateToOther}
						color={theme.colors.purple}
					/>
				</View>
				<View style={[styles.buttonContainer, { justifyContent: "center" }]}>
					<Button title="ログアウト"
						onPress={signOut}
						color={theme.colors.purple} />
				</View>
			</View>
		</ThemeProvider>
	);
}
