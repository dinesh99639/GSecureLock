import { useEffect } from "react";

import { Button } from '@mui/material';

function Home() {
    const login = () => window.gapi.auth2.getAuthInstance().signIn();

    return (<>
        <img
            src={"/logo.svg"}
            alt="logo"
            style={{
                height: "150px",
                margin: "auto",
                filter: "brightness(10000%)"
            }}
        />
    </>);
}

export default Home;