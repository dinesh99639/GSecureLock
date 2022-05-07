import { useState, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { makeStyles } from "@mui/styles";

import crypto from '../Utils/crypto';
import { GApiContext } from "../api/GApiProvider";

import { TextField, Typography, Box, Button } from '@mui/material';

import PermissionDenied from './PermissionDenied';

const useStyles = makeStyles({
    root: {
        borderBottom: "1px solid white",
        margin: "30px 5px"
    },
    input: {
        color: "inherit"
    },
});

function SetupNewAccount(props) {
    const gapi = useContext(GApiContext);
    const dispatch = useDispatch();

    const history = useHistory();
    const classes = useStyles();

    const { dataFileId, encryptedData } = useSelector((state) => state.localStore);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const updateLoadingStatus = useCallback((isLoading) => dispatch({ type: "updateLoadingStatus", payload: { isLoading } }), [dispatch]);
    const showBackdrop = useCallback(() => updateLoadingStatus(true), [updateLoadingStatus]);
    const hideBackdrop = useCallback(() => updateLoadingStatus(false), [updateLoadingStatus]);

    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const [haveAccess, updateAccess] = useState(true);
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

    const handleInputChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleContinueBtnClick = async () => {
        if (passwords.password === '' || passwords.confirmPassword === '') {
            showSnack("error", "All fields are required")
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            showSnack("error", "Password and Confirm password should be same")
            return;
        }

        if (passwords.password.length < 4) {
            showSnack("error", "Password should atleast have 4 characters")
            return;
        }

        showBackdrop();

        let initData = JSON.stringify({
            templates: [
                {
                    id: "T1",
                    user: "",
                    name: "Password",
                    category: "Passwords",
                    data: [
                        { name: "User", value: "", type: "text" },
                        { name: "Password", value: "", type: "password" },
                        { name: "Website", value: "", type: "link" }
                    ],
        
                    createdAt: "Fri Apr 30 1999 20:55:01",
                    lastModifiedAt: "Fri Apr 30 1999 20:55:01"
                },
                {
                    id: "T2",
                    user: "",
                    name: "Card",
                    category: "Cards",
                    data: {
                        network: "",
                        cardName: "",
                        cardType: "Debit Card",
                        cardNo: "",
                        validThru: "",
                        cardHolderName: "",
                        CVV: ""
                    },
                    cardTheme: "bluePurple",
        
                    createdAt: "Fri Apr 30 1999 20:55:01",
                    lastModifiedAt: "Fri Apr 30 1999 20:55:01"
                }
            ],
            credentials: [
                {
                    id: "C1",
                    user: "Sample user",
                    name: "Credentials",
                    category: "Passwords",
                    data: [
                        { name: "User", value: "Sample user", type: "text" },
                        { name: "Password", value: "user password", type: "password" },
                        { name: "Website", value: "https://www.gsecurelock.ml/", type: "link" },
                        { name: "Hidden Field", value: "You can hide info like this", type: "hidden" },
                    ],
                    
                    createdAt: "Fri Apr 30 1999 20:55:01",
                    lastModifiedAt: "Fri Apr 30 1999 20:55:01"
                },
                {
                    id: "C2",
                    user: "Sample user",
                    name: "Card",
                    category: "Cards",
                    data: {
                        network: "VISA",
                        cardName: "Bank Card",
                        cardType: "Debit Card",
                        cardNo: "0000 0000 0000 0000",
                        validThru: "10/2031",
                        cardHolderName: "Firstname Lastname",
                        CVV: "000"
                    },
                    cardTheme: "bluePurple",
        
                    createdAt: "Fri Apr 30 1999 20:55:01",
                    lastModifiedAt: "Fri Apr 30 1999 20:55:01"
                }
            ]
        });

        let encryptedData = crypto.encrypt(initData, passwords.password)

        await gapi.updateFile(localStorage.getItem('dataFileId'), encryptedData);
        updateLocalStore({ dataFileId, encryptedData })

        history.push('/dashboard');
        hideBackdrop();
    }


    useState(() => {
        if (encryptedData.length !== 0) updateAccess(false);
    }, [])

    if (!haveAccess) return <PermissionDenied />;

    return (<>
        <Box>
            <Typography
                variant="h5"
                component="div"
                align="center"
                style={{ margin: "76px 0 10px 0" }}
            >Setup your new account</Typography>

            <Typography
                variant="p"
                component="div"
                align="center"
                style={{ margin: "10px 0" }}
            >Create a new password to unlock your passwords</Typography>

            <Box style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                    variant="standard"
                    label="Password"
                    type="password"
                    name="password"
                    className={classes.root}
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        style: { color: 'inherit' },
                    }}
                    onChange={handleInputChange}
                />
                <TextField
                    variant="standard"
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    className={classes.root}
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        style: { color: 'inherit' },
                    }}
                    onChange={handleInputChange}
                />

            </Box>
            <Box style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleContinueBtnClick}
                >Continue</Button>
            </Box>
        </Box>
    </>);
}

export default SetupNewAccount;