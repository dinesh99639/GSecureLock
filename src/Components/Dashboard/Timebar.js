import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Typography, IconButton, Paper, Divider, Box } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const RemainingProgress = (props) => {
    let { lockTime, lock } = props;

    let lockTimeSeconds = lockTime.m * 60 + lockTime.s;
    let lockSeconds = lock.value * 60;

    let totalHeight = 0;

    if (lockTimeSeconds > lockSeconds) totalHeight = 100;
    else if ((lockTimeSeconds <= lockSeconds) && (lockTimeSeconds >= (lockSeconds - 300))) {
        totalHeight = ((lockTimeSeconds - lockSeconds + 300) / 3).toFixed(2);
    }

    return (<>
        <Box
            style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: totalHeight + "%",
                backgroundColor: "#0088fd"
            }}
        ></Box>
    </>);
}

function Timebar(props) {
    const dispatch = useDispatch();

    const { updateIsSessionLocked } = props;

    const lockTime = useSelector((state) => state.lockTime);
    const updateLockTime = useCallback((lockTime) => dispatch({ type: "updateLockTime", payload: { lockTime } }), [dispatch]);

    const updateSavedEntries = useCallback((savedEntries) => dispatch({ type: "updateSavedEntries", payload: { savedEntries } }), [dispatch]);
    const updateModifiedEntries = useCallback((modifiedEntries) => dispatch({ type: "updateModifiedEntries", payload: { modifiedEntries } }), [dispatch]);

    const updateLockType = (m) => {
        if (m > 0) updateLockTime({ m, s: 0, lockAt: new Date().getTime() + m * 60000 });
        else updateLockTime({ m: 0, s: 0, lockAt: 0 });
    }

    const lockTypes = [
        { name: "5m", value: 5 },
        { name: "10m", value: 10 },
        { name: "15m", value: 15 },
    ];

    useEffect(
        () => {
            if ((lockTime.m <= 0) && (lockTime.s <= 0)) {
                updateIsSessionLocked(true);
                updateSavedEntries([]);
                updateModifiedEntries([]);
                return;
            }
            const id = setInterval(() => {
                let timeLeft = parseInt((lockTime.lockAt - new Date().getTime()) / 1000);
                let m = parseInt(timeLeft / 60);
                let s = timeLeft % 60;
                
                updateLockTime({ m, s, lockAt: lockTime.lockAt });
            }, 1000);
            return () => clearInterval(id);
        },
        [lockTime, updateLockTime, updateIsSessionLocked, updateSavedEntries, updateModifiedEntries]
    );

    return (<>
        <Paper elevation={5} className="timebar" style={{ height: "100%" }}>
            <IconButton size="medium" style={{ color: "inherit" }} >
                <AccessTimeIcon />
            </IconButton>
            <Typography style={{ fontSize: "12px", opacity: "76%" }} >Locks in</Typography>
            <Typography style={{ fontSize: "12px" }} >{lockTime.m}m {lockTime.s}s</Typography>

            <Divider light={true} variant='fullWidth' style={{ borderColor: "inherit", margin: "5px 0 0 0" }} />

            <List style={{ padding: 0 }}>
                {lockTypes.map((lock) => {
                    return <ListItem
                        key={lock.name}
                        style={{ padding: "0", borderBottom: "1px solid" }}
                    >
                        <RemainingProgress
                            lockTime={lockTime}
                            lock={lock}
                        />
                        <ListItemButton style={{ padding: "7px 0" }} onClick={() => updateLockType(lock.value)} >
                            <ListItemText
                                align="center"
                                primary={lock.name}
                                style={{ 
                                    color: ((lockTime.m >= lock.value) || (lockTime.m - lock.value + 5 >= 3)) ? "white" : "inherit" 
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                })}

                <ListItem style={{ padding: "0", borderBottom: "1px solid" }} >
                    <ListItemButton
                        style={{ padding: "7px 0", display: "block", textAlign: "center" }}
                        onClick={() => updateLockType(0)}
                    >
                        <LockOutlinedIcon />
                    </ListItemButton>
                </ListItem>
            </List>
        </Paper>
    </>);
}

export default Timebar;