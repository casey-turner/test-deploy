import axios from 'axios'
import cors from "cors"
import Express from "express"
import path from "path"
import querystring from 'querystring'
import { fileURLToPath } from 'url'
// import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from './config.js'

const SPOTIFY_CLIENT_ID = '83bae47876b140229566cd0d7a0fefc5'
const SPOTIFY_CLIENT_SECRET = '54fb5c9ad63d4e7e98cab5571812f4df'
const SPOTIFY_REDIRECT_URI = 'http://localhost:3000/callback'

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = path.dirname(currentFilePath);

const buildPath = path.join(currentDirPath, '..', '..', 'packages/app/dist');


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}
const app = Express()

app.use(Express.static(buildPath))
app.use(Express.json())
app.use(cors(corsOptions))


/**
* Generate a random string containing numbers and letters
* @param  {number} length The length of the string
* @return {string} The generated string
*/

function generateRandomString(length) { 
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const stateKey = 'spotify_auth_state';

app.get("/connect", (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private'
    }));

});

// Callback endpoint to handle the response from Spotify
app.get("/callback", (req, res) => {
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: SPOTIFY_REDIRECT_URI
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
             Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,

        }
    }).then((response) => {
        if (response.status === 200) {

            const { access_token, refresh_token, expires_in } = response.data;

            const queryParams = querystring.stringify({
                access_token,
                refresh_token,
                expires_in
            });

            console.log(queryParams);

            res.redirect(`https://test-deploy-xpzc.onrender.com/?${queryParams}`);
        } else {
            res.redirect(`https://test-deploy-xpzc.onrender.com/?${querystring.stringify({ error: 'invalid_token' })}`);
        }

    }).catch((error) => {
        res.send(error);
    });        
});




app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"))
})



app.listen(3000, () => {
  console.log(`Server is up on port 3000. ${buildPath}`)
})

