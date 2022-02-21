import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@mui/styles";

import crypto from '../../Utils/crypto';

import { Typography, TextField, Box, Button } from "@mui/material";

const useStyles = makeStyles({
    root: {
        borderBottom: "1px solid white",
        margin: "30px 5px"
    },
    input: {
        color: "inherit"
    },
});

function ChangePassword(props) {
    const dispatch = useDispatch();
    const classes = useStyles();

    const [currentPassword, updateCurrentPassword] = useState("");
    const [newPassword, updateNewPassword] = useState("");
    const [confirmPassword, updateConfirmPassword] = useState("");

    const { dataFileId, encryptedData } = useSelector((state) => state.localStore);

    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const updatePassword = () => {
        try {
            let entries = JSON.parse(crypto.decrypt(encryptedData, currentPassword));

            if ((newPassword !== "") && (confirmPassword !== "")) {
                if (newPassword === confirmPassword) {
                    let encryptedData = crypto.encrypt(JSON.stringify(entries), newPassword);
    
                    updateLocalStore({ dataFileId, encryptedData });
                    localStorage.setItem('encryptedData', encryptedData);
    
                    showSnack("success", "Password changed successfully");
                }
                else {
                    showSnack("error", "New password and Confirm password doesn't match");
                }
            }
            else {
                showSnack("error", "New password or Confirm password should not be empty");
            }
        }
        catch {
            showSnack("error", "Wrong current password");
        }
    }

    return (<>
        <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "10px 0" }} >Change Password</Typography>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center"
            }}
        >
            <TextField
                variant="standard"
                placeholder="Current Password"
                type="password"
                className={classes.root}
                InputProps={{
                    className: classes.input
                }}
                inputProps={{ style: { textAlign: 'center' } }}
                InputLabelProps={{
                    style: { color: 'inherit' },
                }}
                style={{ margin: "10px 5px" }}
                value={currentPassword}
                onChange={(e) => updateCurrentPassword(e.target.value)}
            />
        </Box>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center"
            }}
        >
            <TextField
                variant="standard"
                placeholder="New Password"
                type="password"
                className={classes.root}
                InputProps={{
                    className: classes.input
                }}
                inputProps={{ style: { textAlign: 'center' } }}
                InputLabelProps={{
                    style: { color: 'inherit' },
                }}
                style={{ margin: "10px 5px" }}
                value={newPassword}
                onChange={(e) => updateNewPassword(e.target.value)}
            />
            <TextField
                variant="standard"
                placeholder="Confirm Password"
                type="password"
                className={classes.root}
                InputProps={{
                    className: classes.input
                }}
                inputProps={{ style: { textAlign: 'center' } }}
                InputLabelProps={{
                    style: { color: 'inherit' },
                }}
                style={{ margin: "10px 5px" }}
                value={confirmPassword}
                onChange={(e) => updateConfirmPassword(e.target.value)}
            />
        </Box>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                margin: "12px 0"
            }}
        >
            <Button
                variant="contained"
                sx={{
                    fontSize: "12px"
                }}
                onClick={updatePassword}
            >Update Password</Button>
        </Box>
    </>);
}

export default ChangePassword;