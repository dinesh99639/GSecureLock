import { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Box, Button, Checkbox } from "@mui/material";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function EditEntry(props) {
    const dispatch = useDispatch();
    
    const { classes, tableStyles } = props;
    const { Input, saveEntry, handleDragEnd, addField, updateFieldInput } = props;

    const { selectedFieldIndex, entryData } = useSelector((state) => state.entries);
    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);


    return (<>
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
                onClick={() => saveEntry()}
            >Save</Button>
        </Box>
    </>);
}

export default EditEntry;