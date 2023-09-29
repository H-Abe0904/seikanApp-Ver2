import React from "react"
import { AuthProvider } from "./src/hooks/useAuth";
import { Router } from "./src/routes/Router";
import { ThemeProvider } from "styled-components/native";
import theme from "./src/styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;