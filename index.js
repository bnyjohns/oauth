const express = require('express');
const cors = require('cors')
const axios = require('axios').default;
const app = express();
const dir = `${__dirname}/public/`;

app.use(cors());

app.get('/login', function(req,res) {
    res.sendFile(dir + 'index.html');
});

app.get('/handle_callback', async (req, res) => {
    const code = req.query['code'];
    const accessToken = await getAccessToken(code);
    const { name, email, user_id, postal_code } = await getProfile(accessToken);
    const div = `
    <div>
        <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
        </ul>
    </div>`;
    res.send(div);
});

async function getAccessToken(code){
    //Here we are using the code to get the access_token
    const url = 'https://api.amazon.com/auth/o2/token';
    const response = await axios.post(url, {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'https://ba136f528fcf.ngrok.io/handle_callback',
        'client_id': 'amzn1.application-oa2-client.b37e161d1c4d457ebacc44d9dcd00ad8',
        'client_secret': '3ce03d1b02c3f562fd1323b044ec92102fa49da49488fb9c2236aa857c74ae26'
    });
    const { access_token, token_type, expires_in, refresh_token } = response.data;
    return access_token;
}

async function getProfile(accessToken){
    //Using accessToken to get the user profile
    const url = `https://api.amazon.com/user/profile?access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
}

app.listen(3000, () => console.log('server started'));