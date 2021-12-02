import { useEffect, useState, forwardRef } from "react";
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

function App(props) {
    const [theme, setTheme] = useState(localStorage.getItem('theme'));
    const [isLoading, updateLoadingStatus] = useState(false);
    const [snack, updateSnack] = useState({ open: false, type: 'success', message: "" });
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

    const toggleTheme = () => {
        let changedTheme = (theme === "light") ? "dark" : "light";
        setTheme(changedTheme)
        localStorage.setItem("theme", changedTheme);
    }

    const auth = { isLoggedIn: state.isLoggedIn, login, logout };

    const showBackdrop = () => updateLoadingStatus(true);
    const hideBackdrop = () => updateLoadingStatus(false);

    const showSnack = (type, message) => updateSnack({ open: true, type, message });
    const hideSnack = () => updateSnack({ open: false });

    useEffect(() => {
        if (localStorage.getItem('theme') === null) {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }

        initApp(setState)
    }, []);

    useEffect(() => {
        if (state.isLoggedIn === null) showBackdrop();
        else hideBackdrop();
    }, [state.isLoggedIn]);
    

    return (<>
        <ThemeProvider theme={(theme === "light") ? lightTheme : darkTheme}>
            <GlobalStyles />

            {(state.isLoggedIn !== null) && (<>
                <Header
                    theme={theme}
                    toggleTheme={toggleTheme}
                    auth={auth}
                    encryptedData={state.encryptedData}
                />

                <Switch>
                    <Route path="/dashboard" >
                        <Dashboard 
                            state={state}
                        />
                    </Route>
                    <Route path="/setup_account" >
                        <SetupNewAccount 
                            state={state}
                            setState={setState}
                            showBackdrop={showBackdrop}
                            hideBackdrop={hideBackdrop}
                            showSnack={showSnack}
                        />
                    </Route>
                    <Route path="/test" ><Test /></Route>
                </Switch>
            </>)}

            <Snackbar 
                open={snack.open} 
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                autoHideDuration={5000}
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