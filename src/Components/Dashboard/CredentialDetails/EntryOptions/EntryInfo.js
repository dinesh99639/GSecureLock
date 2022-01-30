import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import crypto from '../../../../Utils/crypto';
import { darkTheme } from '../../../../Theme';

import { Box, Grid, Typography, Button, Modal, Paper, InputBase } from "@mui/material";

function EntryInfo(props) {
    const { password } = props;

    const dispatch = useDispatch();

    const { theme } = useSelector((state) => state.config);
    const { entryData, savedEntries, templates } = useSelector((state) => state.entries);

    const updateEntryOptionsMode = useCallback((entryOptionsMode) => dispatch({ type: "updateEntryOptionsMode", payload: { entryOptionsMode } }), [dispatch]);
    const updateTemplates = useCallback((templates) => dispatch({ type: "updateTemplates", payload: { templates } }), [dispatch]);

    const [createdAt, updateCreatedAt] = useState("");
    const [lastModifiedAt, updateLastModifiedAt] = useState("");
    const [createTemplateDialog, updateCreateTemplateDialog] = useState({
        open: false,
        name: ""
    });

    const toggleCreateTemplateDialog = () => updateCreateTemplateDialog({ ...createTemplateDialog, open: !createTemplateDialog.open })

    const handleCreateTemplateBtnClick = () => {
        let newTemplate = { ...entryData };

        newTemplate.id = "T" + new Date().getTime();
        newTemplate.name = createTemplateDialog.name;
        newTemplate.user = "";
        newTemplate.createdAt = new Date().toString().substring(0, 24);
        newTemplate.lastModifiedAt = new Date().toString().substring(0, 24);

        let newData = [];
        for (let i in newTemplate.data) {
            newData.push({ ...newTemplate.data[i], value: "" });
        }
        newTemplate.data = newData;

        let newTemplates = [...templates, newTemplate];
        let encryptedData = crypto.encrypt(JSON.stringify({ templates: newTemplates, credentials: savedEntries }), password);
        localStorage.setItem("encryptedData", encryptedData);

        updateTemplates(newTemplates);
        toggleCreateTemplateDialog();
    }

    useEffect(() => {
        updateCreatedAt(entryData.createdAt);
        updateLastModifiedAt(entryData.lastModifiedAt);
    }, [entryData]);

    return (<>
        <Box
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Entry Info</Box>

            <Box style={{ padding: "10px 10px 0 10px" }} >
                <Grid container style={{ padding: "5px 0" }} >
                    <Grid item xs={4}>
                        <Typography style={{ fontSize: "12.5px" }} >Last Modified:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography style={{ fontSize: "12.5px" }} >{lastModifiedAt.substring(4, 15)}</Typography>
                        <Typography style={{ fontSize: "12.5px" }} >{lastModifiedAt.substring(0, 3) + ", " + lastModifiedAt.substring(16, 24)}</Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ padding: "5px 0" }} >
                    <Grid item xs={4}>
                        <Typography style={{ fontSize: "12.5px" }} >Created:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography style={{ fontSize: "12.5px" }} >{createdAt.substring(4, 15)}</Typography>
                        <Typography style={{ fontSize: "12.5px" }} >{createdAt.substring(0, 3) + ", " + createdAt.substring(16, 24)}</Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ padding: "5px 0" }} >
                    <Grid item xs={4}>
                        <Typography style={{ fontSize: "12.5px" }} >Category:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography style={{ fontSize: "12.5px" }} >{entryData.category}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box
                style={{
                    height: "100%",
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {(entryData.category === "Cards") ? <>
                    <Button
                        style={{
                            color: "inherit",
                            textTransform: "none",
                            border: "1px solid gray"
                        }}
                        onClick={() => updateEntryOptionsMode("ChangeCardTheme")}
                    >Change Theme</Button>
                </> : <>
                    <Button
                        style={{
                            color: "inherit",
                            textTransform: "none",
                            border: "1px solid gray"
                        }}
                        onClick={toggleCreateTemplateDialog}
                    >Create Template</Button>
                </>}
            </Box>
        </Box>

        <Modal
            open={createTemplateDialog.open}
            onClose={toggleCreateTemplateDialog}
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
                    Template
                </Typography>
                <Grid container style={{ padding: "5px" }} >
                    <InputBase
                        placeholder="Template name"
                        sx={{
                            m: "auto", width: "60%", textAlign: "center !important", color: "inherit", borderBottom: "1px solid",
                            '& input': {
                                textAlign: 'center',
                            }
                        }}
                        onChange={(e) => updateCreateTemplateDialog({ ...createTemplateDialog, name: e.target.value })}
                    />
                </Grid>
                <Box style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }} >
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "red",
                            fontSize: "14px",
                            padding: "3px 0",
                            width: "100px",
                            textTransform: 'none'
                        }}
                        onClick={toggleCreateTemplateDialog}
                    >Cancel</Button>
                    <Button
                        variant="contained"
                        style={{
                            fontSize: "14px",
                            padding: "3px 0",
                            width: "100px",
                            textTransform: 'none'
                        }}
                        onClick={handleCreateTemplateBtnClick}
                    >Create</Button>
                </Box>
            </Paper>
        </Modal>
    </>);
}

export default EntryInfo;