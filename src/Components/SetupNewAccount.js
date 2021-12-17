import { useState } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from "@mui/styles";

import crypto from '../Utils/crypto';
import { updateFile } from '../api/drive';

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
    const history = useHistory();
    const classes = useStyles();

    const [haveAccess, updateAccess] = useState(true);
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

    const handleInputChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleContinueBtnClick = async () => {
        if (passwords.password === '' || passwords.confirmPassword === '') {
            props.showSnack("error", "All fields are required")
            return;
        }

        if (passwords.password !== passwords.confirmPassword) {
            props.showSnack("error", "Password and Confirm password should be same")
            return;
        }

        if (passwords.password.length < 4) {
            props.showSnack("error", "Password should atleast have 4 characters")
            return;
        }

        props.showBackdrop();

        let initData = JSON.stringify({
            config: {
                timer: 5,
            },
            templates: [{
                id: "t1",
                name: "Default",
                data: [
                    { user: "", password: "", website: "" }
                ],
                labels: []
            }],
            credentials: [
                {
                    id: "C1",
                    user: "user1",
                    name: "Credentials 1",
                    category: "Passwords",
                    data: [
                        { name: "Password", value: "user1 password", type: "password" },
                        { name: "Website", value: "https://samplesite.com", type: "link" }
                    ]
                },
                {
                    id: "C2",
                    user: "user2",
                    name: "Credentials 2",
                    category: "Passwords",
                    data: [
                        { name: "Password", value: "user2 password", type: "password" },
                        { name: "Website", value: "https://samplesite.com", type: "link" }
                    ]
                },
                {
                    id: "C3",
                    user: "user1",
                    name: "Card 1",
                    category: "Cards",
                    data: {
                        network: "VISA",
                        cardName: "Bank Card",
                        cardType: "Debit Card",
                        cardNo: "0000 0000 0000 0000",
                        validThru: "10/2031",
                        cardHolderName: "Firstname Lastname",
                        CVV: "000"
                    }
                },
                {
                    id: "C4",
                    user: "user1",
                    name: "Testing 1",
                    category: "Testing",
                    data: [
                        { name: "Password", value: "user1 Testing", type: "password" },
                        { name: "Website", value: "https://samplesite.com", type: "link" }
                    ]
                }
            ]
        });

        let encryptedData = crypto.encrypt(initData, passwords.password)

        await updateFile(localStorage.getItem('dataFileId'), encryptedData);
        props.setState({ ...props.state, encryptedData });

        history.push('/dashboard');
        props.hideBackdrop();
    }


    useState(() => {
        if (props.state.encryptedData.length !== 0) updateAccess(false);
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