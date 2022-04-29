import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { darkTheme, lightTheme } from '../Theme';

import { Grid, Box, Typography, Paper, Tooltip, IconButton } from "@mui/material";

import GitHubIcon from '@mui/icons-material/GitHub';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import KeyIcon from '@mui/icons-material/Key';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import LockClockIcon from '@mui/icons-material/LockClock';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

function Feature(props) {
    const { theme, title, description, Icon } = props
    return (<Grid item xs={3} sx={{ padding: "10px", display: "flex", justifyContent: "center" }} >
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                maxWidth: "280px",
                height: "250px",
                borderRadius: "5px",
                backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                color: "inherit",
                padding: "10px 5px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px"
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#1c88f4c9",
                        borderRadius: "50%",
                        padding: "25px"
                    }}
                >
                    <Icon style={{ fontSize: "40px", color: "white" }} />
                </Box>
            </Box>
            <Typography
                sx={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontWeight: "bold"
                }}
            >{title}</Typography>
            <Typography sx={{ padding: "5px 10px", fontSize: "14px", textAlign: "center" }} >{description}</Typography>
        </Paper>
    </Grid>);
}

function Home() {
    const history = useHistory();
    const isDesktop = window.innerWidth > 760;

    const { theme } = useSelector((state) => ({ ...state.config }));

    return (<>
        {(isDesktop) ? <>
            <Box sx={{ height: "40vw" }} >
                <Grid container sx={{ position: "relative" }} >
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                padding: "60px 60px"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "25px"
                                }}
                            >GSecureLock</Typography>
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    opacity: 0.76
                                }}
                            >A Secure password Manager</Typography>
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    margin: "10px 0",
                                    textAlign: "justify"
                                }}
                            >
                                An open source application for managing your Passwords, Cards, Coupons, API Keys at one place. Your entries will be saved in your own Google Drive - App Data.
                            </Typography>

                            <Box sx={{ marginLeft: "-8px" }} >
                                <Tooltip title="Github" arrow>
                                    <IconButton href="https://github.com/dinesh99639/GSecureLock" target="_blank"><GitHubIcon sx={{ color: (theme === "dark") ? "rgba(255, 255, 255, 0.76)" : "" }} /></IconButton>
                                </Tooltip>
                                <Tooltip title="Changelog" arrow>
                                    <IconButton href="https://github.com/dinesh99639/GSecureLock" target="_blank"><ChangeHistoryIcon sx={{ color: (theme === "dark") ? "rgba(255, 255, 255, 0.76)" : "" }} /></IconButton>
                                </Tooltip>
                                <Tooltip title="Donations" arrow>
                                    <IconButton href="https://github.com/dinesh99639/GSecureLock" target="_blank"><VolunteerActivismIcon sx={{ color: (theme === "dark") ? "rgba(255, 255, 255, 0.76)" : "" }} /></IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "20px"
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : lightTheme.backgroundColor,
                                    color: "inherit",
                                    height: "250px",
                                    width: "430px",
                                    borderRadius: "5px"
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        height: "22px",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <Box sx={{
                                        backgroundColor: (theme === "dark") ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                                        position: "absolute",
                                        height: "100%",
                                        width: "100%",
                                        zIndex: -1
                                    }} ></Box>

                                    <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "red", margin: "auto 5px" }} ></Box>
                                    <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "#ffc400", margin: "auto 5px" }} ></Box>
                                    <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "#00fe00", margin: "auto 5px" }} ></Box>
                                </Box>
                                <Box
                                    sx={{
                                        height: "93%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <img
                                        src={"/logo.svg"}
                                        alt="logo"
                                        style={{
                                            width: "70px",
                                            filter: (theme === "dark") ? "brightness(10000%)" : "brightness(0%)"
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            margin: "10px 0",
                                            fontSize: "18px"
                                        }}
                                    >GSecureLock</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>

                <Box>
                    <Typography sx={{ textAlign: "center", fontSize: "18px", margin: "15px 0 0 0" }} >Features</Typography>
                    <Grid container sx={{ padding: "0 10px", display: "flex", justifyContent: "center" }} >
                        <Feature theme={theme} Icon={KeyIcon} title="Master Password" description="One password to access all your accounts" />
                        <Feature theme={theme} Icon={ImportExportIcon} title="Import" description="Import your entries with/without encryption from the previous exports" />
                        <Feature theme={theme} Icon={ImportExportIcon} title="Export" description="Export your entries with/without encryption" />
                        <Feature theme={theme} Icon={HorizontalSplitIcon} title="Manage Templates" description="Create templates from existing entries and reuse for creating new entries" />
                        <Feature theme={theme} Icon={LockClockIcon} title="Session Autolock" description="The session locks automatically after a specified time" />
                        <Feature theme={theme} Icon={AutoAwesomeMotionIcon} title="Card Themes" description="Set your favourite theme for credit/debit cards" />
                    </Grid>
                </Box>

                <Box>
                    <Typography sx={{ textAlign: "center", fontSize: "18px", margin: "15px 0 0 0" }} >Contributers</Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "14px", margin: "15px 0 0 0" }} >List of contributers will appear here.<br />Contributions are most welcome.</Typography>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        sx={{
                            margin: "10px 0 0 0",
                            fontSize: "13px",
                            textAlign: "center",
                            cursor: "pointer",

                            "&&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                        onClick={() => history.push('/privacy_policy')}
                    >Privacy Policy</Typography>
                </Box>
                <Box sx={{ padding: "20px 0" }} ></Box>
            </Box>
        </> : <>
            Mobile version of the app will be launched soon
        </>}
    </>);
}

export default Home;