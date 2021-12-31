import { Box, Grid, Typography, Button } from "@mui/material";

function EntryInfo(props) {
    return (<>
        <Box
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Entry Info</Box>
            <Box style={{ padding: "10px" }} >
                <Grid container style={{ padding: "5px 0" }} >
                    <Grid item xs={4}>Created:</Grid>
                    <Grid item xs={8}>
                        <Typography style={{ fontSize: "12.5px" }} >{new Date().toString().substring(4, 15)}</Typography>
                        <Typography style={{ fontSize: "12.5px" }} >{new Date().toString().substring(0, 3) + ", " + new Date().toString().substring(16, 24)}</Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ padding: "5px 0" }} >
                    <Grid item xs={4}>Last Modified:</Grid>
                    <Grid item xs={8}>
                        <Typography style={{ fontSize: "12.5px" }} >{new Date().toString().substring(4, 15)}</Typography>
                        <Typography style={{ fontSize: "12.5px" }} >{new Date().toString().substring(0, 3) + ", 05:00 PM " + new Date().toString().substring(16, 24)}</Typography>
                    </Grid>
                </Grid>

                <Box
                    style={{
                        height: "100%",
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Button
                        style={{ 
                            color: "inherit",
                            textTransform: "none", 
                            border: "1px solid gray"
                        }}
                    >Create Template</Button>
                </Box>
            </Box>
        </Box>
    </>);
}

export default EntryInfo;