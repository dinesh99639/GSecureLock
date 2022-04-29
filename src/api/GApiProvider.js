import { createContext, useEffect, useCallback, useState } from "react";
import { useDispatch } from 'react-redux';
import axios from 'axios';

import config from '../config';

export const GApiContext = createContext();

export function GApiProvider(props) {
    const dispatch = useDispatch();

    const [gapi, updateGapi] = useState(null);
    const [client, updateClient] = useState(null);
    const [access, updateAccess] = useState(null);
    const [accessTokenCount, setAccessTokenCount] = useState(0);

    const updateLoginStatus = useCallback((isLoggedIn) => dispatch({ type: "updateLoginStatus", payload: { isLoggedIn } }), [dispatch]);

    const initClient = (gapi) => {
        let client = gapi.accounts.oauth2.initTokenClient({
            client_id: config.CLIENT_ID,
            scope: config.SCOPES.join(' '),
            prompt: '',
            callback: (tokenResponse) => {
                if (tokenResponse?.access_token) {
                    const newAccess = { 
                        token: tokenResponse.access_token, 
                        expiresAt: new Date().getTime() + 3000000 
                    }
                    updateAccess(newAccess);
                    localStorage.setItem("access", JSON.stringify(newAccess));
                    updateLoginStatus(true);
                    setAccessTokenCount((accessTokenCount) => accessTokenCount + 1);
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
        accessTokenCount: accessTokenCount,

        getAccessToken: () => client.requestAccessToken(),
        isAccessTokenValid: () => (!!access) ? access.expiresAt > (new Date().getTime()) : false,
        revokeToken: () => gapi.accounts.oauth2.revoke(access.token, () => { console.log('access token revoked') }),

        getUserData: async () => {
            const url = 'https://www.googleapis.com/drive/v3/about?fields=user';
            const headers = {
                'Authorization': 'Bearer ' + access.token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },

        getAllFiles: async () => {
            const url = 'https://www.googleapis.com/drive/v3/files?pageSize=100&spaces=appDataFolder';
            const headers = {
                'Authorization': 'Bearer ' + access.token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },

        createFile: async () => {
            const url = 'https://www.googleapis.com/drive/v3/files?alt=json';
            const headers = {
                'Authorization': 'Bearer ' + access.token,
                'Accept': 'application/json'
            }
            const data = {
                'name': 'data',
                'parents': ['appDataFolder']
            }

            return await sendRequest({ method: "POST", url, headers, data });
        },

        removeAllFiles: async function () {
            const url = 'https://www.googleapis.com/drive/v3/files/';
            const headers = {
                'Authorization': 'Bearer ' + access.token,
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
            const url = 'https://www.googleapis.com/upload/drive/v3/files/' + fileId;
            const headers = {
                'Authorization': 'Bearer ' + access.token,
                'Accept': 'application/json'
            }
            const params = { 'uploadType': 'multipart', 'alt': 'json' }

            return await sendRequest({ method: "PATCH", url, headers, params, data: data });
        },

        downloadFile: async (fileId) => {
            const url = 'https://www.googleapis.com/drive/v3/files/' + fileId + "/?alt=media";
            const headers = {
                'Authorization': 'Bearer ' + access.token,
                'Accept': 'application/json'
            }

            return await sendRequest({ method: "GET", url, headers });
        },
    }

    useEffect(() => {
        loadGoogleApi();

        const access = localStorage.getItem("access");
        if (access) updateAccess(JSON.parse(access));
    }, [loadGoogleApi])

    return (<GApiContext.Provider value={functions}>{props.children}</GApiContext.Provider>);
}

export default GApiProvider;