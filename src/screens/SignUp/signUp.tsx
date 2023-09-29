import React, { useState } from "react";
import { styles } from '../styles';
import { ActivityIndicator, Alert, Button, TextInput, View, Text } from 'react-native';
import { axiosInstance } from "../../services/authservices";
import theme from "../../styles/theme";
import { ThemeProvider } from "styled-components/native";



export const SignUp = () => {
	const [loading, setLoading] = useState(false);
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	async function signUp() {
		const sendData = {
			id: id,
			name: name,
			password: password,
		}

		if (!sendData.id || !sendData.name || !sendData.password) {
			Alert.alert("全てのフィールドを入力してください。");
			return;
		}

		try {
			setLoading(true);

			const isDuplicate = await ChkDuplicate(sendData.id);

			if (isDuplicate) {
				Alert.alert("既に登録されているIDです。");
				return;
			}

			await axiosInstance.post('/auth/signup', sendData);
			Alert.alert("登録しました");
		} catch (err: any) {
			Alert.alert("エラー", err.message);
		} finally {
			setLoading(false);
		}
	}

	async function ChkDuplicate(id: string): Promise<boolean> {
		try {
			const response = await axiosInstance.get(`/auth/dpxCheck?id=${id}`);
			return response.data.isDuplicate;
		} catch (err) {
			console.error("重複チェックエラー:", err);
			return false;
		}
	}

	return (
		<ThemeProvider theme={theme}>
			<View style={styles.container}>
				<Text style={styles.title}>登録</Text>
				<TextInput
					style={[styles.inputField, { color: theme.colors.black }]}
					placeholder="社員番号"
					multiline={false}
					value={id}
					onChangeText={(text) => setId(text)}
					editable={true}
					keyboardType="numeric"
					placeholderTextColor={theme.colors.gray}
				/>
				<TextInput
					style={[styles.inputField, { color: theme.colors.black }]}
					placeholder="名前(フルネーム)"
					secureTextEntry={false}
					multiline={false}
					keyboardType="email-address"
					value={name}
					onChangeText={(text: string) => setName(text)}
					editable={true}
					placeholderTextColor={theme.colors.gray}
				/>
				<TextInput
					style={[styles.inputField, { color: theme.colors.black }]}
					placeholder="パスワード"
					secureTextEntry={true}
					multiline={false}
					keyboardType="default"
					value={password}
					onChangeText={(text: string) => setPassword(text)}
					editable={true}
					placeholderTextColor={theme.colors.gray}
				/>
				{loading ? (
					<ActivityIndicator color={theme.colors.purple} animating={true} size="small" />
				) : (
					<Button
						title="ユーザー登録"
						onPress={signUp}
						color={theme.colors.purple}
					/>
				)}
			</View>
		</ThemeProvider >
	)
}
