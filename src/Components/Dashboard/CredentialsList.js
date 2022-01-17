import { createRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Box, IconButton, InputBase, Typography, Tooltip } from "@mui/material";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function CredentialsList(props) {
    const dispatch = useDispatch();
    let searchRef = createRef(null);
    
    const { selectedCategory, selectedEntryId, drafts, modifiedEntries, templates } = useSelector((state) => state.entries);

    const { addNewEntry } = props
    
    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);
    
    const updateEditModeStatus = useCallback((isEditMode) => dispatch({ type: "updateEditModeStatus", payload: { isEditMode } }), [dispatch]);
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);

    const updateSelectedEntryIndex = useCallback((selectedEntryIndex) => dispatch({ type: "updateSelectedEntryIndex", payload: { selectedEntryIndex } }), [dispatch]);
    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);

    const updateEntryOptionsMode = useCallback((entryOptionsMode) => dispatch({ type: "updateEntryOptionsMode", payload: { entryOptionsMode } }), [dispatch]);

    const [searchString, updateSearchString] = useState('');
    const [entries, updateEntries] = useState({ credentials: [], templates: [] });

    const getEntryIndexById = (credentials, id) => {
        let index = null;
    
        credentials.every((entry, idx) => {
            if (entry.id === id) {
                index = idx;
                return false;
            }
            return true;
        })
    
        return index;
    }

    const handleSelectEntry = (entryData) => {
        updateSelectedEntryId(entryData.id);
        updateEditModeStatus(false);
        updateSelectedFieldIndex(0);
        updateEntryOptionsMode("EntryOptions");
        
        let entryIdx = getEntryIndexById(modifiedEntries, entryData.id);
        updateSelectedEntryIndex(entryIdx);
        updateEntryData({ ...modifiedEntries[entryIdx] })
    }

    useEffect(() => {
        if (modifiedEntries) {
            let credentials = [...modifiedEntries];

            if (selectedCategory === 'All') credentials = [...modifiedEntries];
            else {
                let credentialsByCategory = credentials.filter((item) => item.category === selectedCategory);
                credentials = credentialsByCategory;
            }

            if (searchString !== '') {
                credentials = credentials.filter((item) => item.name.toLowerCase().includes(searchString));
            }

            updateEntries({ credentials, templates });
        }
        else updateEntries({ credentials: [], templates: [] });

    }, [searchString, selectedCategory, modifiedEntries, templates]);

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ display: "flex", padding: "0 5px" }} >
                <Tooltip title="Add">
                    <IconButton
                        size="small"
                        style={{ color: "inherit" }}
                        onClick={addNewEntry}
                    ><AddCircleOutlineRoundedIcon /></IconButton>
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

            <Box style={{ overflowY: "scroll", height: "87vh" }} >
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
                            onClick={() => handleSelectEntry(entry)}
                        >
                            <Typography className="noOverflow" style={{ fontSize: "16px" }} >{entry.name}</Typography>
                            <Box style={{ fontSize: "14px", opacity: 0.9, display: "flex", justifyContent: "space-between" }} >
                                <Typography>@{entry.user}</Typography>
                                {(drafts[entry.id]) ? <>
                                    <Tooltip title="Draft">
                                        <DriveFileRenameOutlineIcon />
                                    </Tooltip>
                                </> : null}
                            </Box>
                        </Box>
                    })
                }
            </Box>
        </Box>
    </>);
}

export default CredentialsList;