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
    const classes = useStyles();
    const { password, updatePassword, updateSelectedEntryId } = props;

    const unlock = () => {
        try {
            let data = JSON.parse(crypto.decrypt(props.state.encryptedData, password));
            props.setState({ ...props.state, data });
            props.updateLockTime({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 })
        }
        catch {
            props.showSnack("error", "Wrong password");
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