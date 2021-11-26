import { useEffect } from "react";

import { Button } from '@mui/material';

function Home() {
    const login = () => window.gapi.auth2.getAuthInstance().signIn();

    useEffect(() => {
        window.onload = () => console.log(window.gapi.client);
    }, []);

    return (<>
        <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant="contained" onClick={login}>Login</Button>
            <Button variant="contained" onClick={login}>Check isK</Button>
        </div>
    </>);
}

export default Home;