import { useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import cardThemes from "../../cardThemes";

import { Box, IconButton, Typography, Paper, Grid, Button } from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function ViewCard(props) {
    const dispatch = useDispatch();

    const { copyText } = props;

    const { entryOptionsMode } = useSelector((state) => state.config);
    const { entryData } = useSelector((state) => state.entries);

    const updateEntryOptionsMode = useCallback((entryOptionsMode) => dispatch({ type: "updateEntryOptionsMode", payload: { entryOptionsMode } }), [dispatch]);

    const [is_CVV_Visible, update_CVV_VisibleState] = useState(false);

    const saveEntry = () => {
        props.saveEntry();
        updateEntryOptionsMode("EntryOptions");
    }

    return (<>
        <Paper
            style={{
                ...cardThemes[entryData.cardTheme],
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
                    padding: "0.75vw 1.4vw",
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
                            onClick={() => copyText("cardNo", entryData.data.cardNo.replace(/\s/g, ''))}
                        >{(entryData.data.cardNo !== "") && entryData.data.cardNo.replace(/\s/g, '').match(/.{1,4}/g).join(' ')}</Typography>

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

        {(entryOptionsMode === "ChangeCardTheme") ? <>
            <Box style={{ padding: "35px 0", display: "flex", justifyContent: "center" }} >
                <Button
                    variant="standard"
                    style={{ backgroundColor: "#0088fd", color: "white", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                    onClick={() => saveEntry()}
                >Save</Button>
            </Box>
        </> : null}
    </>);
}

export default ViewCard;