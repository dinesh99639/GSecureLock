import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { darkTheme } from '../Theme';
import { getUserData } from '../api/drive';

import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = (props) => {
    const history = useHistory();

    const dispatch = useDispatch();

    const theme = useSelector((state) => state.config.theme);
    const setTheme = useCallback((theme) => dispatch({ type: "setTheme", payload: { theme } }), [dispatch]);
    // const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);

    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const openAccountMenu = (event) => setAccountAnchorEl(event.currentTarget);
    const closeAccountMenu = () => setAccountAnchorEl(null);

    const [path, setPath] = useState(history.location.pathname)
    const [user, setUser] = useState({
        name: '',
        email: '',
        image: ''
    });

    const toggleTheme = () => {
        let changedTheme = (theme === "light") ? "dark" : "light";
        setTheme(changedTheme)
        localStorage.setItem("theme", changedTheme);
    }

    const handleHomeButtonClick = () => {
        history.push("/");
        setPath("/");
    }

    const handleLockButtonClick = async () => {
        let redirectToDashboard = true;

        if (!props.auth.isLoggedIn) {
            await props.auth.login();

            if (localStorage.getItem('encryptedData').length === 0) {
                history.push("/setup_account");
                redirectToDashboard = false;
            }
        }

        if (redirectToDashboard) {
            history.push("/dashboard");
            setPath("/dashboard");
        }
    }

    const openAccountSettings = () => {
        history.push("/account");
        closeAccountMenu();
    }

    const logout = () => {
        // - Signout from google account
        history.replace("/");
        closeAccountMenu();
        setUser({ name: '', email: '', image: '' })
        // updateLoginStatus(false);
        setPath('/');

        localStorage.removeItem("dataFileId");
        localStorage.removeItem("encryptedData");
        localStorage.removeItem("userData");
    }
    
    const openGithubProject = () => {
        window.open('https://github.com/dinesh99639/GSecurePass');
    }

    useEffect(() => {
        const loadUserData = async () => {
            let userData = {
                name: "",
                email: "",
                image: ""
            };

            if (props.auth.isLoggedIn) {
                userData = localStorage.getItem('userData');

                if (userData) {
                    userData = JSON.parse(userData);
                }
                else {
                    let res = await getUserData();

                    userData = {
                        name: res.user.displayName,
                        email: res.user.emailAddress,
                        image: res.user.photoLink
                    }

                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }

            setUser(userData);
        }
        loadUserData();
    }, [props.auth.isLoggedIn]);

    useEffect(() => {
        let theme = localStorage.getItem('theme');

        if (theme === null) {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
        else if (theme === "light") setTheme('light');
        else if (theme === "dark") setTheme('dark');
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

                    <Box style={{ marginRight: "auto" }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ cursor: "pointer", width: "auto" }}
                            onClick={handleHomeButtonClick}
                        >GSecurePass</Typography>
                    </Box>

                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Link to="/test" style={{ color: "white" }}>Test</Link>

                        <IconButton size="medium" onClick={toggleTheme} >
                            {(theme === "light") ?
                                <DarkModeIcon style={{ color: "black" }} /> :
                                <LightModeIcon style={{ color: "white" }} />
                            }
                        </IconButton>

                        {(path === "/") ? <>
                            <IconButton size="medium" onClick={handleLockButtonClick}>
                                <LockOpenIcon style={{ color: "white" }} />
                            </IconButton>
                        </> : <>
                            <IconButton
                                aria-controls="menu-appbar"
                                onClick={openAccountMenu}
                            >
                                <Avatar alt={user.name} src={user.image} sx={{ width: 25, height: 25, margin: "auto 5px" }} />
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
                                    <Avatar alt={user.name} src={user.image} sx={{ width: 76, height: 76, margin: "auto 5px" }} />
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
