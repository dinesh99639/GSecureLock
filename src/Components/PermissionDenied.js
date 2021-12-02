import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Box, Typography } from '@mui/material';

function PermissionDenied() {
    const history = useHistory();
    const [currentCount, setCount] = useState(5);
    
    useEffect(
        () => {
            if (currentCount <= 0) {
                history.replace('/')
                return;
            }
            const id = setInterval(() => setCount(currentCount - 1), 1000);
            return () => clearInterval(id);
        },
        [currentCount, history]
    );

    return (<>
        <Box style={{ textAlign: "center", margin: "76px 0" }}>
            <Typography variant="h6">You do not have access to this page</Typography>
            <Typography variant="body1" style={{ margin: "10px 0" }}>You will be redireected in</Typography>
            <Typography variant="body1" style={{ margin: "10px 0" }}>{currentCount} sec</Typography>

        </Box>
    </>);
}

export default PermissionDenied;