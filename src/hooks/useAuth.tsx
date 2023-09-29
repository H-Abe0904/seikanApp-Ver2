import React, { useEffect, createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData, authService } from '../services/authservices';

type props = {
	children?: React.ReactNode;
};

//	認証に必要なデータ型の定義
export type AuthContextData = {
	authData?: AuthData;
	loading: boolean;
	signIn(id: string, password: string): Promise<AuthData>;
	signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<props> = ({ children }) => {
	const [authData, setAuthData] = useState<AuthData>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStorageData();
	}, []);

	//	localStorageに保存されている認証情報の読み出し処理
	async function loadStorageData(): Promise<void> {
		try {
			const authDataSerialized = await AsyncStorage.getItem('@AuthData');
			if (authDataSerialized) {
				const newAuthData: AuthData = JSON.parse(authDataSerialized);
				setAuthData(newAuthData);
				console.log("debug: " + authDataSerialized)
			}
		} catch (err) {
			console.log("err: " + err)
		} finally {
			setLoading(false);
		}
	}

	//	ログイン処理
	const signIn = async (id: string, password: string): Promise<AuthData> => {
		try {
			const token = (await authService.signIn(id, password)).access_token;
			if (typeof token === 'string') {
				const newAuthData: AuthData = {
					id: id,
					password: password,
					access_token: token,
					name: ''
				};
				// newAuthDataを使用する処理
				setAuthData(newAuthData);
				AsyncStorage.setItem('@AuthData', JSON.stringify(newAuthData)); // トークンをデバイス内に格納
				console.log(newAuthData.access_token);
				return newAuthData;
			} else {
				console.log(id, password, token);	//	デバッグ用
				throw new Error("useAuth.tsx: トークンエラー");
			}
		} catch (error) {
			console.log(error);
			return Promise.reject(error)
			throw error;

		}
	};

	//	ログアウト処理
	const signOut = async () => {
		setAuthData(undefined);

		await AsyncStorage.removeItem('@AuthData');
	};

	return (
		<AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context;
}
export { AuthContext, AuthProvider, useAuth }