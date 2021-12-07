import { useState, useEffect } from 'react';

// import crypto from '../../Utils/crypto';

import { Grid } from '@mui/material';

import Timebar from './Timebar';
import CredentialsList from './CredentialsList';
import CredentialData from './CredentialData';
import LockScreen from './LockScreen';

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;
    const { setState } = props;

    // const [lockTime, updateLockTime] = useState({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 });
    const [lockTime, updateLockTime] = useState({ m: 0, s: 0, lockAt: 0 });

    useEffect(() => {
        if ((lockTime.m <= 0) && (lockTime.s <= 0)) {
            setState((state) => ({ ...state, data: null }));
        }
    }, [lockTime, setState]);

    return (<>
        {(isDesktop) ? <>
            <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.55} ><Timebar
                    lockTime={lockTime}
                    updateLockTime={updateLockTime}
                /></Grid>
                <Grid item xs={3} >
                    <CredentialsList state={props.state} />
                </Grid>
                <Grid item xs={5.5} ><CredentialData /></Grid>
                <Grid item xs={2.95} ></Grid>
            </Grid>
        </> : <>
            Mobile View
        </>}

        {((lockTime.m <= 0) && (lockTime.s <= 0)) && <LockScreen
            state={props.state}
            setState={props.setState}
            updateLockTime={updateLockTime}
            showSnack={props.showSnack}
        />}
    </>);
}

export default Dashboard;