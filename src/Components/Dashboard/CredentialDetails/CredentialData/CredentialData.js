import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';

import crypto from '../../../../Utils/crypto';
import { darkTheme } from '../../../../Theme';
import initData from '../../../../initData';

import EditCard from './EditMode/EditCard';
import EditEntry from './EditMode/EditEntry';

import ViewCard from './ViewMode/ViewCard';
import ViewEntry from './ViewMode/ViewEntry';

import { makeStyles } from "@mui/styles";
import { Box, IconButton, TextField, Typography, Autocomplete, Paper, Grid, Tooltip, Modal, Button } from "@mui/material";

import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


const useInputStyles = makeStyles({
    root: {
        borderBottom: "1px solid white"
    },
    input: {
        color: "inherit"
    },
    inputLabelNoShrink: {
        transform: "translate(5px, -3px) scale(0.8)"
    }
});

const useTableStyling = makeStyles({
    table: {
        width: "100%"
    },
    tableRow: {
        width: "100%"
    },
    tableCell: {
        padding: "5px 8px",
        color: "inherit",
        borderBottom: "0"
    }
});

const autoCompleteStyles = makeStyles((theme) => ({
    inputRoot: {
        color: "inherit",
        backgroundColor: "inherit",
    },
    clearIndicator: {
        color: "inherit"
    }
}));

function Input(props) {
    const classes = useInputStyles();

    return <TextField
        variant="standard"
        {...props}
        className={classes.root}
        InputLabelProps={{
            shrink: false,
            style: { color: 'inherit' },
            className: classes.inputLabelNoShrink
        }}
    />
}

function SelectCategory({ name, categories, entryData, onChange, theme }) {
    const classes = autoCompleteStyles();

    const handleChange = (e, type) => {
        let value = ""
        if (e.target.innerHTML[0] !== "<") {
            value = (type === "list") ? e.target.innerHTML : e.target.value;
        }

        onChange({
            target: {
                name: "category",
                value
            }
        });
    }

    return <Autocomplete
        options={Object.keys(categories)}
        freeSolo={true}
        value={entryData.category}
        name="category"
        classes={classes}
        onChange={(e) => handleChange(e, "list")}
        PaperComponent={({ children }) => (
            <Paper style={{ backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : null, color: "inherit" }}>{children}</Paper>
        )}
        renderInput={(params) => <Input
            name="category"
            label="Category"
            onChange={(e) => handleChange(e, "input")}
            {...params}
            inputProps={{ ...params.inputProps, style: { padding: "0 5px" } }}
        />}
    />
}

