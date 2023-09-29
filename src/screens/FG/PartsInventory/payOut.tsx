import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Alert } from "react-native";
import {
	Camera,
	CameraPermissionStatus,
	useCameraDevices,
	useFrameProcessor,
} from 'react-native-vision-camera';
import { useAuth } from "../../../hooks/useAuth";
import { BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner';
import { JWTToken, axiosInstance } from "../../../services/authservices";
import { runOnJS } from "react-native-reanimated";

/**
 * 出庫用スクリーン
 * @returns カメラ
 */
export const PayOut = () => {
	const [loading, setLoading] = useState(false);
	const [inCount, setInCount] = useState("");		//	入庫数の入力用
	const [outCount, setOutCount] = useState("");	//	出庫数の入力用
	const [memo, setMemo] = useState(String);		//	メモ(備考欄)の記入用
	const auth = useAuth();
	const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
	const [scanData, setScanData] = useState("");
	const [frameProcessorActive, setFrameProcessorActive] = useState(true);
	const devices = useCameraDevices();
	const device = devices.back;

	useEffect(() => {
		const requestCameraPermission = async () => {
			try {
				const permission = await Camera.requestCameraPermission();
				setCameraPermission(permission);
			} catch (error) {
				Alert.alert("エラー", "カメラの使用許可をリクエストできませんでした");
			}
		};
		requestCameraPermission();
	}, []);

	/**
	 * QRコードスキャン処理
	 * @param code QRコードの内部データ(入庫数や登録日など)
	 */
	const onQRCodeScanned = (code: string) => {
		if (!frameProcessorActive) {
			setFrameProcessorActive(true);
			setScanData(code);
			// 出庫データ登録ロジックを実行
			showConfirmAlert(code);
			setTimeout(() => {
				setFrameProcessorActive(false);
			}, 5000);
		}

	};

	/**
	 * QRコード撮影時、アラート画面を表示させる処理
	 * @param code QRコードの内部データ(入庫数や登録日など)
	 */
	const showConfirmAlert = (code: string) => {
		Alert.alert(
			"データを送信しますか？",
			code,
			[
				{
					text: "キャンセル",
					onPress: () => {
						// キャンセルボタンが押された場合の処理
						// データの送信は行わず、新しいQRコードの読み取りを待機
					},
					style: "cancel",
				},
				{
					text: "送信",
					onPress: () => {
						// 送信ボタンが押された場合の処理
						// データをサーバーに送信し、成功/失敗に応じて処理を行う
						handlePayoutData(code);
					},
				},
			]
		);
	}

	const frameProcessor = useFrameProcessor(
		(frame) => {
			'worklet';
			const qrCodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], {
				checkInverted: true,
			});
			if (qrCodes.length > 0) {
				runOnJS(onQRCodeScanned)(qrCodes[0].displayValue || '');
			}
		},
		[]
	);

	/**
	 * QRコードから出庫登録
	 * @param code QRコードの内部データ
	 */
	const handlePayoutData = async (code: string) => {
		try {
			JWTToken(auth.authData?.access_token)

			//QRコードの内部データをトリミング
			const partsName = code.split("-")[0].trim();					//	部品名
			const partsNoMatch = code.match(/製品番号: ([^\s-]+)/);			//	「製品番号:」以下のデータだけ抜き取り
			const partsNo = partsNoMatch ? partsNoMatch[1].trim() : '';		//	抜き取ったデータだけ保存
			const inStockCnt = parseInt(code.match(/入庫数: (\d+)/)![1]);	//	入庫数をint型にキャスト
			const entryDate = code.match(/日付: ([\d/ :]+)/)![1];			//	入庫日を保存
			const QRData = {
				partsName, partsNo, inStockCnt, entryDate
			}

			// 日付取得用変数
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const day = today.getDate();
			const dbDate = year.toString() + '/' + month.toString() + "/" + day.toString();

			//	送信データ
			const sendData = {
				date: dbDate,
				accepted: 0,
				partsName: QRData.partsName,
				partsNo: QRData.partsNo,
				payout: QRData.inStockCnt,
				memo: "入庫登録日時: " + entryDate.toString(),
				registered_Date: new Date(),
			};

			if (sendData.accepted === null) {
				sendData.accepted = 0;
			}
			console.log(sendData);
			Alert.alert("データを登録しました");
			setInCount("");
			setOutCount("");
			setMemo("");

			setLoading(true);
			await axiosInstance.post("/inventory/create", sendData);
			setLoading(false);
		} catch (err: any) {
			Alert.alert("エラー", err.message || "データの登録中にエラーが発生しました");
			setLoading(false);
		}
	};


	/**
	 * カメラ撮影処理
	 * @returns カメラ撮影画面・QRコードデータ
	 */
	const renderCameraView = () => {
		if (!device) {
			return <Text>背面カメラがありません</Text>;
		}

		if (!cameraPermission) {
			return <Text>カメラの使用権限を許可してください</Text>;
		}

		return (
			<View>
				<Camera device={device} isActive={true} style={{ width: 600, height: 400 }} frameProcessor={frameProcessor} frameProcessorFps={0.5} />
				<Text>{scanData}</Text>
			</View>
		);
	};

	return (
		<View>
			{renderCameraView()}
			{/* 入庫数、出庫数、メモの入力フィールドなどを追加 */}
		</View>
	);
};
