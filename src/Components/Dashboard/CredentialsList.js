import { createRef, useEffect, useState } from "react";

import { Box, IconButton, InputBase, Typography, Tooltip } from "@mui/material";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

function CredentialsList(props) {
    let searchRef = createRef(null);
    const { selectedCategory, selectedEntryId, updateSelectedEntryId, updateSelectedEntryIndex } = props

    const [searchString, updateSearchString] = useState('');
    const [entries, updateEntries] = useState({ credentials: [], templates: [] });

    useEffect(() => {
        let data = props.state.data;
        
        if (data) {
            let credentials = data.credentials;

            if (searchString !== '') {
                credentials = credentials.filter((item) => item.name.toLowerCase().includes(searchString));
            }
            
            if (selectedCategory === 'All') updateEntries({ credentials, templates: data.templates });
            else {
                let credentialsByCategory = credentials.filter((item) => item.category === selectedCategory);
                updateEntries({ credentials: credentialsByCategory, templates: data.templates });
            }
        }
        else updateEntries({ credentials: [], templates: [] });

    }, [searchString, selectedCategory, props.state]);

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ display: "flex", padding: "0 5px" }} >
                <Tooltip title="Add">
                    <IconButton size="small" style={{ color: "inherit" }} ><AddCircleOutlineRoundedIcon /></IconButton>
                </Tooltip>
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
                        onChange={(e) => updateSearchString(e.target.value.trim().toLowerCase())}
                    />
                </Box>

                <Tooltip title="Templates">
                    <IconButton size="small" style={{ color: "inherit" }} ><HorizontalSplitIcon /></IconButton>
                </Tooltip>
            </Box>

            <Box>
                {
                    entries.credentials.map((entry, index) => {
                        return <Box
                            key={entry.id}
                            className="borderBottom"
                            style={{
                                margin: "0 2px",
                                padding: "5px 10px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                backgroundColor: (selectedEntryId === entry.id) ? "rgb(0, 136, 253)" : null,
                                color: (selectedEntryId === entry.id) ? "white" : "inherit",
                            }}
                            onClick={() => {
                                updateSelectedEntryId(entry.id);
                                updateSelectedEntryIndex(index);
                            }}
                        >
                            <Typography style={{ fontSize: "16px" }} >{entry.name}</Typography>
                            <Typography style={{ fontSize: "14px", opacity: 0.9 }} >@{entry.user}</Typography>
                        </Box>
                    })
                }
            </Box>
        </Box>
    </>);
}

export default CredentialsList;