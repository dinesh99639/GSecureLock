import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@mui/styles";

import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

import crypto from '../../Utils/crypto';

const useStyles = makeStyles({
    root: {
        borderBottom: "1px solid white",
        margin: "30px 5px"
    },
    input: {
        color: "inherit"
    },
});

function ImportExport(props, fileType) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [sessionPassword, updateSessionPassword] = useState("");

    const { dataFileId, encryptedData } = useSelector((state) => state.localStore);

    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    function getFileName() {
        const fileName = "GSecureLock_";

        const time = new Date();

        let YYYY = time.getFullYear();

        let MM = (time.getMonth() + 1).toString();
        MM = (MM.length === 1) ? ("0" + MM) : MM;

        let DD = time.getDate().toString();
        DD = (DD.length === 1) ? ("0" + DD) : DD;

        let hh = time.getHours().toString();
        hh = (hh.length === 1) ? ("0" + hh) : hh;

        let mm = time.getMinutes().toString();
        mm = (mm.length === 1) ? ("0" + mm) : mm;

        let ss = time.getSeconds().toString();
        ss = (ss.length === 1) ? ("0" + ss) : ss;

        let timeFormat = YYYY + "-" + MM + "-" + DD + "T" + hh + "." + mm + "." + ss;

        return fileName + timeFormat;
    }

    const saveToFile = (data, fileType) => {
        const element = document.createElement("a");
        const file = new Blob([data], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);

        element.download = getFileName() + "." + fileType;
        // document.body.appendChild(element);
        element.click();
    }

    const getAppEntries = () => {
        try {
            return JSON.parse(crypto.decrypt(encryptedData, sessionPassword));
        }
        catch {
            showSnack("error", "Wrong Session password");
            return false;
        }
    }

    const exportPlainTextFile = () => {
        let entries = JSON.stringify(getAppEntries(), undefined, 2);
        if (entries !== "false") saveToFile(entries, "txt");
    }

    const exportEncryptedFile = () => saveToFile(encryptedData, "gslock");
    
    const modifyAppEntries = (fileContents, entries) => {
        let templateIds = {};
        let credentialIds = {};
        
        entries.templates.forEach((template, idx) => templateIds[template.id] = idx);
        entries.credentials.forEach((credential, idx) => credentialIds[credential.id] = idx);
        
        fileContents.templates.forEach((template) => {
            if (templateIds[template.id] !== undefined) entries.templates[templateIds[template.id]] = template;
            else entries.templates.push(template);
        });

        fileContents.credentials.forEach((credential) => {
            if (credentialIds[credential.id] !== undefined) entries.credentials[credentialIds[credential.id]] = credential;
            else entries.credentials.push(credential);
        });

        let encryptedData = crypto.encrypt(JSON.stringify(entries), sessionPassword);
        
        // -Update server 
        updateLocalStore({ dataFileId, encryptedData });
        localStorage.setItem('encryptedData', encryptedData);
    }

    const importPlainFile = (fileContents, entries) => {
        try {
            fileContents = JSON.parse(fileContents);
            modifyAppEntries(fileContents, entries);
            showSnack("success", "Imported successfully");
        }
        catch {
            showSnack("error", "Import file error");
        }
    }

    const getFileContents = (callabck, entries) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.click();
        
        input.addEventListener('change', async (e) => {
            let fileContents = await e.target.files[0].text();
            callabck(fileContents, entries);
        })
    }

    const importFile = (callabck) => {
        let entries = getAppEntries();
        if (entries) getFileContents(callabck, entries);
    }

    return (<>
        <Box>
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "10px 0" }} >Import</Typography>
            <Grid container>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Import a plain text file</Typography>
                        <TextField
                            variant="standard"
                            placeholder="Session password"
                            type="password"
                            className={classes.root}
                            InputProps={{
                                className: classes.input
                            }}
                            inputProps={{ style: { textAlign: 'center' } }}
                            InputLabelProps={{
                                style: { color: 'inherit' },
                            }}
                            style={{ margin: "10px 0" }}
                            value={sessionPassword}
                            onChange={(e) => updateSessionPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: "12px"
                            }}
                            onClick={() => importFile(importPlainFile)}
                        >Import</Button>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Import an encrypted file</Typography>
                        <TextField
                            variant="standard"
                            placeholder="Session password"
                            type="password"
                            className={classes.root}
                            InputProps={{
                                className: classes.input
                            }}
                            inputProps={{ style: { textAlign: 'center' } }}
                            InputLabelProps={{
                                style: { color: 'inherit' },
                            }}
                            style={{ margin: "10px 0" }}
                            value={sessionPassword}
                            onChange={(e) => updateSessionPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: "12px"
                            }}
                        >Import</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>

        <Box>
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "40px 0 10px 0" }} >Export</Typography>
            <Grid container>
                <Grid item xs={6} >
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Export as a plain text file</Typography>
                        <TextField
                            variant="standard"
                            placeholder="Session password"
                            type="password"
                            className={classes.root}
                            InputProps={{
                                className: classes.input
                            }}
                            inputProps={{ style: { textAlign: 'center' } }}
                            InputLabelProps={{
                                style: { color: 'inherit' },
                            }}
                            style={{ margin: "10px 0" }}
                            value={sessionPassword}
                            onChange={(e) => updateSessionPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: "12px"
                            }}
                            onClick={exportPlainTextFile}
                        >Export</Button>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Export as an encrypted file</Typography>
                        <Typography sx={{ padding: "17.5px", fontSize: "12px" }} >Password is same as the session password</Typography>
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: "12px"
                            }}
                            onClick={exportEncryptedFile}
                        >Export</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </>);
}

export default ImportExport;