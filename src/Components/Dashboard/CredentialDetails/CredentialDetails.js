import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Grid } from "@mui/material";

import CredentialData from './CredentialData/CredentialData';
import EntryOptions from './EntryOptions/EntryOptions';

function CredentialDetails(props) {
    const dispatch = useDispatch();

    const { saveEntry, deleteEntry } = props;

    const { entriesById, selectedEntryId, entryData } = useSelector((state) => state.entries);

    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);

    const [isUpdateFromFieldOptions, updateIsUpdateFromFieldOptions] = useState(false);

    useEffect(() => {
        updateEntryData(entriesById[selectedEntryId]);
    }, [entriesById, selectedEntryId, updateEntryData])

    return (<>
        <Grid container style={{ height: "100%" }} >
            {(entryData !== null) ? <>
                <Grid item xs={6.54}>
                    <CredentialData
                        saveEntry={saveEntry}
                        deleteEntry={deleteEntry}
                        
                        isUpdateFromFieldOptions={isUpdateFromFieldOptions}
                        updateIsUpdateFromFieldOptions={updateIsUpdateFromFieldOptions}
                    />
                </Grid>
                <Grid item xs={5.46}>
                    <EntryOptions
                        updateIsUpdateFromFieldOptions={updateIsUpdateFromFieldOptions}
                    />
                </Grid>
            </> : null}
        </Grid>
    </>);
}

export default CredentialDetails;