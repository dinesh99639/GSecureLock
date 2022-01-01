import { useEffect, useState } from "react";

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
    const classes = useInputStyles();
    const tableStyles = useTableStyling();
    const { theme, isEditMode, updateEditModeStatus, selectedEntryId, categories, selectedFieldIndex, deleteEntry, updateSelectedFieldIndex, showSnack } = props;

    const [entryData, updateEntryData] = useState(props.entryData);

    const updateMetaInput = (e) => updateEntryData((state) => {
        let data = state.data;

        if (e.target.name === "category") {
            if (state.category === "Cards") { // If previous state category is Cards
                if (props.entryData.category !== "Cards") data = props.entryData.data;
                else data = [];
            }
            if (e.target.value === "Cards") { // If current state category is Cards
                if (props.entryData.category === "Cards") data = props.entryData.data;
                else data = initData.cardData;
            }
        }

        return { ...state, data, [e.target.name]: e.target.value }
    })
    const updateFieldInput = (e, idx) => updateEntryData((state) => {
        let data = [...state.data];
        data[idx][e.target.name] = e.target.value;

        return { ...state, data };
    })
    const updateCardData = (e) => {
        updateEntryData((entryDataObj) => ({ ...entryDataObj, data: { ...entryDataObj.data, [e.target.name]: e.target.value } }))
    }

    const handleDragEnd = (e) => {
        if (!e.destination) return;

        let data = Array.from(entryData.data);
        let [source_data] = data.splice(e.source.index, 1);
        data.splice(e.destination.index, 0, source_data);

        updateEntryData((entryDataObj) => ({ ...entryDataObj, data }));
        updateSelectedFieldIndex(e.destination.index);
    };

    const addField = () => {
        updateEntryData((entryDataObj) => ({ ...entryDataObj, data: [...entryDataObj.data, { name: '', value: '', type: "text" }] }));
        updateSelectedFieldIndex(entryData.data.length);
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

    const saveEntry = (entryData) => {
        props.saveEntry(entryData);
        updateEditModeStatus(false);
    }

    const [deleteConfirmModal, updateDeleteConfirmModal] = useState({
        open: false,
        entryName: "",
        callback: null
    });
    const openDeleteConfirmationModal = (entryName, callback) => {
        updateDeleteConfirmModal({
            open: true,
            entryName,
            callback
        })
    }
    const closeDeleteConfirmationModal = () => {
        updateDeleteConfirmModal({
            open: false,
            entryName: "",
            callback: null
        })
    }

    useEffect(() => {
        console.log(entryData);
    }, [entryData]);

    useEffect(() => {
        // updateEditModeStatus(false);

        updateEntryData(props.entryData)
        updateSelectedFieldIndex(0);
    }, [props.entryData, selectedEntryId, updateSelectedFieldIndex]);

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
                        <IconButton
                            size="small"
                            style={{
                                color: "inherit",
                                margin: "0 5px",
                                padding: 0
                            }}
                            onClick={() => saveEntry(entryData)}
                        ><SaveIcon /></IconButton>

                        <IconButton
                            size="small"
                            style={{
                                color: "red",
                                margin: "0 5px",
                                padding: 0
                            }}
                            onClick={() => openDeleteConfirmationModal(entryData.name, deleteEntry)}
                        ><DeleteOutlinedIcon /></IconButton>
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

                            theme={theme}
                            Input={Input}
                            entryData={entryData}
                            updateCardData={updateCardData}
                            saveEntry={saveEntry}
                        />
                    </> : <>
                        <EditEntry
                            classes={classes}
                            tableStyles={tableStyles}
                            Input={Input}

                            entryData={entryData}
                            updateSelectedFieldIndex={updateSelectedFieldIndex}
                            selectedFieldIndex={selectedFieldIndex}

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
                        <IconButton size="small" style={{ color: "#009dcd", margin: "0 5px", padding: 0 }} onClick={() => updateEditModeStatus(true)} ><EditOutlinedIcon /></IconButton>
                        <IconButton size="small" onClick={() => openDeleteConfirmationModal(entryData.name, deleteEntry)} style={{ color: "red", margin: "0 5px", padding: 0 }} ><DeleteOutlinedIcon /></IconButton>
                    </Box>
                </Box>

                <Box style={{ padding: "10px 0" }} >
                    {(entryData.category === "Cards") ? <>
                        <ViewCard
                            entryData={entryData}
                            copyText={copyText}
                        />
                    </> : <>
                        <ViewEntry
                            classes={classes}
                            tableStyles={tableStyles}
                            theme={theme}
                            Input={Input}

                            entryData={entryData}
                            copyText={copyText}
                            openLink={openLink}
                            updateSelectedFieldIndex={updateSelectedFieldIndex}
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
                    Are you sure you want to delete this "Bank Card" entry?
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
                        onClick={() => deleteEntry(entryData.id, closeDeleteConfirmationModal)} 
                    >Confirm</Button>
                </Box>
            </Paper>
        </Modal>
    </>);
}

export default CredentialData;