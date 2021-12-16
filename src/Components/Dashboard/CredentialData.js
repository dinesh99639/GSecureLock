import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { darkTheme } from '../../Theme';

import { makeStyles } from "@mui/styles";
import { Box, IconButton, TextField, Typography, Autocomplete, Paper, Grid, TableCell, Checkbox, Button } from "@mui/material";
import { Table, TableBody, TableRow, Select, MenuItem } from "@mui/material";

import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


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
        // disableClearable
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
    const { theme, selectedEntryId, categories, selectedFieldIndex, updateSelectedFieldIndex, saveEntry } = props;

    const [isEditMode, updateEditModeStatus] = useState(false);
    const [entryData, updateEntryData] = useState(props.entryData);

    const updateMetaInput = (e) => updateEntryData((state) => ({ ...state, [e.target.name]: e.target.value }))
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
        updateEntryData((entryDataObj) => ({ ...entryDataObj, data: [...entryDataObj.data, { name: '', value: '' }] }));
        updateSelectedFieldIndex(entryData.data.length);
    }

    useEffect(() => {
        console.log(entryData);
    }, [entryData])

    useEffect(() => {
        updateEditModeStatus(true);
        updateEntryData(props.entryData)
        updateSelectedFieldIndex(0);
    }, [props.entryData, selectedEntryId, updateSelectedFieldIndex])

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
                        <Table className={tableStyles.table} >
                            <TableBody>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Card Name
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Input
                                            name="cardName"
                                            fullWidth
                                            value={entryData.data.cardName}
                                            InputProps={{ className: classes.input }}
                                            onChange={updateCardData}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Card Type
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Select
                                            variant="standard"
                                            name="cardType"
                                            value={entryData.data.cardType}
                                            className={classes.root}
                                            style={{ 
                                                width: "100%", 
                                                backgroundColor: "inherit", 
                                                color: "inherit"
                                            }}
                                            MenuProps={{
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : null,
                                                        color: "inherit",
                                                    }
                                                }
                                            }}
                                            onChange={updateCardData}
                                        >
                                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                                        </Select>
                                    </TableCell>

                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Network
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Select
                                            variant="standard"
                                            name="network"
                                            value={entryData.data.network}
                                            className={classes.root}
                                            style={{ width: "100%", backgroundColor: "inherit", color: "inherit" }}
                                            MenuProps={{
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : null,
                                                        color: "inherit"
                                                    }
                                                }
                                            }}
                                            onChange={updateCardData}
                                        >
                                            <MenuItem value="VISA">VISA</MenuItem>
                                            <MenuItem value="MasterCard">MasterCard</MenuItem>
                                            <MenuItem value="RuPay">RuPay</MenuItem>
                                            <MenuItem value="American Express">American Express</MenuItem>
                                        </Select>
                                    </TableCell>

                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Card Number
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Input
                                            name="cardNo"
                                            fullWidth
                                            value={entryData.data.cardNo}
                                            InputProps={{ className: classes.input }}
                                            onChange={updateCardData}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Valid Thru
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Input
                                            name="validThru"
                                            fullWidth
                                            value={entryData.data.validThru}
                                            InputProps={{ className: classes.input }}
                                            onChange={updateCardData}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        Card Holder Name
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Input
                                            name="cardHolderName"
                                            fullWidth
                                            value={entryData.data.cardHolderName}
                                            InputProps={{ className: classes.input }}
                                            onChange={updateCardData}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className={tableStyles.tableRow} >
                                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                                        CVV
                                    </TableCell>
                                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                                        <Input
                                            fullWidth
                                            type="password"
                                            name="CVV"
                                            value={entryData.data.CVV}
                                            InputProps={{ className: classes.input }}
                                            onChange={updateCardData}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Box style={{ padding: "15px", display: "flex", justifyContent: "center" }} >
                            <Button
                                variant="standard"
                                style={{ backgroundColor: "#0088fd", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                                onClick={() => saveEntry(entryData)}
                            >Save</Button>
                        </Box>
                    </> : <>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Table className={tableStyles.table} >
                                <Droppable droppableId="entryData" style={{ tableLayout: "fixed" }} >
                                    {(provider) => (
                                        <TableBody
                                            ref={provider.innerRef}
                                            {...provider.droppableProps}
                                        >
                                            {entryData.data?.map((field, index) => (
                                                <Draggable
                                                    key={"field" + index}
                                                    draggableId={"field" + index}
                                                    index={index}
                                                >
                                                    {(provider) => (
                                                        <TableRow
                                                            {...provider.draggableProps}
                                                            ref={provider.innerRef}
                                                            className={tableStyles.tableRow}
                                                            onClick={() => updateSelectedFieldIndex(index)}
                                                        >
                                                            <TableCell style={{ width: "6%" }} className={tableStyles.tableCell} {...provider.dragHandleProps}> = </TableCell>
                                                            <TableCell style={{ width: "35%" }} className={tableStyles.tableCell}>
                                                                <Input
                                                                    name="name"
                                                                    value={field.name}
                                                                    InputProps={{ className: classes.input }}
                                                                    onChange={(e) => updateFieldInput(e, index)}
                                                                />
                                                            </TableCell>
                                                            <TableCell style={{ width: "53%" }} className={tableStyles.tableCell}>
                                                                <Input
                                                                    name="value"
                                                                    value={field.value}
                                                                    InputProps={{ className: classes.input }}
                                                                    onChange={(e) => updateFieldInput(e, index)}
                                                                />
                                                            </TableCell>
                                                            <TableCell style={{ width: "6%" }} className={tableStyles.tableCell}>
                                                                <Checkbox
                                                                    color="default"
                                                                    icon={<CircleOutlinedIcon />}
                                                                    checkedIcon={<ChevronRightIcon style={{ backgroundColor: "#0088fd", color: "white" }} />}
                                                                    sx={{ color: "inherit", '& .MuiSvgIcon-root': { fontSize: 19, borderRadius: "50%" } }}
                                                                    checked={selectedFieldIndex === index}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provider.placeholder}
                                        </TableBody>
                                    )}
                                </Droppable>
                            </Table>
                        </DragDropContext>

                        <Box style={{ padding: "15px", display: "flex", justifyContent: "center" }} >
                            <Button
                                variant="standard"
                                style={{ backgroundColor: "#0088fd", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                                onClick={addField}
                            >Add Entry</Button>

                            <Button
                                variant="standard"
                                style={{ backgroundColor: "#0088fd", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                                onClick={() => saveEntry(entryData)}
                            >Save</Button>
                        </Box>
                    </>}
                </Box>

            </> : <>
                <Box className="borderBottom" style={{ padding: "5px 10px", display: "flex", justifyContent: "space-between" }} >
                    <Typography style={{ fontWeight: "bold" }} >{entryData.name}</Typography>
                    <Box>
                        <IconButton size="small" style={{ color: "#009dcd", margin: "0 5px", padding: 0 }} onClick={() => updateEditModeStatus(true)} ><EditOutlinedIcon /></IconButton>
                        <IconButton size="small" style={{ color: "red", margin: "0 5px", padding: 0 }} ><DeleteOutlinedIcon /></IconButton>
                    </Box>
                </Box>
            </>}
        </Box>
    </>);
}

export default CredentialData;