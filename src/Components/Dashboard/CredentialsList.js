import { createRef, useEffect } from "react";

import { Box, IconButton, InputBase, Typography } from "@mui/material";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

function CredentialsList(props) {
    let searchRef = createRef(null);

    useEffect(() => {
        console.log(props.state.data)
    }, [props.state.data])

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ display: "flex", padding: "0 5px" }} >
                <IconButton size="small" style={{ color: "inherit" }} ><AddCircleOutlineRoundedIcon /></IconButton>
                <Box className="searchBox" style={{ display: "flex", flex: 1, borderRadius: "4px" }} >
                    <IconButton 
                        size="small" 
                        style={{ color: "inherit", padding: "0 0 0 5px" }} 
                        onClick={() => searchRef.current.click()}
                    ><SearchOutlinedIcon /></IconButton>
                    <InputBase
                        ref={searchRef}
                        placeholder="Search"
                        sx={{ ml: 1, flex: 1, color: "inherit" }}
                    />
                </Box>
                <IconButton size="small" style={{ color: "inherit" }} ><FilterAltOutlinedIcon /></IconButton>
            </Box>

            <Box className="borderBottom" style={{ textAlign: "center", padding: "5px 0" }} >Credentials</Box>
            
            <Box>
                <Box className="borderBottom" style={{ padding: "5px 10px", cursor: "pointer" }} >
                    <Typography style={{ fontSize: "16px" }} >Name</Typography>
                    <Typography style={{ fontSize: "14px", opacity: 0.9 }} >@user</Typography>
                </Box>
            </Box>
        </Box>
    </>);
}

export default CredentialsList;