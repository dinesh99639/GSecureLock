import { useEffect, useState } from "react";

import { Box, Grid, Typography, Button } from "@mui/material";

function EntryInfo(props) {
    const { entryData } = props;

    const [createdAt, updateCreatedAt] = useState("");
    const [lastModifiedAt, updateLastModifiedAt] = useState("");

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
                    >Change Theme</Button>
                </> : <>
                    <Button
                        style={{
                            color: "inherit",
                            textTransform: "none",
                            border: "1px solid gray"
                        }}
                    >Create Template</Button>
                </>}
            </Box>
        </Box>
    </>);
}

export default EntryInfo;