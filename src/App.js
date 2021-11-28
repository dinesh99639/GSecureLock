import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { lightTheme, darkTheme } from './Theme';
import { GlobalStyles } from './GolbalStyles';

import { getAllFiles, createFile, downloadFile } from './api/drive';
import initApp from './api/init';


import { Backdrop, CircularProgress } from '@mui/material';


import Header from './Components/Header';
import Dashboard from "./Components/Dashboard";


function App(props) {
    let history = useHistory();

    const [theme, setTheme] = useState(localStorage.getItem('theme'));
    const [state, setState] = useState({
        isLoggedIn: null,
        dataFileId: null,
        data: ''
    });

    const login = async () => {
        await window.gapi.auth2.getAuthInstance().signIn();

        let isLoggedIn = true;
        let dataFileId = null;
        let data = '';

        let res = await getAllFiles();

        if (res.files.length === 0) {
            res = await createFile()
            res = { files: [{ id: res.id }] }
        }
        dataFileId = res.files[0].id;

        localStorage.setItem('dataFileId', dataFileId);

        res = await downloadFile(dataFileId);
        data = res.body;

        setState({ isLoggedIn, dataFileId, data })
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

    const auth = { isLoggedIn: state.isLoggedIn, login, logout }

    useEffect(() => {
        if (localStorage.getItem('theme') === null) {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
        
        initApp(setState)
    }, []);

    // useEffect(() => {
    //     if (state.isLoggedIn) history.push('/dashboard');
    //     else history.push('/');
    // }, [state.isLoggedIn]);

    return (<>
        <ThemeProvider theme={(theme === "light") ? lightTheme : darkTheme}>
            <GlobalStyles />

            <Backdrop
                sx={{ color: '#fff' }}
                open={state.isLoggedIn === null}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {(state.isLoggedIn !== null) && (<>
                <Header theme={theme} toggleTheme={toggleTheme} auth={auth} />

                <Switch>
                    <Route path="/dashboard" ><Dashboard /></Route>
                </Switch>
            </>)}
        </ThemeProvider>
    </>);
}

export default App;