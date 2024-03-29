import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@mui/styles";

import { Box, Button, Grid, Paper, TextField, Typography, Modal } from "@mui/material";

import crypto from '../../Utils/crypto';
import { darkTheme } from '../../Theme';

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
    const [filePasswordModal, updateFilePasswordModal] = useState({ open: false });
    const [filePassword, updateFilePassword] = useState("");

    const { dataFileId, encryptedData } = useSelector((state) => state.localStore);
    const { theme } = useSelector((state) => state.config);

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

        entries = {
            lastModifiedAt: entries.lastModifiedAt || new Date().toString().substring(0, 24),
            ...entries,
        }
        let encryptedData = crypto.encrypt(JSON.stringify(entries), sessionPassword);
        
        // -Update server 
        updateLocalStore({ dataFileId, encryptedData });
        localStorage.setItem('encryptedData', encryptedData);

        updateFilePasswordModal({ open: false });
        showSnack("success", "Imported successfully");
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

    const getFileContents = (fileType, callabck, entries) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "." + fileType;
        input.click();

        input.addEventListener('change', async (e) => {
            let fileContents = await e.target.files[0].text();
            callabck(fileContents, entries);
        })
    }

    const openFilePasswordModal = (fileContents, entries) => {
        updateFilePasswordModal({ open: true, fileContents, entries });
    }

    const importEncryptedFile = () => {
        let { fileContents, entries } = filePasswordModal;

        try {
            fileContents = JSON.parse(crypto.decrypt(fileContents, filePassword));
            modifyAppEntries(fileContents, entries);
        }
        catch {
            showSnack("error", "Wrong file password");
        }
    }

    const importFile = (type, callabck) => {
        let entries = getAppEntries();
        if (entries) getFileContents(type, callabck, entries)
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
                            onClick={() => importFile("txt", importPlainFile)}
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
                            onClick={() => importFile("gslock", openFilePasswordModal)}
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

        <Modal
            open={filePasswordModal.open}
        >
            <Paper
                elevation={5}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : "",
                    color: "inherit",
                    outline: "none",
                    borderRadius: "7px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "0 10px"

                }}
            >
                <Typography>Enter file password</Typography>
                <TextField
                    variant="standard"
                    placeholder="File password"
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
                    value={filePassword}
                    onChange={(e) => updateFilePassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{
                        fontSize: "12px"
                    }}
                    onClick={importEncryptedFile}
                >Proceed</Button>
            </Paper>
        </Modal>
    </>);
}

export default ImportExport;