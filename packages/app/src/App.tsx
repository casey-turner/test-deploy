// @ts-nocheck
import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import { getSpotifyAccessToken, getUserProfile } from './services/spotify';
import viteLogo from '/vite.svg';
function App() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Promise | null>(null);
  const [count, setCount] = useState(0);
  const handleConnectClick = () => {
    window.location.href = 'http://localhost:3000/connect';
  };

  const handleGetUserProfile = async () => {
    setToken(getSpotifyAccessToken);
    try {
      const { data } = await getUserProfile();
      setProfile(data);
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <a
          href='https://vitejs.dev'
          target='_blank'
        >
          <img
            src={viteLogo}
            className='logo'
            alt='Vite logo'
          />
        </a>
        <a
          href='https://react.dev'
          target='_blank'
        >
          <img
            src={reactLogo}
            className='logo react'
            alt='React logo'
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button onClick={handleConnectClick}>Connect to Spotify</button>
      <button onClick={handleGetUserProfile}>Get User Profile</button>
      {profile && (
        <div>
          <h2>{profile.display_name}</h2>
          {profile.images.length && profile.images[0].url && (
            <img
              src={profile.images[0].url}
              alt='profile'
            />
          )}
        </div>
      )}
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
