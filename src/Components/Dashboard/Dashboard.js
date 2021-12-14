import { useState, useEffect } from 'react';

// import crypto from '../../Utils/crypto';

import { Grid, Box, Typography } from '@mui/material';

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

    const [categories, updateCategories] = useState({});
    const [categoriesCount, updateCategoriesCount] = useState([]);

    const [entriesById, updateEntriesById] = useState(null);

    useEffect(() => {
        // if (lockTime.m > 0 && lockTime.s > 0) 
        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27) updateSelectedEntryId('')
        }, false);
    }, []);

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
            updateCategories({ ...categoriesCountObj });

            categoriesCountArr.push({ name: 'All', count: totalEntries });
            ['Passwords', 'API Keys', 'Cards', 'Coupons'].forEach((category) => {
                if (categoriesCountObj[category]) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });
                else categoriesCountArr.push({ name: category, count: 0 });

                delete categoriesCountObj[category];
            })

            for (let category in categoriesCountObj) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });

            updateCategoriesCount(categoriesCountArr)
            updateEntriesById(credentialsById);
        }
        else updateEntriesById(null);

    }, [state.data]);


    return (<>
        {(isDesktop) ? <>
            <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.46} >
                    <Timebar
                        lockTime={lockTime}
                        updateLockTime={updateLockTime}
                    />
                </Grid>
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
                        selectedEntryId={selectedEntryId}
                        updateSelectedEntryId={updateSelectedEntryId}
                    />
                </Grid>

                {(selectedEntryId !== '' && entriesById) ? <>
                    <Grid item xs={4} >
                        <CredentialData
                            entriesById={entriesById}
                            selectedEntryId={selectedEntryId}
                            entryData={entriesById[selectedEntryId]}

                            categories={categories}
                        />
                    </Grid>
                </> : <>
                    <Grid item xs={7.34} >
                        <Box
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Typography style={{ fontSize: "25px" }} >GSecurePass</Typography>
                            <Typography style={{ fontSize: "15px" }} >A secure password manager</Typography>
                        </Box>
                    </Grid>
                </>}
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