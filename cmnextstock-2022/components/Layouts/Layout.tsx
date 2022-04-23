import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme, styled } from "@mui/material";
import { store } from "@/store/store";
import { getSession, isAuthenticatedSelector, signOut } from "@/store/slices/userSlice";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import createEmotionCache from "@/utility/createEmotionCache";
import Header from "@/components/Layouts/Header";
import Menu from "@/components/Layouts/Menu";
import { blue, blueGrey } from "@mui/material/colors";
import { useEffect } from "react";
const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'url("/static/img/background_menu.png")',
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
    primary: process.env.REACT_APP_IS_PRODUCTION == "0" ? blue : blueGrey,
    background: {
      default: "#FFF",
    },
  },
});

const Layout = ({ children }: LayoutProps) => {
  const [open, setOpen] = React.useState(true);

  // update session & set token
  useEffect(() => {
    store.dispatch(getSession());
  }, []);

  const DrawerHeader = styled("div")(({ theme }: any) => ({
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
    <>
      <CssBaseline />
      <Header open={open} onDrawerOpen={() => setOpen(true)} />
      <Menu open={open} onDrawerClose={() => setOpen(false)} />
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
      <style jsx global>
        {`
          body {
            min-height: 100vh;
            position: relative;
            margin: 0;
            background-size: cover;
            background-image: url("/static/img/bg4.jpg");
            text-align: center;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
