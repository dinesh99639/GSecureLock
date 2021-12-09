import { useState, useEffect } from 'react';

// import crypto from '../../Utils/crypto';

import { Grid } from '@mui/material';

import Timebar from './Timebar';
import Categories from './Categories';
import CredentialsList from './CredentialsList';
import CredentialData from './CredentialData';
import LockScreen from './LockScreen';

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;
    const { state, setState } = props;

    // const [lockTime, updateLockTime] = useState({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 });
    const [lockTime, updateLockTime] = useState({ m: 0, s: 0, lockAt: 0 });

    const [selectedCategory, updateSelectedCategory] = useState('All');
    const [selectedEntryId, updateSelectedEntryId] = useState('');

    const [categoriesCount, updateCategoriesCount] = useState([]);

    const [entriesById, updateEntriesById] = useState({});
    const [filteredEntries, updateFilteredEntries] = useState([]);

    useEffect(() => {
        if ((lockTime.m <= 0) && (lockTime.s <= 0)) {
            setState((state) => ({ ...state, data: null }));
        }
    }, [lockTime, setState]);

    useEffect(() => {
        let data = state.data;
        
        if (data) {
            let credentialsById = {};
            let categoriesCountObj = {};
            let categoriesCountArr = [];
            let totalEntries = 0;
            data.credentials.forEach((entry) => {
                credentialsById[entry.id] = entry;

                if (categoriesCountObj[entry.category]) categoriesCountObj[entry.category]++;
                else categoriesCountObj[entry.category] = 1;

                totalEntries++;
            });

            categoriesCountArr.push({ name: 'All', count: totalEntries });
            ['Passwords', 'API Keys', 'Cards', 'Coupons'].forEach((category) => {
                if (categoriesCountObj[category]) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });
                else categoriesCountArr.push({ name: category, count: 0 });

                delete categoriesCountObj[category];
            })

            for (let category in  categoriesCountObj) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });

            updateCategoriesCount(categoriesCountArr)
            updateEntriesById(credentialsById);
        }
        else updateEntriesById({});

    }, [state.data]);


    return (<>
        {(isDesktop) ? <>
            {/* <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.55} ><Timebar
                    lockTime={lockTime}
                    updateLockTime={updateLockTime}
                /></Grid>
                <Grid item xs={3} >
                    <CredentialsList 
                        state={props.state} 
                        filteredEntries={filteredEntries}
                        updateFilteredEntries={updateFilteredEntries}
                        selectedEntryId={selectedEntryId}
                        updateSelectedEntryId={updateSelectedEntryId}
                    />
                </Grid>
                <Grid item xs={5.5} ><CredentialData
                    entriesById={entriesById}
                /></Grid>
                <Grid item xs={2.95} ></Grid>
            </Grid> */}

            <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.46} ><Timebar
                    lockTime={lockTime}
                    updateLockTime={updateLockTime}
                /></Grid>
                <Grid item xs={1.7} >
                    <Categories
                        categoriesCount={categoriesCount}
                        selectedCategory={selectedCategory}
                        updateSelectedCategory={updateSelectedCategory}
                    />
                </Grid>
                <Grid item xs={2.5} >
                    <CredentialsList
                        state={props.state}
                        selectedCategory={selectedCategory}
                        filteredEntries={filteredEntries}
                        updateFilteredEntries={updateFilteredEntries}
                        selectedEntryId={selectedEntryId}
                        updateSelectedEntryId={updateSelectedEntryId}
                    />
                </Grid>
            </Grid>
        </> : <>
            Mobile View
        </>}

        {((lockTime.m <= 0) && (lockTime.s <= 0)) && <LockScreen
            state={props.state}
            setState={props.setState}
            updateLockTime={updateLockTime}
            showSnack={props.showSnack}
        />}
    </>);
}

export default Dashboard;