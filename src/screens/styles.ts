import { StyleSheet } from 'react-native';
import { useTheme, ThemeProvider } from "styled-components/native";

const theme = useTheme();

export const styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		fontFamily: theme.fonts.bold, // Use the defined font
		color: theme.colors.black, // Use the defined color
	},
	inputField: {
		width: "80%",
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		paddingHorizontal: 10,
		marginBottom: 20,
	},
	buttonContainer: {
		width: "100%",
		marginBottom: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	Label: {
		marginTop: 10,
		fontSize: 18,
	},
	partDetails: {
		marginTop: 20,
	},
	partsDetailLabel: {
		fontSize: 16,
	}

});