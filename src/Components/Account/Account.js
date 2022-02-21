import { useState } from "react";
import { useRouteMatch, Route, Switch, useHistory } from 'react-router-dom';

import Profile from "./Profile";
import ImportExport from "./importExport";
import ChangePassword from "./ChangePassword";

import { Box, Divider, Grid, Typography } from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Account(props) {
    const history = useHistory();
    let { path, url } = useRouteMatch();
    
    const [selectedOption, updateSelectedOption] = useState(history.location.pathname.split("/").at(-1));

    const changeOption = (to) => {
        updateSelectedOption(to);
        history.push(`${url}/${to}`);
    }

    const sidebarOptions = [
        { name: "Profile", icon: <AccountCircleIcon fontSize="small" />, to: "profile", component: <Profile /> },
        { name: "Import/Export", icon: <ImportExportIcon fontSize="small" />, to: "importExport", component: <ImportExport /> },
        { name: "Change Password", icon: <VpnKeyIcon fontSize="small" />, to: "changePassword", component: <ChangePassword /> },
        { name: "Remove Account", icon: <PersonRemoveIcon fontSize="small" />, to: "removeAccount", component: <Profile /> }
    ]

    const goToDashboard = () => history.push("/dashboard");

    return (<>
        <Box style={{ display: "flex", flex: 1 }} >
            <Grid container>
                <Grid item xs={3} className="borderRight" style={{ height: "100%", padding: "0 0 0 20px" }} >
                    <Box
                        sx={{
                            display: "flex",
                            cursor: "pointer",
                            margin: "15px 0 15px 0"
                        }}
                        onClick={goToDashboard}
                    >
                        <ArrowBackIcon />
                        <Typography style={{ marginLeft: "5px" }} >Dashboard</Typography>
                    </Box>

                    <Divider color="gray" style={{ marginBottom: "5px" }} />

                    {
                        sidebarOptions.map((option) => {
                            return <Box
                                key={option.name}
                                className="borderBottom0"
                                sx={{
                                    padding: "5px 0",
                                    display: "flex",
                                    cursor: "pointer",

                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.1)"
                                    }
                                }}
                                onClick={() => changeOption(option.to)}
                            >
                                <Box
                                    style={{
                                        borderLeft: "5px solid " + ((option.to === selectedOption) ? "rgb(0, 136, 253)" : "rgba(0, 0, 0, 0)"),
                                        padding: "4px 0",
                                    }}
                                >
                                    <Box
                                        style={{
                                            padding: "0 0 0 5px",
                                            display: "flex"
                                        }}
                                    >
                                        {option.icon}
                                        <Typography sx={{
                                            fontSize: "15px",
                                            marginLeft: "7px"
                                        }} >{option.name}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        })
                    }
                </Grid>
                <Grid item xs={9}>
                    <Switch>
                        {sidebarOptions.map((option) => <Route key={option.to} path={`${path}/${option.to}`} >{option.component}</Route>)}
                    </Switch>
                </Grid>
            </Grid>
        </Box>
    </>);
}

export default Account;