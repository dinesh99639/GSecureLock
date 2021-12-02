import { Grid } from '@mui/material';

import crypto from '../../Utils/crypto';

import Timebar from './Timebar';
import CredentialsList from './CredentialsList';
import CredentialData from './CredentialData';

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;

    var hw = crypto.encrypt("Welcome to Tutorials Point...", "gsecurepass")
    // console.log("E:", hw)
    console.log("D:", crypto.decrypt(hw, "gsecurepass"))

    return (<>
        {(isDesktop) ? <>
            <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.55} ><Timebar /></Grid>
                <Grid item xs={3} ><CredentialsList /></Grid>
                <Grid item xs={5.5} ><CredentialData /></Grid>
                <Grid item xs={2.95} ></Grid>
            </Grid>
        </> : <>
            Mobile View
        </>}
        
        {/* <div className="unlock" style={{ position: "absolute", top: "6.5vh", width: "100%", height: "93.5vh" }} ></div> */}
    </>);
}

export default Dashboard;