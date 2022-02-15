import { createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Box, Avatar, Typography } from "@mui/material";

function Profile() {
    const { user, theme } = useSelector((state) => state.config);

    return (<>
        <Box
            sx={{
                margin: "20px 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Avatar alt={user.name} src={user.image} sx={{ width: 90, height: 90, margin: "auto 5px", fontSize: "30px", backgroundColor: "rgba(0, 0, 0, 0.2)" }} />
            <Typography sx={{ fontSize: "15px", margin: "5px 0 0 0", textAlign: "center" }} >{user.name}</Typography>
            <Typography
                sx={{
                    fontSize: "12px",
                    opacity: 0.76,
                    textAlign: "center"
                }}
            >@{user.email.split("@")[0]}</Typography>
        </Box>

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                margin: "50px 20px 0 0"
            }}
        >
            <Typography style={{ padding: "0 20px", fontWeight: "bold" }} >Tips</Typography>
            <ul style={{ margin: "10px 10px", display: "flex", flexDirection: "column", gap: "10px" }} >
                <li>Always use the strong and long password to protect your credentials from bruteforce attacks.</li>
                <li>Keep changing your important credentials at frequent intervals.</li>
                <li>Keep a watch on the users who have access to your system, because stealing your cookies and localstorage will grant access to many of your accounts.</li>
            </ul>

            <Typography style={{ padding: "0 20px", fontWeight: "bold", marginTop: "10px" }} >About this application</Typography>
            <ul style={{ margin: "10px 10px", display: "flex", flexDirection: "column", gap: "10px" }} >
                <li>This application only uses your google drive appdata to save your credentials.</li>
                <li>This application will not send any of your data to anyone in any form.</li>
                <li>There is a puzzle in the source code, you can give it a try. You can give your answer to that puzzle in github issues.</li>
            </ul>
        </Box>
    </>);
}

export default Profile;