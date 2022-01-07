import { useEffect, useState, forwardRef, useCallback } from "react";
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
import SetupNewAccount from "./Components/SetupNewAccount";
import Test from "./Components/Test";


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const dispatch = useDispatch();

    const { theme, isLoading, snack } = useSelector((state) => ({ ...state.config }));

    
    const updateLoadingStatus = useCallback((isLoading) => dispatch({ type: "updateLoadingStatus", payload: { isLoading } }), [dispatch]);
    const showBackdrop = useCallback(() => updateLoadingStatus(true), [updateLoadingStatus]);
    const hideBackdrop = useCallback(() => updateLoadingStatus(false), [updateLoadingStatus]);
    
    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const hideSnack = (event, reason) => (reason !== 'clickaway') ? updateSnack({ open: false }) : null;


    const [state, setState] = useState({
        isLoggedIn: null,
        dataFileId: null,
        encryptedData: '',
        data: ''
    });

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

        setState({ isLoggedIn, dataFileId, encryptedData });
        localStorage.setItem('encryptedData', encryptedData);
        hideBackdrop()
    }

    const logout = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        setState({
            isLoggedIn: false,
            dataFileId: null,
            data: ''
        })
        localStorage.removeItem('dataFileId');
    }


    useEffect(() => {
        let encryptedData = localStorage.getItem('encryptedData');

        if (encryptedData) {
            setState({
                isLoggedIn: true,
                dataFileId: localStorage.getItem('dataFileId'),
                encryptedData
            })
        }
        else initApp(setState);

        // const checkStorage = async () => {
        //     console.log(await window.gapi.auth2.getAuthInstance().signIn())
        //     if (localStorage.getItem('userData') === null && await window.gapi.auth2.getAuthInstance().signIn()) {
        //         logout();
        //     }
        // }

        // checkStorage()
    }, []);

    useEffect(() => {
        if (state.isLoggedIn === null) showBackdrop();
        else hideBackdrop();
    }, [state.isLoggedIn, showBackdrop, hideBackdrop]);


    return (<>
        <ThemeProvider theme={(theme === "light") ? lightTheme : darkTheme}>
            <GlobalStyles />

            {(state.isLoggedIn !== null) && (<>
                <Header
                    auth={{ isLoggedIn: state.isLoggedIn, login, logout }}
                    encryptedData={state.encryptedData}
                />

                <Switch>
                    <Route path="/dashboard" >
                        <Dashboard
                            state={state}
                            setState={setState}
                        />
                    </Route>
                    <Route path="/setup_account" >
                        <SetupNewAccount
                            state={state}
                            setState={setState}
                        />
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