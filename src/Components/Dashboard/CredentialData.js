import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { darkTheme } from '../../Theme';
import initData from '../../initData';

import { makeStyles } from "@mui/styles";
import { Box, IconButton, TextField, Typography, Autocomplete, Paper, Grid, TableCell, Checkbox, Button } from "@mui/material";
import { Table, TableBody, TableRow, Select, MenuItem } from "@mui/material";

import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';


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
    const { theme, selectedEntryId, categories, selectedFieldIndex, updateSelectedFieldIndex, showSnack } = props;

    const [isEditMode, updateEditModeStatus] = useState(false);
    const [entryData, updateEntryData] = useState(props.entryData);

    const [is_CVV_Visible, update_CVV_VisibleState] = useState(false);

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
        updateEntryData((entryDataObj) => ({ ...entryDataObj, data: [...entryDataObj.data, { name: '', value: '' }] }));
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

    useEffect(() => {
        console.log(entryData);
    }, [entryData])

    useEffect(() => {
        updateEditModeStatus(false);
        updateEntryData(props.entryData)
        updateSelectedFieldIndex(0);
    }, [props.entryData, selectedEntryId, updateSelectedFieldIndex])

    const cardThemes = {
        blackPurple: {
            background: "linear-gradient(90deg, rgba(0,19,36,1) 0%, rgba(67,9,121,1) 50%, rgba(191,0,255,1) 100%)",
            color: "white"
        },
        blue: {
            background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
            color: "white"
        },
        blackOrange: {
            background: "linear-gradient(90deg, rgba(0,19,36,1) 0%, rgba(142,93,2,1) 72%, rgba(255,174,0,1) 100%)",
            color: "white"
        },
        purpleOrange: {
            background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
            color: "white"
        },
        orangeBlue: {
            background: "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
            color: "white"
        },
        black: {
            background: "linear-gradient(to right, #000000, #434343)",
            color: "white"
        },
        purple: {
            background: "linear-gradient(to right, #6a3093, #a044ff)",
            color: "white"
        },
        orange: {
            background: "linear-gradient(to right, #f46b45, #eea849)",
            color: "white"
        },
        instagram: {
            background: "linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)",
            color: "white"
        },
        violet: {
            background: "linear-gradient(to right, #6441a5, #2a0845)",
            color: "white"
        },
        greenBlue: {
            background: "linear-gradient(to right, #43cea2, #185a9d)",
            color: "white"
        },
        greenBlack: {
            background: "linear-gradient(to right, #52c234, #061700)",
            color: "white"
        },
        facebook: {
            background: "linear-gradient(to right, #00c6ff, #0072ff)",
            color: "white"
        },
        skyBlue: {
            background: "linear-gradient(to right, #00d2ff, #3a7bd5)",
            color: "white"
        },
        pink: {
            background: "linear-gradient(to right, #f857a6, #ff5858)",
            color: "white"
        },
        dark: {
            background: "linear-gradient(to right, #232526, #414345)",
            color: "white"
        },
        bluePurple: {
            background: "linear-gradient(to right, #4776e6, #8e54e9)",
            color: "white"
        },
        purePurple: {
            background: "linear-gradient(to right, #da22ff, #9733ee)",
            color: "white"
        },
        greenBluePurple: {
            background: "linear-gradient(155deg, #52c234 0%, rgba(0,212,255,1) 50%,  #9733ee 75%)",
            color: "white"
        },
        color: {
            background: "linear-gradient(to right, #da22ff, #9733ee)",
            color: "white"
        },
    }

    // const [cardThemesArr, updatecardThemesArr] = useState([]);
    // useEffect(() => {
    //     let tmp = []
    //     for (let i in cardThemes) {
    //         tmp.push(i)
    //     }
    //     console.log(tmp)
    //     updatecardThemesArr(tmp)
    // }, [])

    // const [currentCardTheme, updateCurrentCardTheme] = useState(cardThemes.color);
    // const [cardColorIndex, updatecardColorIndex] = useState(0);

    // useEffect(() => {
    //     console.log()
    //     const id = setInterval(() => {
    //         updateCurrentCardTheme(cardThemes[cardThemesArr[cardColorIndex%19]])
    //         updatecardColorIndex(cardColorIndex + 1)
    //     }, 1000);
    //     return () => clearInterval(id);
    // }, [cardColorIndex, cardThemesArr, cardThemes]);

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
                                style={{ backgroundColor: "#0088fd", color: "white", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
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
                                                                    type={(field.type !== "hidden") ? field.type : "text"}
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
                                style={{ backgroundColor: "#0088fd", color: "white", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                                onClick={addField}
                            >Add Entry</Button>

                            <Button
                                variant="standard"
                                style={{ backgroundColor: "#0088fd", color: "white", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
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

                <Box style={{ padding: "10px 0" }} >
                    {(entryData.category === "Cards") ? <>
                        <Paper
                            style={{
                                // ...currentCardTheme,
                                // ...cardThemes.color,
                                ...cardThemes.bluePurple,
                                position: "relative",
                                width: "76%",
                                padding: "20%",
                                boxSizing: "border-box",
                                borderRadius: "10px",
                                margin: "0 auto",
                            }}
                        >
                            <Box
                                style={{
                                    color: "white",
                                    padding: "8px 14px",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    height: "100%",
                                    width: "100%"
                                }}
                            >
                                <Box style={{ display: "flex" }} >
                                    <Typography
                                        style={{ flexGrow: 1, fontSize: "1.1vw", cursor: "pointer" }}
                                        onClick={() => copyText("cardName", entryData.data.cardName)}
                                    >{entryData.data.cardName}</Typography>
                                    <Typography
                                        style={{ fontSize: "1.1vw", fontWeight: "bold", cursor: "pointer" }}
                                        onClick={() => copyText("network", entryData.data.network)}
                                    >{entryData.data.network}</Typography>
                                </Box>

                                <Grid container style={{ marginTop: "4.5vw" }} >
                                    <Grid item xs={9} >
                                        <Typography
                                            style={{ fontSize: "1.5vw", cursor: "pointer" }}
                                            onClick={() => copyText("cardNo", entryData.data.cardNo.replace(/\s/g,''))}
                                        >{entryData.data.cardNo.replace(/\s/g,'').match(/.{1,4}/g).join(' ')}</Typography>

                                        <Typography
                                            style={{ fontSize: "0.9vw", cursor: "pointer" }}
                                            onClick={() => copyText("validThru", entryData.data.validThru)}
                                        >Valid Thru: {entryData.data.validThru}</Typography>
                                        <Typography
                                            style={{ fontSize: "1.3vw", cursor: "pointer" }}
                                            onClick={() => copyText("cardHolderName", entryData.data.cardHolderName)}
                                        >{entryData.data.cardHolderName}</Typography>
                                    </Grid>
                                    <Grid item xs={3}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-start",
                                            alignItems: "flex-end",
                                            padding: "10px 0"
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="3.1vw" viewBox="0 0 193 138"><path d="M13.2 2.1C8.6 3.5 2.3 10.1 1 14.9c-.7 2.8-1 21-.8 56.4l.3 52.3 2.7 4.1c1.5 2.2 4.4 5.1 6.5 6.4l3.8 2.4h166l3.8-2.4c2.1-1.3 5-4.2 6.5-6.4l2.7-4.1V14.5l-2.4-3.8c-1.3-2.1-4.2-5-6.4-6.5l-4.1-2.7-81.5-.2c-49.7-.1-82.9.2-84.9.8zM72 27.5V48H5.9l.3-15.9c.3-14.3.5-16.3 2.4-18.8C13 7.3 14.8 7 44.8 7H72v20.5zm40 6.5v27H79V7h33v27zm66.9-25.2c6.9 3.4 7.6 5.5 7.9 23.3l.3 15.9H152V32h-9v16h-25V7h28.8c25.3 0 29.1.2 32.1 1.8zM72 69.5V83H39V64h-9v19H6V56h66v13.5zm71 0V83h-25V56h25v13.5zm44 0V83h-36V56h36v13.5zM112 90v20H79V70h33v20zm-40 21v20H44.8c-30 0-31.8-.3-36.2-6.3-1.9-2.5-2.1-4.5-2.4-18.3L5.9 91H72v20zm114.8-4.6c-.3 13.8-.5 15.8-2.4 18.3-4.4 6-6 6.3-37.6 6.3H118V91h69.1l-.3 15.4zM112 124.5v6.5H79v-13h33v6.5z" fill="gold" /></svg>
                                        <Typography
                                            style={{ fontSize: "0.9vw", cursor: "pointer" }}
                                            onClick={() => copyText("cardType", entryData.data.cardType)}
                                        >{entryData.data.cardType}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Box style={{ marginTop: "15px", display: "flex", justifyContent: "center" }} >
                            <IconButton
                                style={{ color: "inherit", padding: "0 5px" }}
                                onMouseDown={() => update_CVV_VisibleState(true)}
                                onMouseUp={() => update_CVV_VisibleState(false)}
                            >
                                <VisibilityIcon style={{ fontSize: "1.2vw" }} />
                            </IconButton>
                            <Typography style={{ letterSpacing: 1.5, fontSize: "1vw", margin: "0 0 0 3px" }} >CVV: </Typography>
                            <Typography style={{ letterSpacing: 1.5, fontSize: "1vw", width: "2vw", margin: "0 3px 0 0" }} >&nbsp;{(is_CVV_Visible) ? entryData.data.CVV : "***"}</Typography>
                            <IconButton style={{ color: "inherit", padding: "0 5px" }} onClick={() => copyText("CVV", entryData.data.CVV)} >
                                <ContentCopyIcon style={{ fontSize: "1.2vw" }} />
                            </IconButton>
                        </Box>
                    </> : <>
                        <Table className={tableStyles.table} >
                            <TableBody>
                                {entryData.data?.map((field, index) => {
                                    if (field.type === "hidden") return null;

                                    return <TableRow
                                        key={index}
                                        className={tableStyles.tableRow}
                                        onClick={() => updateSelectedFieldIndex(index)}
                                    >
                                        <TableCell style={{ width: "38%" }} className={tableStyles.tableCell}>{field.name}</TableCell>
                                        <TableCell style={{ width: "56%" }} className={tableStyles.tableCell}>
                                            <Button
                                                style={{ padding: 0 }}
                                                sx={{
                                                    "& .MuiTouchRipple-root": {
                                                        color: (theme === "dark") ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"
                                                    }
                                                }}
                                            >
                                                <Input
                                                    readOnly
                                                    disabled
                                                    type={field.type}
                                                    value={field.value}
                                                    InputProps={{ className: classes.input }}
                                                    sx={{
                                                        "& .Mui-disabled": {
                                                            cursor: "pointer",
                                                            textFillColor: (theme === "dark") ? "white" : "black",
                                                        }
                                                    }}
                                                    onClick={() => copyText(field.type, field.value)}
                                                />
                                            </Button>
                                        </TableCell>
                                        <TableCell style={{ width: "6%" }} className={tableStyles.tableCell} >
                                            {(field.type === "password" || field.type === "text") &&
                                                <IconButton style={{ color: "inherit" }} onClick={() => copyText(field.name, field.value)} >
                                                    <ContentCopyIcon style={{ fontSize: "17px" }} />
                                                </IconButton>
                                            }
                                            {(field.type === "link") &&
                                                <IconButton style={{ color: "inherit" }} onClick={() => openLink(field.value)} >
                                                    <OpenInNewIcon style={{ fontSize: "17px" }} />
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </>}
                </Box>
            </>}
        </Box>
    </>);
}

export default CredentialData;