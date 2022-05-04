import * as React from "react";
import type { AppProps } from "next/app";
import { store } from "@/store/store";
import { getSession } from "@/store/slices/userSlice";
import { Provider } from "react-redux";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/styles/globals.css";
import { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
const drawerWidth = 240;
const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'url("/static/img/background_menu.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f2fcff",
          backgroundPosition: "bottom",
          width: drawerWidth,
        },
      },
    },
  },
  typography: {
    fontFamily: "Roboto",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  spacing: 8,
  palette: {
    primary: process.env.REACT_APP_IS_PRODUCTION == "0" ? blue : blue,
    background: {
      default: "#FFF",
    },
  },
});

interface MyAppProps extends AppProps {}

const MyApp = (props: MyAppProps) => {
  const { Component, pageProps } = props;

  // update session & set token
  useEffect(() => {
    store.dispatch(getSession());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
