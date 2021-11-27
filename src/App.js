import { useEffect, useState } from "react";

import { Backdrop, CircularProgress } from '@mui/material';

import { getAllFiles, createFile, downloadFile } from './api/drive';
import initApp from './api/init';

import Header from './Components/Header';


function App() {
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
        localStorage.clear();
    }

    const auth = { login, logout }

    useEffect(() => {
        initApp(setState)
    }, []);

    return (<>
        <Backdrop
            sx={{ color: '#fff' }}
            open={state.isLoggedIn === null}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

        {(state.isLoggedIn !== null) && (
            <Header />
        )}
    </>);
}

export default App