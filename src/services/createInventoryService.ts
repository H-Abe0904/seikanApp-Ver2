import { axiosInstance } from './authservices';

//	表示させたい部品表テーブルのカラム
export type Part = {
	partsNo: string;
	partsName: string;
	isUsing: boolean;
}

//	在庫管理表テーブルに入力・追加するカラムの詳細
export type InventoryData = {
	access_token: string;
	partsName: string;
	partsNo: string;
	register_Name: string;
	updater_Name: string;
	date: Date;
	accepted_Total: number;
	payOut_Total: number;
	carryOver_Stock: number;
	accepted: number;
	payout: number;
	logical_Stock: number;
	actual_Stock: number;
	difference: number;
	memo: string;
	registered_Date: Date;
	updated_Date: Date;
}

//	APIでデータベースから部品表データを取り出す
export const fetchParts = async (): Promise<Part[]> => {
	const response = await axiosInstance.get("/inventory/parts");
	return response.data;
}

//	データ登録(DBにデータ追加)
export const pushData = async (partsName: string, partsNo: string, accepted: number, payout: number, registered_Date: string, memo: string): Promise<InventoryData> => {
	const response = await axiosInstance.post<InventoryData>('/inventory/create', { partsName, partsNo, accepted, payout, registered_Date, memo })
	return response.data;
}

//	サービス定義
export const partsService = {
	fetchParts, pushData
};