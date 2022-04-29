import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@mui/styles";

import crypto from '../../Utils/crypto';

import { Box, Typography, TextField, Button } from '@mui/material';
import { useEffect } from "react";

const useStyles = makeStyles({
    root: {
        borderBottom: "1px solid white",
        margin: "30px 5px"
    },
    input: {
        color: "inherit"
    },
    inputLabelShrink: {
        transform: "translate(10%, -3px) scale(0.8)",
    }
});

function LockScreen(props) {
    const dispatch = useDispatch();

    const classes = useStyles();
    const { updateIsSessionLocked } = props;

    const { password, encryptedData } = useSelector((state) => state.localStore);
    const updatePassword = useCallback((password) => dispatch({ type: "updatePassword", payload: { password } }), [dispatch]);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);

    const updateLockTime = useCallback((lockTime) => dispatch({ type: "updateLockTime", payload: { lockTime } }), [dispatch]);

    const updateSavedEntries = useCallback((savedEntries) => dispatch({ type: "updateSavedEntries", payload: { savedEntries } }), [dispatch]);
    const updateModifiedEntries = useCallback((modifiedEntries) => dispatch({ type: "updateModifiedEntries", payload: { modifiedEntries } }), [dispatch]);
    const updateTemplates = useCallback((templates) => dispatch({ type: "updateTemplates", payload: { templates } }), [dispatch]);


    const unlock = () => {
        try {
            let data = JSON.parse(crypto.decrypt(encryptedData, password));
            
            updateSavedEntries([...data.credentials]);
            updateModifiedEntries([...data.credentials]);
            updateTemplates(data.templates);
            
            updateLockTime({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 });
            updateIsSessionLocked(false);
        }
        catch {
            showSnack("error", "Wrong password");
        }
    }

    useEffect(() => {
        updatePassword("");
        updateSelectedEntryId('');
    }, [updatePassword, updateSelectedEntryId])

    return (<>
        <Box className="lockScreen" style={{ position: "absolute", top: "6.5vh", width: "100%", height: "93.5vh" }} >
            <Box style={{ textAlign: "center", margin: "76px 0" }} >
                <Typography variant="h6">Session Locked</Typography>
                <Typography variant="body1" style={{ margin: "10px 0" }}>Enter password to unlock the session</Typography>

                <TextField
                    variant="standard"
                    autoFocus
                    label={<Typography style={{ padding: "0 60px" }} >Password</Typography>}
                    type="password"
                    name="password"
                    className={classes.root}
                    InputProps={{
                        className: classes.input
                    }}
                    inputProps={{ style: { textAlign: 'center' } }}
                    InputLabelProps={{
                        style: { color: 'inherit' },
                        classes: {
                            shrink: classes.inputLabelShrink
                        }
                    }}
                    style={{ textAlign: "center" }}
                    onChange={(e) => { updatePassword(e.target.value) }}
                    onKeyDown={(e) => (e.keyCode === 13) ? unlock() : null}
                />

                <Button
                    variant="contained"
                    style={{ display: "flex", margin: "auto" }}
                    onClick={unlock}
                >Unlock</Button>
            </Box>
        </Box>
    </>);
}

export default LockScreen;