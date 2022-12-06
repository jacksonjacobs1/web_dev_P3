import React, { useState, useEffect, useRef } from 'react';
import Plot from './Plot.js';
var axios = require('axios');
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function Scatter(props) {
  const CLIENT_ID = '8b3ff52ea82b45379c37e8acd3ba412a';
  const REDIRECT_URI = new URL('/callback', window.location.origin).href;
  console.log(REDIRECT_URI);
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');
  const [data, setData] = useState([]);

  const getSongData = async (access_token, ids, names) => {
    const idString = ids.join(',');

    var config = {
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        ids: idString,
      },
    };

    axios(config)
      .then(function (response) {
        const featsArray = response.data.audio_features;
        const feats = [];
        for (let i = 0; i < featsArray.length; i++) {
          feats.push({
            x: featsArray[i].tempo,
            y: featsArray[i].danceability,
            name: names[i],
          });
        }
        setData(feats);
        console.log(feats);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTopIds = async (access_token) => {
    console.log(`token length: ${access_token.length}`);

    var config = {
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    axios(config)
      .then(function (response) {
        const tracks = response.data.tracks.items;
        const ids = tracks.map((item) => item.track.id);
        const names = tracks.map((item) => item.track.name);
        getSongData(access_token, ids, names);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const hash = window.location.hash;
    console.log(hash);

    if (hash) {
      const window_token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];
      setToken(window_token);
      getTopIds(window_token);
    }
  }, []);

  if (data.length === 0) {
    return (
      <div className="App">
        <header className="App-header">
          
          <div style={{ margin: 'auto', width: 300 }}>
          <h1>Spotify React</h1>
            <Button
              variant="outlined"
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
            >
              Log in to Spotify
            </Button>
          </div>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
        <div style={{ margin: 'auto', width: 300 }}>
          <h1>Spotify React</h1>
        </div>

        </header>
        <div style={{ padding: 20 }}>
          <Paper elevation={10}>
            <Plot data={data}></Plot>
          </Paper>
        </div>
      </div>
    );
  }
}
