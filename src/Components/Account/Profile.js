import { createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Box, Avatar, Typography } from "@mui/material";

function Profile() {
    const { user, theme } = useSelector((state) => state.config);
    const { savedEntries, templates } = useSelector((state) => state.entries);
    const entriesCanvas = createRef(null);

    console.log(templates.length)

    let entriesChartData = [
        { label: "Templates", color: "#04ff3a", value: templates.length },
        { label: "Credentials", color: "#0497ff", value: savedEntries.length }
    ]

    useEffect(() => {
        function donutChart(cx, cy, radius, arcwidth, data) {
            var canvas = entriesCanvas.current;
            var ctx = canvas.getContext("2d");

            var tot = 0;
            var accum = 0;
            var PI = Math.PI;
            var PI2 = PI * 2;
            var offset = -PI / 2;
            ctx.lineWidth = arcwidth;
            for (let i = 0; i < data.length; i++) { tot += data[i].value; }
            for (let i = 0; i < data.length; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, radius,
                    offset + PI2 * (accum / tot),
                    offset + PI2 * ((accum + data[i].value) / tot)
                );
                ctx.strokeStyle = data[i].color;
                ctx.stroke();
                accum += data[i].value;
            }
            var innerRadius = radius - arcwidth - 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = (theme === "dark") ? "white" : "black";
            ctx.font = (innerRadius / 5) + 'px verdana';
            ctx.fillText("Entries", cx, cy + innerRadius * .1);
        }

        donutChart(100, 100, 80, 15, entriesChartData);
    }, [theme, entriesChartData, entriesCanvas])

    return (<>
        <Box
            sx={{
                margin: "20px 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <Avatar alt={user.name} src={user.image} sx={{ width: 90, height: 90, margin: "auto 5px", fontSize: "30px", backgroundColor: "rgba(0, 0, 0, 0.2)" }} />
            <Typography sx={{ fontSize: "15px", margin: "5px 0 0 0", textAlign: "center" }} >{user.name}</Typography>
            <Typography
                sx={{
                    fontSize: "12px",
                    opacity: 0.76,
                    textAlign: "center"
                }}
            >@{user.email.split("@")[0]}</Typography>
        </Box>

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "50px 0 0 0"
            }}
        >
            <Typography>Statistics</Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "15px 0 0 0"
                }}
            >
                <canvas id="canvas" ref={entriesCanvas} width="200" height="200"></canvas>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}
                >

                    {
                        entriesChartData.map((data) => {
                            return <Box
                                key={data.label}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "8px 0"
                                }}
                            >
                                <Box sx={{ height: "15px", width: "15px", backgroundColor: data.color, borderRadius: "50%" }} ></Box>
                                <Typography style={{ padding: "0 5px" }} >{data.label}</Typography>
                            </Box>
                        })
                    }
                </Box>
            </Box>
        </Box>
    </>);
}

export default Profile;