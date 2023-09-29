import React, { useState } from "react";
import { styles } from '../styles';
import { ActivityIndicator, Alert, Button, Text, TextInput, View } from 'react-native';
import { JWTToken } from "../../services/authservices";
import { useAuth } from "../../hooks/useAuth";
import { ThemeProvider } from "styled-components/native";
import theme from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";

export const SignIn = () => {
	const [loading, setLoading] = useState(false);
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const auth = useAuth();

	async function handleSignIn() {
		try {
			setLoading(true);
			const token = await auth.signIn(id, password);
			if (token) {
				JWTToken(auth.authData?.access_token);
				console.log(token);
				Alert.alert("ログイン成功")
			} else {
				throw new Error("トークンエラー");
			}
		} catch (err: any) {
			Alert.alert("ログインエラー");
			console.log(err);
		} finally {
			setLoading(false);
		}
	}

	const navigation = useNavigation();
	const navigateToOther = () => {
		navigation.navigate('SignUp' as never)
	}

	return (
		<ThemeProvider theme={theme}>
			<View style={styles.container}>
				<Text style={styles.title}>ログイン</Text>
				<TextInput
					style={[styles.inputField, { color: theme.colors.black }]}
					placeholder="社員番号"
					multiline={false}
					value={id}
					onChangeText={(text) => setId(text)}
					editable={true}
					keyboardType="numeric"
					placeholderTextColor={theme.colors.gray} // Add this line to change placeholder color
				/>

				<TextInput
					style={[styles.inputField, { color: theme.colors.black }]}
					placeholder="パスワード"
					secureTextEntry
					multiline={false}
					keyboardType="default"
					value={password}
					onChangeText={(text) => setPassword(text)}
					editable={true}
					placeholderTextColor={theme.colors.gray} // Add this line to change placeholder color
				/>
				<View style={[styles.buttonContainer]}>
					{loading ? (
						<ActivityIndicator color={theme.colors.purple} animating={true} size="small" />
					) : (
						<Button
							title="ログイン"
							onPress={handleSignIn}
							color={theme.colors.purple}
						/>
					)}
				</View>
				<View style={[styles.buttonContainer, { justifyContent: "center" }]}>
					<Button
						title="新規登録"
						onPress={navigateToOther}
						color={theme.colors.purple}
					/>
				</View>
			</View>

		</ThemeProvider>
	);
};
