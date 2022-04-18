import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  useTheme,
} from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import createEmotionCache from "../utility/createEmotionCache";
import lightThemeOptions from "../styles/theme/lightThemeOptions";
import "../styles/globals.css";
import Header from "../components/Layouts/Header";
import Menu from "../components/Layouts/Menu";
import styled from "@emotion/styled";
import { blue, blueGrey } from "@mui/material/colors";
const drawerWidth = 240;

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage:
            "url(" +
            `${process.env.PUBLIC_URL}/images/background_menu.jpg` +
            ")",
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
    primary: process.env.REACT_APP_IS_PRODUCTION == "0" ? blue : blueGrey,
    background: {
      default: "#FFF",
    },
  },
});

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [open, setOpen] = React.useState(true);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })<{
    open?: boolean;
  }>(() => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `${drawerWidth}px`,
    ...(!open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header open={open} onDrawerOpen={() => setOpen(true)} />
      <Menu open={open} onDrawerClose={() => setOpen(false)} />
      <Main open={open}>
        <DrawerHeader />
        <Component {...pageProps} />
      </Main>
    </ThemeProvider>
  );
};

export default MyApp;
