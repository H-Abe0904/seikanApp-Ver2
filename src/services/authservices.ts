import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type AuthData = {
	access_token: string;
	id: string;
	name: string;
	password: string;
}
export type SignUpData = {
	id: string;
	name: string;
	password: string;
}
//	基本URLの設定
export const axiosInstance: AxiosInstance = axios.create({
	baseURL: 'http://192.168.10.6:3000',
});

//	ログイン処理
export const signIn = async (id: string, password: string): Promise<AuthData> => {
	try {
		const response: AxiosResponse<AuthData> = await axiosInstance.post<AuthData>('/auth/signin', { id, password });
		const token = response.data.access_token;
		console.log(token);
		console.log(id, password);
		return response.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

//	ユーザー登録
export const signUp = async (id: string, name: string, password: string): Promise<SignUpData> => {
	const response = await axiosInstance.post<SignUpData>('/auth/signup', { id, name, password });
	return response.data
}

export const authService = {
	signIn, signUp
};

//	トークンを保存しておくためのヘッダ定義
export const JWTToken = (token: string | undefined): void => {
	axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}