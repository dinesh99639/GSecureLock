import { createContext, useEffect, useCallback, useState } from "react";
import axios from 'axios';

export const GApiContext = createContext();

export function GApiProvider(props) {
    const [gapi, updateGapi] = useState(null);
    const [client, updateClient] = useState(null);
    const [access_token, updateAccessToken] = useState(null);

    const initClient = (gapi) => {
        let client = gapi.accounts.oauth2.initTokenClient({
            client_id: '836773668273-irh9tdmqvf7r0m8rts3e5sim8c8flefl.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.appdata profile',
            prompt: '',
            callback: (tokenResponse) => {
                updateAccessToken(tokenResponse.access_token);
                console.log(gapi)
            },
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
    }, []);

    const functions = {
        getAccessToken: () => client.requestAccessToken(),
        revokeToken: () =>  gapi.accounts.oauth2.revoke(access_token, () => { console.log('access token revoked') }),

        getUserData: async () => {
            // var xhr = new XMLHttpRequest();
            // xhr.open('GET', 'https://www.googleapis.com/drive/v3/about?fields=user');
            // xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
            // xhr.onload = () => {
            //     console.log(xhr.responseText)
            // }
            // xhr.send();

            const res = await axios.get('https://www.googleapis.com/drive/v3/about?fields=user', {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json'
                }
            }).catch((err) => {
                console.log(err)
            })

            console.log(res.data)
        },
    }

    useEffect(() => {
        loadGoogleApi();
    }, [loadGoogleApi])

    return (<GApiContext.Provider value={functions}>{props.children}</GApiContext.Provider>);
}

export default GApiProvider;