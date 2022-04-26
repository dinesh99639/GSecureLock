import { useEffect, useState, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { darkTheme } from '../Theme';
import { GApiContext } from "../api/GApiProvider";


import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = (props) => {
    const gapi = useContext(GApiContext);
    const history = useHistory();

    const dispatch = useDispatch();

    const { theme, user, isLoggedIn } = useSelector((state) => state.config);
    const { encryptedData } = useSelector((state) => state.localStore);

    const setTheme = useCallback((theme) => dispatch({ type: "setTheme", payload: { theme } }), [dispatch]);
    const setUser = useCallback((user) => dispatch({ type: "setUser", payload: { user } }), [dispatch]);

    const updateLoadingStatus = useCallback((isLoading) => dispatch({ type: "updateLoadingStatus", payload: { isLoading } }), [dispatch]);
    const showBackdrop = useCallback(() => updateLoadingStatus(true), [updateLoadingStatus]);
    const hideBackdrop = useCallback(() => updateLoadingStatus(false), [updateLoadingStatus]);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);
    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const openAccountMenu = (event) => setAccountAnchorEl(event.currentTarget);
    const closeAccountMenu = () => setAccountAnchorEl(null);

    const [path, setPath] = useState(history.location.pathname);

    const toggleTheme = () => {
        let newTheme = (theme === "light") ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    const handleHomeButtonClick = () => {
        history.push("/");
        setPath("/");
    }

    const handleOnLogin = async () => {
        showBackdrop();

        let dataFileId = null;
        let encryptedData = '';

        let res = await gapi.getAllFiles();

        if (res.success) {
            if (res.data.files.length === 0) {
                res = await gapi.createFile()
                res = { data: { files: [{ id: res.data.id }] } }
            }
            dataFileId = res.data.files[0].id;

            localStorage.setItem('dataFileId', dataFileId);

            res = await gapi.downloadFile(dataFileId);
            encryptedData = res.data;

            updateLoginStatus(true);
            updateLocalStore({ dataFileId, encryptedData });
            localStorage.setItem('encryptedData', encryptedData);

            if (!encryptedData) history.push("/setup_account");
            else history.push("/dashboard");
        }
        else {
            showSnack("error", "Unable to get data, please refresh");
        }

        hideBackdrop();
        return true;
    }

    const logout = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        updateLoginStatus(false);
        updateLocalStore({ dataFileId: '', encryptedData: '' });

        closeAccountMenu();
        setUser({ name: '', email: '', image: '' })

        localStorage.removeItem("dataFileId");
        localStorage.removeItem("encryptedData");
        localStorage.removeItem("userData");

        history.replace("/");
        setPath('/');
    }

    const handleLockButtonClick = async () => {
        const gotoDashboard = () => {
            history.push("/dashboard");
            setPath("/dashboard");
        }

        if (isLoggedIn) gotoDashboard();
        else gapi.getAccessToken()
    }

    const openAccountSettings = () => {
        history.push("/account/profile");
        closeAccountMenu();
    }

    const openGithubProject = () => {
        window.open('https://github.com/dinesh99639/GSecureLock');
    }

    useEffect(() => {
        const loadUserData = async () => {
            let userData = {
                name: "",
                email: "",
                image: ""
            };

            if (isLoggedIn) {
                userData = localStorage.getItem('userData');

                if (userData) {
                    userData = JSON.parse(userData);
                }
                else {
                    let res = await gapi.getUserData();

                    userData = {
                        name: res.data.user.displayName,
                        email: res.data.user.emailAddress,
                        image: res.data.user.photoLink
                    }

                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }

            setUser(userData);
        }
        loadUserData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, setUser]);

    useEffect(() => {
        if (!encryptedData && gapi.accessTokenCount) handleOnLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encryptedData, gapi.accessTokenCount]);

    useEffect(() => {
        let theme = localStorage.getItem('theme');

        if (theme === null) theme = 'light';
        setTheme(theme);
    }, [setTheme]);

    return (
        <Box>
            <AppBar position="static" className="main-header" >
                <Toolbar style={{ minHeight: "5vh" }} >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box style={{ marginRight: "auto", display: "flex" }}>
                        <img
                            src={"/logo.svg"}
                            alt="logo"
                            style={{
                                height: "30px",
                                margin: "0 5px 0 0",
                                filter: "brightness(10000%)"
                            }}
                        />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ cursor: "pointer", width: "auto" }}
                            onClick={handleHomeButtonClick}
                        >GSecureLock</Typography>
                    </Box>

                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Link to="/test" style={{ color: "white" }}>Test</Link>

                        <IconButton size="medium" onClick={toggleTheme} >
                            {(theme === "light") ?
                                <NightlightRoundIcon style={{ color: "white", fontSize: "20px", transform: "rotate(-45deg)" }} /> :
                                <LightModeIcon style={{ color: "white" }} />
                            }
                        </IconButton>

                        {(path === "/") ? <>
                            <IconButton size="medium" onClick={handleLockButtonClick}>
                                <AccountCircleIcon style={{ color: "white" }} />
                            </IconButton>
                        </> : <>
                            <IconButton
                                aria-controls="menu-appbar"
                                onClick={openAccountMenu}
                            >
                                <Avatar alt={user.name} src={user.image} sx={{ width: 25, height: 25, margin: "auto 5px", fontSize: "15px", backgroundColor: "rgba(0, 0, 0, 0.2)" }} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                sx={{
                                    "& .MuiMenu-paper": {
                                        width: "200px",
                                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : "white",
                                        color: "inherit"
                                    }
                                }}
                                anchorEl={accountAnchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(accountAnchorEl)}
                                onClose={closeAccountMenu}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}
                                >
                                    <Avatar alt={user.name} src={user.image} sx={{ width: 76, height: 76, margin: "auto 5px", fontSize: "30px", backgroundColor: "rgba(0, 0, 0, 0.2)" }} />
                                    <Typography sx={{ fontSize: "15px", margin: "5px 0 0 0", textAlign: "center" }} >{user.name}</Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            opacity: 0.76,
                                            textAlign: "center"
                                        }}
                                    >@{user.email.split("@")[0]}</Typography>
                                </Box>
                                <Divider sx={{ backgroundColor: "inehrit", width: "100%", margin: "3px" }} />
                                <MenuItem onClick={openAccountSettings}>
                                    <AccountCircleIcon fontSize='small' />
                                    <Typography sx={{ padding: "0 0 0 7px", fontSize: "14px" }} >Account</Typography>
                                </MenuItem>
                                <MenuItem onClick={logout}>
                                    <LogoutIcon fontSize='small' />
                                    <Typography sx={{ padding: "0 0 0 7px", fontSize: "14px" }} >Sign out</Typography>
                                </MenuItem>

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
                                    onClick={openGithubProject}
                                >Github Project</Typography>
                            </Menu>
                        </>}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
export default Header;
