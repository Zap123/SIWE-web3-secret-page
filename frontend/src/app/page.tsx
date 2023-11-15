'use client';

import styles from './page.module.css';
import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
    location: Location;
  }
}

const api_path = 'http://localhost:3001';

async function login(setProfile: any, setToken: any) {
  if (window === null) return;
  const provider = new BrowserProvider(window.ethereum);

  try {
    await provider.send('eth_requestAccounts', []);

    const profile = await signInWithEthereum();
    setProfile(profile);
    setToken(localStorage.getItem('token'));
  } catch (e) {
    alert('Please connect your wallet');
  }
}

async function createSiweMessage(address: string) {
  const { statement, nonce, issuedAt, uri } = await challenge(address);
  const message = new SiweMessage({
    domain: new URL(uri).hostname,
    address,
    statement,
    uri: uri,
    version: '1',
    chainId: 1,
    nonce: nonce,
    issuedAt: issuedAt,
  });
  return [message.prepareMessage(), address, nonce, issuedAt];
}

async function challenge(address: string) {
  // Make request to /user/signin/challenge endpoint
  const data = await fetch(
    `${api_path}/user/signin/challenge?address=${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await data.json();

  return result;
}

async function profile(jwt: string) {
  // Make request to /user/signin/challenge endpoint
  const data = await fetch(`${api_path}/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const result = await data.json();

  return result;
}

async function signin(
  signature: string,
  address: string,
  nonce: string,
  issuedAt: string,
) {
  // Make request to /user/signin endpoint
  const data = await fetch(`${api_path}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      challenge: { address, nonce, issuedAt },
      signature,
    }),
  });
  const result = await data.json();

  return result;
}

async function signup(handle: string, jwt: string, setHandle: any) {
  // Make request to /user/signin endpoint
  const data = await fetch(`${api_path}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ handle }),
  });
  const result = await data.json();
  setHandle(result);
  return result;
}

async function signInWithEthereum() {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const parameters = await createSiweMessage(signer.address);
  const signed = await signer.signMessage(parameters[0]);

  const { jwt } = await signin(
    signed,
    parameters[1],
    parameters[2],
    parameters[3],
  );
  localStorage.setItem('token', jwt);
  return await profile(jwt);
}

export default function Home() {
  const [handle, setHandle] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    handle: undefined,
    address: undefined,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setLoading(true);
      // Set handle
      setToken(token);
      profile(token).then((data) => {
        setProfileData(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <main className={styles.main}>
        <h1>Loading...</h1>
      </main>
    );

  if (profileData.handle === null) {
    return (
      <main className={styles.main}>
        <h1>Hey {profileData.address}</h1>
        <h1>Choose your handle:</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup(handle, token, setProfileData);
          }}
        >
          <input type="text" onChange={(e) => setHandle(e.target.value)} />

          <button type="submit">Submit</button>
        </form>
      </main>
    );
  }

  if (profileData.handle) {
    return (
      <main className={styles.main}>
        <h1>Welcome to your profile</h1>
        <img src="/avatar.jpg" />
        <h3>handler: {profileData.handle}</h3>
        <h3>address: {profileData.address}</h3>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Web3 secret page</h1>
      <button
        className={styles.button}
        onClick={(x) => login(setProfileData, setToken)}
      >
        Login with Metamask
      </button>
    </main>
  );
}
