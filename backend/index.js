const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
  origin: "http://localhost:5173",
};

const app = express();
app.use(cors(corsOptions));

app.get('/google_signin', (req, res) => {
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.CLIENT_URL}&response_type=code&scope=openid%20profile%20email`;
    res.json({ url: googleLoginUrl });
} );

app.get('/google_signin/callback', async (req, res) => {
    const code = req.query.code;
    const userDetails = await getGoogleUserDetails(code);
    if (!userDetails) {
      res.status(500).send('Error getting user details');
      return;
    }
    res.send(userDetails);
} );

async function getGoogleUserDetails(code) {
    try {           
        // Get access token
        const response = await axios
        .post(
        'https://oauth2.googleapis.com/token',
        {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.CLIENT_URL}`,
            grant_type: 'authorization_code',
        },
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        )
        .catch((error) => {
        console.log('Error getting accessTokenFromCode ');
        console.log(error);
        return null;
        });
    if (!response) return null;

    const accessToken = response.data.access_token;
    if (!accessToken) return null;

    // Fetch user details using the access token
    const userResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    const userDetails = userResponse.data;
    
    console.log('User Details:' + JSON.stringify(userDetails));
    return userDetails;
    } catch (error) {
        console.log('Error in google auth ' + error.message);
    return null;
    }
}

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});