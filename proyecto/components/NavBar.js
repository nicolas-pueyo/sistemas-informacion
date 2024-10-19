// RatingBox.js
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const NavBar = ({}) => {
  const { data: session, status } = useSession();

  return (
    <div id="home">
        <div id="left">
                <Link href="/" className="home-icon">
                <img className="home-icon" id="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                </Link>
              
        </div>
        <div id="center">
          <h1 id="main-title">NÉBULA</h1>
        </div>
        <div id="right">
          {status === 'authenticated' && (
            <>
              <Link href="/account" className="home-icon">
                <img id="session" className="session" src="/img/session.png" alt="Account" />
              </Link>
              <Link href="/ubi" className="home-icon">
                <img id="ubi" className="ubi" src="/img/ubi.png" alt="Location" />
              </Link>
            </>
          )}
        </div>
      </div>
  );
};

export default NavBar;
