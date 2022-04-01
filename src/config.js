const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const config = {
    CLIENT_ID,
    SCOPES: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.appdata",
        "profile"
    ]
}

export default config;