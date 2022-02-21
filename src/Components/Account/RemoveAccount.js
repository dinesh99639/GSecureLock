import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

function RemoveAccount(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [sessionPassword, updateSessionPassword] = useState("");

    const { encryptedData } = useSelector((state) => state.localStore);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const removeAccount = () => {
        try {
            JSON.parse(crypto.decrypt(encryptedData, sessionPassword));

            // - Remove all files in server
            // - Remove google session
            localStorage.removeItem("dataFileId");
            localStorage.removeItem("encryptedData");
            localStorage.removeItem("userData");
            history.push("/");

            showSnack("success", "Account removed successfully");
        }
        catch {
            showSnack("error", "Wrong session password");
        }
    }

    return (<>
        <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "10px 0" }} >Remove Account</Typography>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Typography sx={{ fontSize: "14px", textAlign: "center", padding: "10px 0" }} >
                This action will remove complete data from the account. Please note that it is an irreversable process.
            </Typography>
            <Typography sx={{ fontSize: "14px", textAlign: "center", padding: "0px 0" }} >
                Note: Please make sure to export the data if you wan't the entries in the future.
            </Typography>
            <TextField
                variant="standard"
                placeholder="Session Password"
                type="password"
                className={classes.root}
                InputProps={{
                    className: classes.input
                }}
                inputProps={{ style: { textAlign: 'center' } }}
                InputLabelProps={{
                    style: { color: 'inherit' },
                }}
                style={{ margin: "20px 5px 15px 5px" }}
                value={sessionPassword}
                onChange={(e) => updateSessionPassword(e.target.value)}
            />
            <Button
                variant="contained"
                sx={{
                    fontSize: "12px"
                }}
                onClick={removeAccount}
            >Remove Account</Button>
        </Box>
    </>);
}

export default RemoveAccount;