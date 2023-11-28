import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import Header from "./header";
import Login from "./login";
import UtilityInput from "./utility-input";
import { getAuthTokenBasic, getAuthTokenSession } from "./API";

// https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=B2DFDB&secondary.color=616161
const theme = createTheme({
  palette: {
    primary: {
      main: '#b2dfdb',
    },
    secondary: {
      main: '#616161',
    },
  },
});

const sessionCookieName = "vapor-session";

export default function App() {
  let [state, setState] = React.useState({
    user: null,
    token: null
  });

  let onLogin = (username, password, onSuccess, onFailure) => {
    try {
      getAuthTokenBasic(username, password).then((result) => {
        setState({
          user: username,
          token: result.token
        });
        onSuccess();
      });
    } catch (err) {
      console.log(err);
      onFailure();
    }
  };

  async function withLoginRetry(fn) {
    let result = await fn();
    if (result.ok) {
      return result.json();
    } else if (result.status === 401 && vaporSessionExists()) {
      let result = await getAuthTokenSession();
      console.log(state.token)
      setState({
        user: state.user,
        token: result.token
      });
      console.log(state.token)
      let newResult = await fn()
      if (newResult.ok) {
        return newResult.json();
      } else {
        throw "Failed to fetch data after retrying login"
        // TODO: Redirect to login page
      }
    }
  }

  function clearTokens() {
    setState({
      token: null
    });
    document.cookie = `${sessionCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }

  let onLogout = () => {
    clearTokens();
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={ <Login onLogin={onLogin} /> } />
          <Route path="/"  element={ <RequireAuth token={state.token} onLogout={onLogout} /> } >
            <Route path="/utility-input" element={ <UtilityInput token={state.token} withLoginRetry={withLoginRetry}/> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
            <Route path="" element={ <Navigate to="/utility-input" replace /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RequireAuth(props) {
  let authToken = props.token;
  let onLogout = props.onLogout;
  let location = useLocation();

  if (!authToken && !vaporSessionExists()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, set the formatting and pass to children based on the route
  return (
    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <Header onLogout={onLogout} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1}}>
        <Outlet />
      </Box>
    </Box>
  );
}

function vaporSessionExists() {
  return document.cookie.split(';').some((item) => item.trim().startsWith(`${sessionCookieName}=`));
}
