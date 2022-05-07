import { useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@mui/styles";

import { GApiContext } from "../../api/GApiProvider";

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
    const gapi = useContext(GApiContext);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [deleteMessage, setDeleteMessage] = useState("");

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });
    
    const updateLoadingStatus = useCallback((isLoading) => dispatch({ type: "updateLoadingStatus", payload: { isLoading } }), [dispatch]);
    const showBackdrop = useCallback(() => updateLoadingStatus(true), [updateLoadingStatus]);
    const hideBackdrop = useCallback(() => updateLoadingStatus(false), [updateLoadingStatus]);

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);
    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const setUser = useCallback((user) => dispatch({ type: "setUser", payload: { user } }), [dispatch]);

    const removeAccount = async () => {
        showBackdrop();

        if (deleteMessage.trim() === "DELETE") {
            await gapi.removeAllFiles()

            updateLoginStatus(false);
            updateLocalStore({ dataFileId: '', encryptedData: '', password: '' });

            setUser({ name: '', email: '', image: '' })

            localStorage.removeItem("access");
            localStorage.removeItem("dataFileId");
            localStorage.removeItem("encryptedData");
            localStorage.removeItem("userData");

            history.replace("/");

            showSnack("success", "Account removed successfully");
        }
        else {
            showSnack("error", "Enter \"DELETE\" without quotes");
        }

        hideBackdrop();
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
                placeholder="Type DELETE"
                type="text"
                className={classes.root}
                InputProps={{
                    className: classes.input
                }}
                inputProps={{ style: { textAlign: 'center' } }}
                InputLabelProps={{
                    style: { color: 'inherit' },
                }}
                style={{ margin: "20px 5px 15px 5px" }}
                value={deleteMessage}
                onChange={(e) => setDeleteMessage(e.target.value)}
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