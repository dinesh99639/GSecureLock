import { createRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { darkTheme } from '../../Theme';
import crypto from '../../Utils/crypto';
import initData from '../../initData';

import { Box, IconButton, InputBase, Typography, Tooltip, Modal, Paper, Button } from "@mui/material";

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function CredentialsList(props) {
    const dispatch = useDispatch();
    let searchRef = createRef(null);

    const { password, dataFileId } = useSelector((state) => state.localStore);
    const { theme } = useSelector((state) => state.config);
    const { selectedCategory, selectedEntryId, drafts, modifiedEntries, templates, savedEntries, isTemplateMode } = useSelector((state) => state.entries);

    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);
    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);
    const updateSavedEntries = useCallback((savedEntries) => dispatch({ type: "updateSavedEntries", payload: { savedEntries } }), [dispatch]);
    const updateModifiedEntries = useCallback((modifiedEntries) => dispatch({ type: "updateModifiedEntries", payload: { modifiedEntries } }), [dispatch]);
    const updateNewEntryId = useCallback((newEntryId) => dispatch({ type: "updateNewEntryId", payload: { newEntryId } }), [dispatch]);

    const updateSelectedCategory = useCallback((selectedCategory) => dispatch({ type: "updateSelectedCategory", payload: { selectedCategory } }), [dispatch]);

    const updateEditModeStatus = useCallback((isEditMode) => dispatch({ type: "updateEditModeStatus", payload: { isEditMode } }), [dispatch]);
    const updateIsTemplateMode = useCallback((isTemplateMode) => dispatch({ type: "updateIsTemplateMode", payload: { isTemplateMode } }), [dispatch]);

    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);

    const updateSelectedEntryIndex = useCallback((selectedEntryIndex) => dispatch({ type: "updateSelectedEntryIndex", payload: { selectedEntryIndex } }), [dispatch]);
    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);

    const updateEntryOptionsMode = useCallback((entryOptionsMode) => dispatch({ type: "updateEntryOptionsMode", payload: { entryOptionsMode } }), [dispatch]);

    const updateTemplates = useCallback((templates) => dispatch({ type: "updateTemplates", payload: { templates } }), [dispatch]);

    const [searchString, updateSearchString] = useState('');
    const [entries, updateEntries] = useState([]);

    const toggleTemplateMode = () => {
        updateIsTemplateMode(!isTemplateMode);
        updateSelectedCategory("All");
    }
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
        if (isTemplateMode) {
            addNewEntry(entryData);
            toggleTemplateMode()
        }
        else {
            updateSelectedEntryId(entryData.id);
            updateSelectedFieldIndex(0);
            updateEntryOptionsMode("EntryOptions");
            updateEditModeStatus(false);

            let entryIdx = getEntryIndexById(modifiedEntries, entryData.id);
            updateEntryData({ ...modifiedEntries[entryIdx] })
            updateSelectedEntryIndex(entryIdx);
        }

    }

    const addNewEntry = (newEntryData) => {
        let id = "C" + new Date().getTime();

        if (!newEntryData) {
            newEntryData = {
                id,
                user: "",
                name: "Untitled",
                category: (selectedCategory === "All") ? "Passwords" : selectedCategory,
                data: (selectedCategory === "Cards") ? initData.cardData : [],

                createdAt: new Date().toString().substring(0, 24),
                lastModifiedAt: new Date().toString().substring(0, 24)
            }
            if (selectedCategory === "Cards") newEntryData.cardTheme = "purePurple";
        }
        else {
            newEntryData.id = id;
            newEntryData.createdAt = new Date().toString().substring(0, 24);
            newEntryData.lastModifiedAt = new Date().toString().substring(0, 24);
        }

        updateSavedEntries([...savedEntries, newEntryData]);
        updateModifiedEntries([...modifiedEntries, newEntryData]);

        updateSelectedEntryIndex(modifiedEntries.length)
        updateEntryData(newEntryData);
        updateNewEntryId(id);
        updateSelectedEntryId(id);
        updateEditModeStatus(true);
    }

    const [deleteConfirmModal, updateDeleteConfirmModal] = useState({
        open: false,
        entryName: "",
        callback: null
    });
    const openDeleteConfirmationModal = (id, name) => {
        updateDeleteConfirmModal({
            open: true,
            id,
            name
        })
    }
    const closeDeleteConfirmationModal = () => {
        updateDeleteConfirmModal({
            open: false,
            entryName: "",
            callback: null
        })
    }

    const deleteTemplate = () => {
        let newTemplates = [];

        for (let i in templates) {
            if (templates[i].id !== deleteConfirmModal.id) {
                newTemplates.push({ ...templates[i] })
            }
        }
        updateTemplates(newTemplates);

        let encryptedData = crypto.encrypt(JSON.stringify({ 
            lastModifiedAt: new Date().toString().substring(0, 24),
            templates: newTemplates, 
            credentials: savedEntries 
        }), password);
        
        updateLocalStore({ dataFileId, encryptedData });
        localStorage.setItem("encryptedData", encryptedData);

        closeDeleteConfirmationModal()
    }

    useEffect(() => {
        if (modifiedEntries || templates) {
            let entries = [];

            if (isTemplateMode) entries = [...templates];
            else entries = [...modifiedEntries];

            if (selectedCategory !== 'All') {
                let credentialsByCategory = entries.filter((item) => item.category === selectedCategory);
                entries = credentialsByCategory;
            }

            if (searchString !== '') {
                entries = entries.filter((item) => item.name.toLowerCase().includes(searchString));
            }

            updateEntries(entries);
        }
        else updateEntries([]);
    }, [isTemplateMode, searchString, selectedCategory, modifiedEntries, templates]);

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ display: "flex", padding: "0 5px" }} >
                <Tooltip title="Add">
                    <IconButton
                        size="small"
                        style={{ color: "inherit" }}
                        onClick={() => addNewEntry()}
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
                    <IconButton
                        size="small"
                        style={{ color: "inherit" }}
                        onClick={toggleTemplateMode}
                    ><HorizontalSplitIcon /></IconButton>
                </Tooltip>
            </Box>
            <Box className="borderBottom" style={{ textAlign: "center", padding: "5px 0" }} >
                {(isTemplateMode) ? "Templates" : "Entries"}
            </Box>
            <Box style={{ overflowY: "auto", height: "83vh" }} >
                {
                    entries.map((entry, index) => {
                        return <Box
                            key={entry.id}
                            className="borderBottom"
                            style={{
                                display: "flex",
                                margin: "0 2px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                backgroundColor: (selectedEntryId === entry.id) ? "rgb(0, 136, 253)" : null,
                                color: (selectedEntryId === entry.id) ? "white" : "inherit",
                            }}
                        >
                            <Box
                                style={{ flex: 1, padding: "5px 10px" }}
                                onClick={() => handleSelectEntry(entry)}
                            >
                                <Typography className="noOverflow" style={{ fontSize: "16px" }} >{entry.name}</Typography>
                                <Box style={{ fontSize: "14px", opacity: 0.76, display: "flex", justifyContent: "space-between" }} >
                                    <Typography>{(isTemplateMode) ? "Template" : "@" + entry.user}</Typography>
                                    {(drafts[entry.id]) ? <>
                                        <Tooltip title="Draft">
                                            <DriveFileRenameOutlineIcon />
                                        </Tooltip>
                                    </> : null}
                                </Box>
                            </Box>
                            {(isTemplateMode) ? <>
                                <IconButton
                                    size="small"
                                    disableRipple={true}
                                    sx={{
                                        color: "inherit",
                                        padding: "5px 10px 5px 5px",
                                        "&:hover": { color: "red" }
                                    }}
                                    onClick={() => openDeleteConfirmationModal(entry.id, entry.name)}
                                ><DeleteOutlinedIcon /></IconButton>
                            </> : null}

                        </Box>
                    })
                }
            </Box>
        </Box>

        <Modal
            open={deleteConfirmModal.open}
            onClose={closeDeleteConfirmationModal}
        >
            <Paper
                elevation={5}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : "",
                    color: "inherit",
                    outline: "none",
                    borderRadius: "7px",
                    padding: "5px"

                }}
            >
                <Typography style={{ textAlign: "center" }} >
                    Confirm
                </Typography>
                <Typography style={{ textAlign: "center", margin: "10px" }} >
                    Are you sure you want to delete this "{deleteConfirmModal.name}" template?
                </Typography>
                <Box style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }} >
                    <Button
                        variant="contained"
                        style={{
                            fontSize: "14px",
                            padding: "3px 0",
                            width: "100px",
                            textTransform: 'none'
                        }}
                        onClick={closeDeleteConfirmationModal}
                    >Cancel</Button>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "red",
                            fontSize: "14px",
                            padding: "3px 0",
                            width: "100px",
                            textTransform: 'none'
                        }}
                        onClick={() => deleteTemplate()}
                    >Confirm</Button>
                </Box>
            </Paper>
        </Modal>
    </>);
}

export default CredentialsList;