import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { getUserData } from '../api/drive';

import { AppBar, Box, Toolbar, IconButton, Typography, Avatar } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import './Header.css';

const Header = (props) => {
    const history = useHistory();

    const [path, setPath] = useState(history.location.pathname)
    const [user, setUser] = useState({
        name: '',
        email: '',
        image: ''
    });

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

                        <IconButton size="medium" onClick={props.toggleTheme} >
                            {(props.theme === "light") ?
                                <DarkModeIcon style={{ color: "black" }} /> :
                                <LightModeIcon style={{ color: "white" }} />
                            }
                        </IconButton>

                        {(path === "/") ?
                            <IconButton size="medium" onClick={handleLockButtonClick}>
                                <LockOpenIcon style={{ color: "white" }} />
                            </IconButton> :
                            <Avatar alt={user.name} src={user.image} sx={{ width: 25, height: 25, margin: "auto 5px" }} />
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
export default Header;
