import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import initData from '../../initData';
import { darkTheme } from '../../Theme';

import { Grid, Box, Typography, Modal, Paper, Button } from '@mui/material';

import Timebar from './Timebar';
import Categories from './Categories';
import CredentialsList from './CredentialsList';
import CredentialDetails from './CredentialDetails/CredentialDetails';

import LockScreen from './LockScreen';

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;
    const dispatch = useDispatch();

    const [password, updatePassword] = useState('');
    const [isSessionLocked, updateIsSessionLocked] = useState(true);

    const lockTime = useSelector((state) => state.lockTime);
    const updateLockTime = useCallback((lockTime) => dispatch({ type: "updateLockTime", payload: { lockTime } }), [dispatch]);

    const { theme } = useSelector((state) => state.config);

    const { entriesById, selectedEntryId, newEntryId, savedEntries, templates, drafts, isTemplateMode } = useSelector((state) => state.entries);

    const updateCategories = useCallback((categories) => dispatch({ type: "updateCategories", payload: { categories } }), [dispatch]);
    const updateCategoriesCount = useCallback((categoriesCount) => dispatch({ type: "updateCategoriesCount", payload: { categoriesCount } }), [dispatch]);
    const updateEntriesById = useCallback((entriesById) => dispatch({ type: "updateEntriesById", payload: { entriesById } }), [dispatch]);
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);
    const updateNewEntryId = useCallback((newEntryId) => dispatch({ type: "updateNewEntryId", payload: { newEntryId } }), [dispatch]);


    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") updateSelectedEntryId('')
        }, false);
    }, [updateSelectedEntryId]);

    useEffect(() => {

        if (savedEntries) {
            let credentialsById = {};
            let categoriesCountObj = {};
            let categoriesCountArr = [];
            let totalEntries = 0;

            let entries = [];
            if (isTemplateMode) entries = [...templates];
            else entries = [...savedEntries];

            entries.forEach((entry) => {
                credentialsById[entry.id] = entry;

                if (categoriesCountObj[entry.category]) categoriesCountObj[entry.category]++;
                else categoriesCountObj[entry.category] = 1;

                totalEntries++;
            });
            updateCategories({ ...categoriesCountObj });

            categoriesCountArr.push({ name: 'All', count: totalEntries });
            initData.staticCategories.forEach((category) => {
                if (categoriesCountObj[category]) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });
                else categoriesCountArr.push({ name: category, count: 0 });

                delete categoriesCountObj[category];
            })

            for (let category in categoriesCountObj) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });

            updateCategoriesCount(categoriesCountArr)
            updateEntriesById(credentialsById);

            if (newEntryId !== '') {
                updateSelectedEntryId(newEntryId);
                updateNewEntryId('');
            }
        }
        else updateEntriesById(null);

    }, [newEntryId, savedEntries, isTemplateMode, templates, updateCategories, updateCategoriesCount, updateEntriesById, updateSelectedEntryId, updateNewEntryId]);


    return (<>
        {(isDesktop) ? <>
            {(!isSessionLocked) ? <>
                <Grid container style={{ display: "flex", flex: 1 }} >
                    <Grid item xs={0.46} >
                        <Timebar
                            updatePassword={updatePassword}
                            updateIsSessionLocked={updateIsSessionLocked}
                        />
                    </Grid>
                    <Grid item xs={1.7} >
                        <Categories />
                    </Grid>
                    <Grid item xs={2.5} >
                        <CredentialsList
                            password={password}
                        />
                    </Grid>

                    <Grid item xs={7.34} >
                        {(selectedEntryId !== '' && entriesById) ? <>
                            <CredentialDetails
                                password={password}
                            />
                        </> : <>
                            <Box
                                style={{
                                    height: "100%",
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
                                        margin: "10px 0",
                                        width: "70px",
                                        filter: (theme === "dark") ? "brightness(10000%)": "brightness(0%)"
                                    }}
                                />
                                <Typography style={{ fontSize: "25px" }} >GSecureLock</Typography>
                                <Typography style={{ fontSize: "14.5px" }} >A secure password manager</Typography>
                            </Box>
                        </>}
                    </Grid>

                </Grid>
            </> : null}
        </> : <>
            Mobile View
        </>}

        {(isSessionLocked) && <LockScreen
            updateIsSessionLocked={updateIsSessionLocked}

            password={password}
            updatePassword={updatePassword}
        />}

        {((lockTime.m === 0) && (lockTime.s <= 10) && (lockTime.s > 0) && (Object.keys(drafts).length > 0)) && <>
            <Modal
                open={true}
            >
                <Paper
                    elevation={5}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : "",
                        color: "inherit",
                        outline: "none",
                        borderRadius: "7px",
                        padding: "10px"

                    }}
                >
                    <Typography style={{ textAlign: "center", margin: "10px" }} >
                        Your session will be locked in
                    </Typography>
                    <Typography style={{ textAlign: "center", margin: "10px" }} >
                        {lockTime.s} sec
                    </Typography>
                    <Box style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }} >
                        <Button
                            variant="contained"
                            style={{
                                fontSize: "14px",
                                padding: "3px 0",
                                width: "120px",
                                textTransform: 'none'
                            }}
                            onClick={() => updateLockTime({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 })}
                        >Extend 5 mins</Button>
                    </Box>
                </Paper>
            </Modal>
        </>}
    </>);
}

export default Dashboard;