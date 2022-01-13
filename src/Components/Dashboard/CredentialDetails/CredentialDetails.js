import { useSelector } from 'react-redux';

import { Grid } from "@mui/material";

import CredentialData from './CredentialData/CredentialData';
import EntryOptions from './EntryOptions/EntryOptions';

function CredentialDetails(props) {

    const { saveEntry, deleteEntry } = props;

    const { entryData } = useSelector((state) => state.entries);

    return (<>
        <Grid container style={{ height: "100%" }} >
            {(entryData !== null) ? <>
                <Grid item xs={6.54}>
                    <CredentialData
                        saveEntry={saveEntry}
                        deleteEntry={deleteEntry}
                    />
                </Grid>
                <Grid item xs={5.46}>
                    <EntryOptions />
                </Grid>
            </> : null}
        </Grid>
    </>);
}

export default CredentialDetails;