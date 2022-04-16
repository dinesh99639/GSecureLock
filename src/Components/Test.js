import { useState, useContext } from "react";
// import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { GApiContext } from "../api/GApiProvider";

function Test() {
    // const dispatch = useDispatch();
    const gapi = useContext(GApiContext);

    const [state, setState] = useState({
        isLoggedIn: false,
        dataFileId: null,
        data: ''
    });

    // const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);
    // const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const login = async () => {
        await window.gapi.auth2.getAuthInstance().signIn();

        let isLoggedIn = true;
        let dataFileId = null;
        let data = '';

        let res = await gapi.getAllFiles();

        if (res.data.files.length === 0) {
            res = await gapi.createFile()
            res = { data: { files: [{ id: res.id }] } }
        }
        dataFileId = res.data.files[0].id;

        localStorage.setItem('dataFileId', dataFileId);

        res = await gapi.downloadFile(dataFileId);
        data = res.data.body;

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

    // useEffect(() => {
    //     initApp(updateLoginStatus, updateLocalStore)
    // }, [updateLoginStatus, updateLocalStore]);

    return (<>
        <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Button variant="contained" onClick={login}>Login</Button>
            <Button variant="contained" onClick={gapi.getAccessToken}>getAccessToken</Button>
            <Button variant="contained" onClick={logout}>Logout</Button>

            <br />
            <Button variant="contained" onClick={async () => { console.log(await gapi.getUserData()) }}>User Data</Button>
            <Button variant="contained" onClick={async () => { console.log(await gapi.getAllFiles()) }}>getAllFiles</Button>
            <Button variant="contained" onClick={async () => { console.log(await gapi.createFile()) }}>createFile</Button>
            <Button variant="contained" onClick={async () => { console.log(await gapi.removeAllFiles()) }}>removeAllFiles</Button>
            <Button variant="contained" onClick={async () => { console.log(await gapi.updateFile(localStorage.getItem("dataFileId"), "updated")) }}>updateFile</Button>
            <Button variant="contained" onClick={async () => { console.log(await gapi.downloadFile(localStorage.getItem("dataFileId"))) }}>downloadFile</Button>

            <br />
            <Button variant="contained" onClick={() => { console.log(state) }}>getState</Button>

        </div>
    </>);
}

export default Test;