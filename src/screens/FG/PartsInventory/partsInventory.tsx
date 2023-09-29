import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"
import { useTheme } from "styled-components/native";
import { useAuth } from "../../../hooks/useAuth";
import { JWTToken, axiosInstance } from "../../../services/authservices";
import { Part, fetchParts } from "../../../services/createInventoryService";

export const PartsInventory = () => {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [parts, setParts] = useState<Part[]>([]);
	const [selectedPart, setSelectedPart] = useState<Part | null>(null);
	const [inCount, setInCount] = useState("");
	const [outCount, setOutCount] = useState("");
	const [memo, setMemo] = useState("");
	const auth = useAuth();
	const pickerRef = useRef<any>(null);

	async function getPartsData() {
		try {
			JWTToken(auth.authData?.access_token);
			const partsData = await fetchParts();
			setParts(partsData.filter((part) => part.isUsing));
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getPartsData();
	}, []);

	function openPicker() {
		pickerRef.current?.focus();
	}

	function closePicker() {
		pickerRef.current?.blur();
	}

	async function submitData() {
		const accepted = parseInt(inCount);
		const payout = parseInt(outCount);

		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const day = today.getDate();
		const dbDate = `${year}/${month}/${day}`;

		if (!selectedPart) {
			Alert.alert("部品を選択してください。");
			return;
		}

		const sendData = {
			partsName: selectedPart.partsName,
			partsNo: selectedPart.partsNo,
			accepted: accepted || 0,
			payout: payout || 0,
			date: dbDate,
			registered_Date: new Date(),
			memo: memo || "",
		};

		if (sendData.accepted === null) {
			sendData.accepted = 0;
		}
		if (sendData.payout === null) {
			sendData.payout = 0;
		}
		if (sendData.accepted === null && sendData.payout === null) {
			Alert.alert("データを入力してください。");
			return;
		}

		try {
			setLoading(true);
			await axiosInstance.post("/inventory/create", sendData);
			Alert.alert("データを登録しました");
			setInCount("");
			setOutCount("");
			setMemo("");
		} catch (err: any) {
			Alert.alert("エラー", err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.container}>
			<View style={[styles.inputContainer, { justifyContent: "center", alignItems: "center" }]}>
				<TouchableOpacity
					style={styles.pickerButton}
					onPress={openPicker}
				>
					<Picker
						ref={pickerRef}
						selectedValue={selectedPart}
						onValueChange={(itemValue: Part | null) => {
							setSelectedPart(itemValue);
							closePicker();
						}}
						mode="dropdown"
						style={styles.picker}
					>
						<Picker.Item label="選択してください" value={null} />
						{parts.map((item: any) => (
							<Picker.Item
								key={item.partsNo}
								label={`${item.partsName} <${item.partsNo}>`}
								value={item}
							/>
						))}
					</Picker>
					<Text style={[styles.pickerButtonText, { justifyContent: "center", alignItems: "center", paddingHorizontal: 30, fontSize: 16, fontWeight: "bold", marginTop: -30 }]}>
						{selectedPart
							? `${selectedPart.partsName} <${selectedPart.partsNo}>`
							: "部材選択"}
					</Text>
				</TouchableOpacity>
			</View>


			{selectedPart && (
				<View style={[styles.selectedPartInfo, { marginTop: 20, }]}>
					<Text style={styles.selectedPartText}>
						部品名: {selectedPart?.partsName}
					</Text>
					<Text style={styles.selectedPartText}>
						部品番号: {selectedPart?.partsNo}
					</Text>
				</View>
			)}
			<View style={[styles.inputContainer, { marginTop: 10, }]}>
				<Text style={styles.inputLabel}>入庫数</Text>
				<TextInput
					keyboardType="numeric"
					style={styles.inputField}
					placeholder="入庫数"
					multiline={false}
					value={inCount}
					onChangeText={(text) => setInCount(text)}
					returnKeyType={"done"}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>出庫/仕損数</Text>
				<TextInput
					keyboardType="numeric"
					style={styles.inputField}
					placeholder="出庫/仕損数"
					multiline={false}
					value={outCount}
					onChangeText={(text) => setOutCount(text)}
					returnKeyType={"done"}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>備考</Text>
				<TextInput
					keyboardType="default"
					style={styles.inputField}
					placeholder="備考"
					multiline={true}
					value={memo}
					onChangeText={(text) => setMemo(text)}
				/>
			</View>
			<TouchableOpacity
				style={styles.submitButton}
				onPress={submitData}
				disabled={loading}
			>
				<Text style={styles.submitButtonText}>登録</Text>
			</TouchableOpacity>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#f0f0f0",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
	pickerButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 24, // ボタンの横幅を調整
		backgroundColor: "#ffffff",
		justifyContent: "center",
		alignItems: "center", // テキストの中央配置
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
	},
	pickerButtonText: {
		color: "#333",
		fontSize: 12,
	},
	picker: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	selectedPartInfo: {
		marginVertical: 8,
	},
	selectedPartText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	inputLabel: {
		width: 100,
		marginRight: 8,
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	inputField: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		fontSize: 16,
		color: "#333",
	},
	submitButton: {
		marginTop: 16,
		backgroundColor: "#4e2db6",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	submitButtonText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
	},
});

export default PartsInventory;

