import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button, IconButton } from "@mui/material";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';


function ViewEntry(props) {
    const dispatch = useDispatch();

    const { classes, tableStyles } = props;
    const { Input, copyText, openLink } = props;

    const theme = useSelector((state) => state.config.theme);
    const viewEntryData = useSelector((state) => state.entries.entryData);

    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);


    const [entryData, updateEntryData] = useState(viewEntryData);

    const setPasswordVisible = (idx, visibility) => {
        updateEntryData((entryDataObj) => {
            let data = entryDataObj.data;

            if (visibility) data[idx].showPassaword = true;
            else data[idx].showPassaword = false;

            return ({ ...entryDataObj, data });
        })
    }

    useEffect(() => {updateEntryData(viewEntryData)}, [viewEntryData]);

    return (<Box style={{ overflowY: "auto", height: "83vh" }} >
        <Table className={tableStyles.table} >
            <TableBody>
                {entryData.data?.map((field, index) => {
                    if (field.type === "hidden") return null;

                    return <TableRow
                        key={index}
                        className={tableStyles.tableRow}
                        onClick={() => updateSelectedFieldIndex(index)}
                    >
                        <TableCell style={{ width: "38%", paddingLeft: "13px" }} className={tableStyles.tableCell}>{field.name}</TableCell>
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
                                    type={
                                        (field.type === "password") ? 
                                        (field.showPassaword) ? "text" : "password" : 
                                        field.type
                                    }
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
                            {(field.type === "text") ? <>
                                <IconButton
                                    style={{ color: "inherit" }}
                                    onClick={() => copyText(field.type, field.value)}
                                >
                                    <ContentCopyIcon style={{ fontSize: "17px" }} />
                                </IconButton>
                            </> : (field.type === "password" || field.type === "text") ? <>
                                <IconButton
                                    style={{ color: "inherit" }}
                                    onMouseDown={() => setPasswordVisible(index, true)}
                                    onMouseUp={() => setPasswordVisible(index, false)}
                                >
                                    <VisibilityIcon style={{ fontSize: "17px" }} />
                                </IconButton>
                            </> : (field.type === "link") ? <>
                                <IconButton style={{ color: "inherit" }} onClick={() => openLink(field.value)} >
                                    <OpenInNewIcon style={{ fontSize: "17px" }} />
                                </IconButton>
                            </> : null}
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </Box>);
}

export default ViewEntry;