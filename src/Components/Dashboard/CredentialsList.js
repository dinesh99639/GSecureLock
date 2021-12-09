import { createRef, useEffect, useState } from "react";

import { Box, IconButton, InputBase, Typography } from "@mui/material";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

function CredentialsList(props) {
    let searchRef = createRef(null);
    const { selectedCategory, filteredEntries, updateFilteredEntries, selectedEntryId, updateSelectedEntryId } = props

    const [entries, updateEntries] = useState({ credentials: [], templates: [] });

    // useEffect(() => {
    //     if (filteredEntries.length) {

    //     }
    //     else {
    //         let data = props.state.data;

    //         if (data) updateEntries({ credentials: data.credentials, templates: data.templates });
    //         else updateEntries({ credentials: [], templates: [] })
    //     }
    // }, [filteredEntries, props.state.data]);

    useEffect(() => {
        let data = props.state.data;

        if (data) {
            if (selectedCategory === 'All') updateEntries({ credentials: data.credentials, templates: data.templates });
            else {
                let credentials = data.credentials.filter((item) => item.category === selectedCategory);
                updateEntries({ credentials, templates: data.templates });
            }
        }
        else updateEntries({ credentials: [], templates: [] })
    }, [selectedCategory, props.state.data]);

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

            <Box>
                {
                    entries.credentials.map((entry) => {
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
                            onClick={() => updateSelectedEntryId(entry.id)}
                        >
                            <Typography style={{ fontSize: "16px" }} >{entry.name}</Typography>
                            <Typography style={{ fontSize: "14px", opacity: 0.9 }} >@{entry.data.user}</Typography>
                        </Box>
                    })
                }
            </Box>
        </Box>
    </>);
}

export default CredentialsList;