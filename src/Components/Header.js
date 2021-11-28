import { useEffect, useState } from 'react';

import { getUserData } from '../api/drive';

import { AppBar, Box, Toolbar, IconButton, Typography, Avatar } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import './Header.css';

const Header = (props) => {
    let [user, setUser] = useState({
        name: '',
        email: '',
        image: ''
    });

    useEffect(() => {
        const init = async () => {
            let res = await getUserData();

            setUser({
                name: res.user.displayName,
                email: res.user.emailAddress,
                image: res.user.photoLink
            });
        }
        init();
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className="main-header" >
                <Toolbar style={{ minHeight: 36 }} >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >GRISP</Typography>

                    <Box style={{ display: "flex" }}>
                        <IconButton size="large" onClick={props.toggleTheme} >
                            {(props.theme === "light")?
                                <DarkModeIcon style={{ margin: "0 10px" }} />:
                                <LightModeIcon style={{ margin: "0 10px", color: "white" }} />
                            }
                            
                        </IconButton>
                        <Avatar alt={user.name} src={user.image} sx={{ width: 30, height: 30, margin: "auto" }} />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
export default Header;
