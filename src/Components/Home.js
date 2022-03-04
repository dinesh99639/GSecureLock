import { useSelector } from 'react-redux';

import { Grid, Box, Typography, Divider, Paper } from "@mui/material";

function Home() {
    const { theme } = useSelector((state) => ({ ...state.config }));

    return (<>
        <Box sx={{ height: "40vw" }} >
            <Grid container>
                {/* <Grid item xs={4}>
                <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} >
                            <Typography 
                                sx={{
                                    color: "#9c46ff",
                                    fontStyle: "italic"
                                }}
                            >Export</Typography>
                            <Divider
                                sx={{
                                    border: "0.5px solid",
                                    borderColor: "#9c46ff",
                                    width: "20vw",
                                    margin: "0 0 5px 0"
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    opacity: "0.76",
                                    width: "20vw",
                                }}
                            >Export your entries with/without encryption</Typography>
                        </Box>
                        <Box style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} >
                            <Typography 
                                sx={{
                                    color: "#9c46ff",
                                    fontStyle: "italic"
                                }}
                            >Import</Typography>
                            <Divider
                                sx={{
                                    border: "0.5px solid",
                                    borderColor: "#9c46ff",
                                    width: "20vw",
                                    margin: "0 0 5px 0"
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    opacity: "0.76",
                                    width: "20vw"
                                }}
                            >Import your entries with/without encryption from the previous exports</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "40vw"
                        }}
                    >
                        <img
                            src={"/logo.svg"}
                            alt="logo"
                            style={{
                                width: "12vw",
                            }}
                        />

                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around"
                        }}
                    >
                        <Box>
                            <Typography 
                                sx={{
                                    color: "#9c46ff",
                                    fontStyle: "italic"
                                }}
                            >Export</Typography>
                            <Divider
                                sx={{
                                    border: "0.5px solid",
                                    borderColor: "#9c46ff",
                                    width: "20vw",
                                    margin: "0 0 5px 0"
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    opacity: "0.76"
                                }}
                            >Export your entries with/without encryption</Typography>
                        </Box>
                        <Box>
                            <Typography 
                                sx={{
                                    color: "#9c46ff",
                                    fontStyle: "italic"
                                }}
                            >Import</Typography>
                            <Divider
                                sx={{
                                    border: "0.5px solid",
                                    borderColor: "#9c46ff",
                                    width: "20vw",
                                    margin: "0 0 5px 0"
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    opacity: "0.76"
                                }}
                            >Import your entries with/without encryption from the previous exports</Typography>
                        </Box>
                    </Box>
                </Grid> */}
            </Grid>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px"
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: "inherit",
                        color: "inherit",
                        height: "250px",
                        width: "430px",
                        borderRadius: "5px"
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: "22px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <Box sx={{
                            backgroundColor: (theme === "dark") ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            zIndex: -1
                        }} ></Box>

                        <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "red", margin: "auto 5px" }} ></Box>
                        <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "#ffc400", margin: "auto 5px" }} ></Box>
                        <Box sx={{ borderRadius: "50%", height: "10px", width: "10px", backgroundColor: "#00fe00", margin: "auto 5px" }} ></Box>
                    </Box>
                    <Box
                        sx={{
                            height: "93%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <img
                            src={"/logo.svg"}
                            alt="logo"
                            style={{
                                width: "70px",
                                filter: (theme === "dark") ? "brightness(10000%)": "brightness(0%)"
                            }}
                        />
                        <Typography
                            sx={{
                                margin: "10px 0",
                                fontSize: "18px"
                            }}
                        >GSecureLock</Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    </>);
}

export default Home;