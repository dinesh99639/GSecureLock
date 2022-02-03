import { useEffect, forwardRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { lightTheme, darkTheme } from './Theme';
import { GlobalStyles } from './GolbalStyles';

import { getAllFiles, createFile, downloadFile } from './api/drive';
import initApp from './api/init';

import { Backdrop, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import Header from './Components/Header';
import Dashboard from "./Components/Dashboard/Dashboard";
import Account from "./Components/Account/Account";
import SetupNewAccount from "./Components/SetupNewAccount";
import Test from "./Components/Test";


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const dispatch = useDispatch();

    const { theme, isLoading, snack, isLoggedIn } = useSelector((state) => ({ ...state.config }));
 
    const updateLoadingStatus = useCallback((isLoading) => dispatch({ type: "updateLoadingStatus", payload: { isLoading } }), [dispatch]);
    const showBackdrop = useCallback(() => updateLoadingStatus(true), [updateLoadingStatus]);
    const hideBackdrop = useCallback(() => updateLoadingStatus(false), [updateLoadingStatus]);
    
    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const hideSnack = (event, reason) => (reason !== 'clickaway') ? updateSnack({ open: false }) : null;

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);
    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);


    const login = async () => {
        showBackdrop();
        await window.gapi.auth2.getAuthInstance().signIn();

        let isLoggedIn = true;
        let dataFileId = null;
        let encryptedData = '';

        let res = await getAllFiles();

        if (res.files.length === 0) {
            res = await createFile()
            res = { files: [{ id: res.id }] }
        }
        dataFileId = res.files[0].id;

        localStorage.setItem('dataFileId', dataFileId);

        res = await downloadFile(dataFileId);
        encryptedData = res.body;

        updateLoginStatus(isLoggedIn);
        updateLocalStore({ dataFileId, encryptedData });
        localStorage.setItem('encryptedData', encryptedData);
        hideBackdrop()
    }

    const logout = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        updateLoginStatus(false);
        updateLocalStore({ dataFileId: '', encryptedData: '' });
        localStorage.removeItem('dataFileId');
    }


    useEffect(() => {
        let encryptedData = localStorage.getItem('encryptedData');

        if (encryptedData) {
            updateLoginStatus(true);
            updateLocalStore({ dataFileId: localStorage.getItem('dataFileId'), encryptedData });
        }
        else initApp(updateLoginStatus, updateLocalStore);

        // const checkStorage = async () => {
        //     console.log(await window.gapi.auth2.getAuthInstance().signIn())
        //     if (localStorage.getItem('userData') === null && await window.gapi.auth2.getAuthInstance().signIn()) {
        //         logout();
        //     }
        // }

        // checkStorage()
    }, [updateLocalStore, updateLoginStatus]);

    useEffect(() => {
        if (isLoggedIn === null) showBackdrop();
        else hideBackdrop();
    }, [isLoggedIn, showBackdrop, hideBackdrop]);


    return (<>
        <ThemeProvider theme={(theme === "light") ? lightTheme : darkTheme}>
            <GlobalStyles />

            {(isLoggedIn !== null) && (<>
                <Header
                    auth={{ isLoggedIn: isLoggedIn, login, logout }}
                />

                <Switch>
                    <Route path="/dashboard" >
                        <Dashboard />
                    </Route>
                    <Route path="/account" >
                        <Account />
                    </Route>
                    <Route path="/setup_account" >
                        <SetupNewAccount />
                    </Route>
                    <Route path="/test" ><Test /></Route>
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