function CredentialData(props) {
    const dispatch = useDispatch();

    const classes = useInputStyles();
    const tableStyles = useTableStyling();

    const { theme } = useSelector((state) => state.config);
    const { password, dataFileId } = useSelector((state) => state.localStore);
    const { isEditMode, categories, drafts, entryData, savedEntries, modifiedEntries, selectedEntryIndex, entriesById, selectedEntryId, templates, categoriesCount } = useSelector((state) => state.entries);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const updateEditModeStatus = useCallback((isEditMode) => dispatch({ type: "updateEditModeStatus", payload: { isEditMode } }), [dispatch]);
    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);
    const updateDrafts = useCallback((drafts) => dispatch({ type: "updateDrafts", payload: { drafts } }), [dispatch]);
    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);
    const updateEntriesById = useCallback((entriesById) => dispatch({ type: "updateEntriesById", payload: { entriesById } }), [dispatch]);
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);

    const updateCategoriesCount = useCallback((categoriesCount) => dispatch({ type: "updateCategoriesCount", payload: { categoriesCount } }), [dispatch]);
    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const updateSavedEntries = useCallback((savedEntries) => dispatch({ type: "updateSavedEntries", payload: { savedEntries } }), [dispatch]);
    const updateModifiedEntries = useCallback((modifiedEntries) => dispatch({ type: "updateModifiedEntries", payload: { modifiedEntries } }), [dispatch]);

    const updateEntryOptionsMode = useCallback((entryOptionsMode) => dispatch({ type: "updateEntryOptionsMode", payload: { entryOptionsMode } }), [dispatch]);

    const updateMetaInput = (e) => {
        let prevEntryData = { ...entryData };
        let newModifiedEntries = [...modifiedEntries];

        updateDrafts({ ...drafts, [prevEntryData.id]: true });
        let data = prevEntryData.data;

        if (e.target.name === "category") {
            let prevCategory = savedEntries[selectedEntryIndex].category;
            let currCategory = e.target.value;

            if (prevCategory === "Cards" && currCategory === "Cards") data = { ...savedEntries[selectedEntryIndex].data };
            else if (prevCategory !== "Cards" && currCategory !== "Cards") data = [...savedEntries[selectedEntryIndex].data];
            else if (prevCategory === "Cards") data = [];
            else if (currCategory === "Cards") data = { ...initData.cardData };
        }

        let newEntryData = { ...prevEntryData, data, [e.target.name]: e.target.value };
        updateEntryData(newEntryData);

        newModifiedEntries[selectedEntryIndex] = newEntryData;
        updateModifiedEntries(newModifiedEntries);
    }
    const updateFieldInput = (e, idx) => {
        let prevEntryData = { ...entryData };
        let newModifiedEntries = [...modifiedEntries];

        updateDrafts({ ...drafts, [prevEntryData.id]: true });

        let data = cloneDeep(prevEntryData.data);

        data[idx][e.target.name] = e.target.value;

        let newEntryData = { ...prevEntryData, data };
        updateEntryData(newEntryData);

        newModifiedEntries[selectedEntryIndex] = newEntryData;
        updateModifiedEntries(newModifiedEntries);
    }
    const updateCardData = (e) => {
        let prevEntryData = { ...entryData };
        let newModifiedEntries = [...modifiedEntries];

        updateDrafts({ ...drafts, [prevEntryData.id]: true });

        let newEntryData = { ...prevEntryData, data: { ...prevEntryData.data, [e.target.name]: e.target.value } };
        updateEntryData(newEntryData);

        newModifiedEntries[selectedEntryIndex] = newEntryData;
        updateModifiedEntries(newModifiedEntries);
    }

    const handleDragEnd = (e) => {
        if (!e.destination) return;

        let data = Array.from(entryData.data);
        let [source_data] = data.splice(e.source.index, 1);
        data.splice(e.destination.index, 0, source_data);

        updateEntryData({ ...entryData, data });
        updateSelectedFieldIndex(e.destination.index);
    };

    const addField = () => {
        let prevEntryData = { ...entryData };
        let newModifiedEntries = [...modifiedEntries];

        updateDrafts({ ...drafts, [prevEntryData.id]: true });

        let newEntryData = { ...prevEntryData, data: [...prevEntryData.data, { name: '', value: '', type: "text" }] };
        updateEntryData(newEntryData);
        updateSelectedFieldIndex(prevEntryData.data.length);

        newModifiedEntries[selectedEntryIndex] = newEntryData;
        updateModifiedEntries(newModifiedEntries);
    }

    const copyText = (type, text) => {
        navigator.clipboard.writeText(text);

        let prefix = type;
        if (prefix !== "CVV") {
            prefix = prefix.substr(0, 1).toUpperCase() + prefix.substr(1);
            prefix = prefix.match(/[A-Z][a-z]+/g).join(' ')
        }
        showSnack("info", prefix + " Copied");
    }
    const openLink = (link) => {
        window.open(link);
    }

    const saveEntry = () => {
        let newDrafts = { ...drafts };
        delete newDrafts[entryData.id];
        updateDrafts(newDrafts);

        let newEntryData = { ...entryData };
        let newSavedEntries = [...savedEntries];
        let newmodifiedEntries = [...modifiedEntries];

        newEntryData.lastModifiedAt = new Date().toString().substring(0, 24);

        // If category is updated
        if (newSavedEntries[selectedEntryIndex].category !== newEntryData.category) {
            let counts = [...categoriesCount];
            let newCounts = [...counts];
            let prevCategory = newSavedEntries[selectedEntryIndex].category;
            let currCategory = newEntryData.category;

            let isNewCategoryFound = true;

            counts.forEach((count, index) => {
                if (count.name === prevCategory) {
                    newCounts[0].count--; // "All" Category
                    newCounts[index].count--;
                    if (newCounts[index].count === 0) newCounts.splice(index, 1);
                }
                if (count.name === currCategory) {
                    newCounts[0].count++; // "All" Category
                    newCounts[index].count++;
                    isNewCategoryFound = false;
                }
            });

            if (isNewCategoryFound) {
                newCounts[0].count++;
                newCounts.push({ name: currCategory, count: 1 })
            }
            updateCategoriesCount(newCounts);
        }

        newSavedEntries[selectedEntryIndex] = newEntryData;
        newmodifiedEntries[selectedEntryIndex] = newEntryData;

        let encryptedData = crypto.encrypt(JSON.stringify({ templates, credentials: newSavedEntries }), password);

        updateLocalStore({ dataFileId, encryptedData });
        updateEntryData(newEntryData);
        updateSavedEntries(newSavedEntries);
        updateModifiedEntries(newmodifiedEntries);

        localStorage.setItem("encryptedData", encryptedData);

        updateEntriesById({ ...entriesById, [selectedEntryId]: newEntryData })

        updateEditModeStatus(false);
        updateSelectedFieldIndex(0);
    }

    const deleteEntry = () => {
        let newSavedEntries = [...savedEntries];
        let newmodifiedEntries = [...modifiedEntries];

        // updateCategoriesCount
        let counts = [...categoriesCount];
        let newCounts = [...categoriesCount];
        let prevCategory = newSavedEntries[selectedEntryIndex].category;

        counts.forEach((count, index) => {
            if (count.name === prevCategory) {
                newCounts[0].count--;
                newCounts[index].count--;
                if (newCounts[index].count === 0) {
                    let isStaticCategory = false;

                    for (var i in initData.staticCategories) {
                        if (initData.staticCategories[i] === newCounts[index].name)
                            isStaticCategory = true;
                    }
                    if (!isStaticCategory) newCounts.splice(index, 1);
                }
            }
        });
        updateCategoriesCount(newCounts);


        newSavedEntries.splice(selectedEntryIndex, 1);
        newmodifiedEntries.splice(selectedEntryIndex, 1);

        let encryptedData = crypto.encrypt(JSON.stringify({ templates, credentials: newSavedEntries }), password);

        updateLocalStore({ dataFileId, encryptedData });
        updateSavedEntries(newSavedEntries);
        updateModifiedEntries(newmodifiedEntries);

        localStorage.setItem("encryptedData", encryptedData);

        updateSelectedEntryId('');
        closeDeleteConfirmationModal();
    }

    const [deleteConfirmModal, updateDeleteConfirmModal] = useState({
        open: false,
        entryName: ""
    });
    const openDeleteConfirmationModal = (entryName) => {
        updateDeleteConfirmModal({
            open: true,
            entryName
        })
    }
    const closeDeleteConfirmationModal = () => {
        updateDeleteConfirmModal({
            open: false,
            entryName: ""
        })
    }

    useEffect(() => {
        updateEntryData(entryData);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryData, updateEntryData]);

    return (<>
        <Box className="borderRight" style={{ height: "100%", width: "100%" }} >
            {(isEditMode) ? <>
                <Box className="borderBottom" style={{ padding: "5px 10px", display: "flex", justifyContent: "space-between" }} >
                    <Input
                        name="name"
                        value={entryData.name}
                        InputProps={{ className: classes.input }}
                        inputProps={{ style: { padding: "0 5px" } }}
                        onChange={updateMetaInput}
                    />

                    <Box>
                        <Tooltip title={"Save"} placement="bottom" >
                            <IconButton
                                size="small"
                                style={{
                                    color: "inherit",
                                    margin: "0 5px",
                                    padding: 0
                                }}
                                onClick={() => saveEntry()}
                            ><SaveIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete"} placement="bottom" >
                            <IconButton
                                size="small"
                                style={{
                                    color: "red",
                                    margin: "0 5px",
                                    padding: 0
                                }}
                                onClick={() => openDeleteConfirmationModal(entryData.name)}
                            ><DeleteOutlinedIcon /></IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box className="borderBottom" style={{ padding: "10px 0" }} >
                    <Grid container>
                        <Grid item xs={6} style={{ padding: "0 5px" }} >
                            <SelectCategory
                                name="category"
                                theme={theme}
                                entryData={entryData}
                                categories={categories}
                                onChange={updateMetaInput}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ padding: "0 5px" }} >
                            <Input
                                label="User"
                                name="user"
                                value={entryData.user}
                                InputProps={{ className: classes.input }}
                                inputProps={{ style: { padding: "0 5px" } }}
                                onChange={updateMetaInput}
                            />
                        </Grid>
                    </Grid>

                </Box>

                <Box style={{ padding: "10px 0" }} >
                    {(entryData.category === "Cards") ? <>
                        <EditCard
                            classes={classes}
                            tableStyles={tableStyles}

                            Input={Input}
                            updateCardData={updateCardData}
                            saveEntry={saveEntry}
                        />
                    </> : <>
                        <EditEntry
                            classes={classes}
                            tableStyles={tableStyles}
                            Input={Input}

                            handleDragEnd={handleDragEnd}
                            addField={addField}
                            updateFieldInput={updateFieldInput}
                            saveEntry={saveEntry}
                        />
                    </>}
                </Box>

            </> : <>
                <Box className="borderBottom" style={{ padding: "5px 10px", display: "flex", justifyContent: "space-between" }} >
                    <Tooltip title={entryData.name} placement="top-start" >
                        <Typography className="noOverflow" style={{ fontWeight: "bold", flex: 1 }} >{entryData.name}</Typography>
                    </Tooltip>
                    <Box>
                        <Tooltip title={"Edit"} placement="bottom" >
                            <IconButton
                                size="small"
                                style={{ color: "#009dcd", margin: "0 5px", padding: 0 }}
                                onClick={() => {
                                    updateEditModeStatus(true);
                                    updateEntryOptionsMode("EntryOptions");
                                }}
                            ><EditOutlinedIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete"} placement="bottom" >
                            <IconButton size="small" onClick={() => openDeleteConfirmationModal(entryData.name)} style={{ color: "red", margin: "0 5px", padding: 0 }} ><DeleteOutlinedIcon /></IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box style={{ padding: "10px 0" }} >
                    {(entryData.category === "Cards") ? <>
                        <ViewCard
                            copyText={copyText}
                            saveEntry={saveEntry}
                        />
                    </> : <>
                        <ViewEntry
                            classes={classes}
                            tableStyles={tableStyles}
                            Input={Input}

                            copyText={copyText}
                            openLink={openLink}
                        />
                    </>}
                </Box>
            </>}
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
                    Are you sure you want to delete this "{deleteConfirmModal.entryName}" entry?
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
                        onClick={deleteEntry}
                    >Confirm</Button>
                </Box>
            </Paper>
        </Modal>
    </>);
}

export default CredentialData;