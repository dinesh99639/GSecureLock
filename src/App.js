import { useEffect, forwardRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { lightTheme, darkTheme } from './Theme';
import { GlobalStyles } from './GolbalStyles';

import { Backdrop, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import Header from './Components/Header';
import Home from './Components/Home';
import Dashboard from "./Components/Dashboard/Dashboard";
import Account from "./Components/Account/Account";
import SetupNewAccount from "./Components/SetupNewAccount";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import Test from "./Components/Test";


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { theme, isLoading, snack, isLoggedIn } = useSelector((state) => ({ ...state.config }));

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const hideSnack = (event, reason) => (reason !== 'clickaway') ? updateSnack({ open: false }) : null;

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);
    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);


    useEffect(() => {
        let encryptedData = localStorage.getItem('encryptedData');

        if (encryptedData) {
            let dataFileId = localStorage.getItem('dataFileId');
            updateLoginStatus(true);
            updateLocalStore({ dataFileId, encryptedData });
        }
        else {
            updateLoginStatus(false);
            history.push("/");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLocalStore, updateLoginStatus]);


    return (<>
        <ThemeProvider theme={(theme === "light") ? lightTheme : darkTheme}>
            <GlobalStyles />

            {(isLoggedIn !== null) && (<>
                <Header />

                <Switch>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/account" component={Account} />
                    <Route path="/setup_account" component={SetupNewAccount} />
                    <Route path="/test" component={Test} />
                    <Route path="/privacy_policy" component={PrivacyPolicy} />
                    <Route path="/" component={Home} />
                </Switch>
            </>)}

            <Snackbar
                key={snack.key}
                open={snack.open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={3000}
                transitionDuration={{ enter: 500, exit: 0 }}
                onClose={hideSnack}
            >
                <Alert onClose={hideSnack} severity={snack.type} sx={{ width: '100%' }}>{snack.message}</Alert>
            </Snackbar>

            <Backdrop
                sx={{ color: '#fff' }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </ThemeProvider>
    </>);
}

export default App;