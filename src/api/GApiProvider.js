import { createContext, useEffect, useCallback, useState } from "react";
import { useDispatch } from 'react-redux';
import axios from 'axios';

import config from '../config';

export const GApiContext = createContext();

var access = null;
const delay = ms => new Promise(res => setTimeout(res, ms));

export function GApiProvider(props) {
    const dispatch = useDispatch();

    const [gapi, updateGapi] = useState(null);
    const [client, updateClient] = useState(null);
    const [accessTokenCount, setAccessTokenCount] = useState(0);

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);

    const initClient = (gapi) => {
        let client = gapi.accounts.oauth2.initTokenClient({
            client_id: config.CLIENT_ID,
            scope: config.SCOPES.join(' '),
            prompt: '',
            callback: (tokenResponse) => {
                if (tokenResponse?.access_token) {
                    access = {
                        token: tokenResponse.access_token,
                        expiresAt: new Date().getTime() + 3000000
                    }
                    
                    localStorage.setItem("access", JSON.stringify(access));
                    updateLoginStatus(true);
                    setAccessTokenCount(accessTokenCount + 1);
                }
            }
        });
        updateClient(client);
    }

    const loadGoogleApi = useCallback(async () => {
        var scr = document.createElement('script');
        var head = document.head || document.getElementsByTagName('head')[0];
        scr.src = 'https://accounts.google.com/gsi/client';
        head.insertBefore(scr, head.firstChild);

        scr.addEventListener('load', async () => {
            await initClient(window.google);
            updateGapi(window.google);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAccessToken = async () => {        
        let newAccess = null;
        let isAccessTokenValid = (!!access) ? access.expiresAt > (new Date().getTime()) : false;
        
        if (!isAccessTokenValid) {
            let prevCount = window.accessTokenCount;
            client.requestAccessToken();
            
            while (prevCount === window.accessTokenCount) {
                await delay(300);
            }

            newAccess = access.token;
        }
        else newAccess = access.token;

        return newAccess;
    }

    const sendRequest = async (data) => {
        try {
            const res = await axios.request(data)
            return { success: true, data: res.data }
        }
        catch (err) {
            return { success: false, status: err.response.status }
        }
    }

    const functions = {
        isAccessTokenValid: () => (!!access) ? access.expiresAt > (new Date().getTime()) : false,
        revokeToken: () => gapi.accounts.oauth2.revoke(access.token, () => { console.log('access token revoked') }),

        getUserData: async () => {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/drive/v3/about?fields=user';
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },

        getAllFiles: async () => {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/drive/v3/files?pageSize=100&spaces=appDataFolder';
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },

        createFile: async () => {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/drive/v3/files?alt=json';
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }
            const data = {
                'name': 'data',
                'parents': ['appDataFolder']
            }

            return await sendRequest({ method: "POST", url, headers, data });
        },

        removeAllFiles: async function () {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/drive/v3/files/';
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }
            let files = await this.getAllFiles();
            if (!files.success) return files;

            files = files.data.files;
            files.forEach(async (file) => {
                await sendRequest({ method: "DELETE", url: url + file.id, headers });
            });
        },

        updateFile: async (fileId, data) => {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId;
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }
            const params = { 'uploadType': 'multipart', 'alt': 'json' }

            return await sendRequest({ method: "PATCH", url, headers, params, data: data });
        },

        downloadFile: async (fileId) => {
            let access_token = await getAccessToken();

            const url = 'https://www.googleapis.com/drive/v3/files/' + fileId + "/?alt=media";
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },
    }

    useEffect(() => {
        window.accessTokenCount = 0;
        loadGoogleApi();

        const currentAccess = localStorage.getItem("access");
        if (currentAccess) access = JSON.parse(currentAccess);
    }, [loadGoogleApi])

    useEffect(() => {
        window.accessTokenCount = accessTokenCount;
    }, [accessTokenCount])

    return (<GApiContext.Provider value={functions}>{props.children}</GApiContext.Provider>);
}

export default GApiProvider;