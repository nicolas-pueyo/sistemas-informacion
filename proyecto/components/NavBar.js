// RatingBox.js
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const NavBar = ({}) => {
  const { data: session, status } = useSession();

  return (
    <div className="home">
        <div className="left">
                <Link href="/home" className="home-icon">
                <img className="pres-logo" src="/img/logo-trans.png" alt="Logo" />
                </Link>
              
        </div>
        <div className="center">
          <h1 className="main-title">NÉBULA</h1>
        </div>
        <div className="right">
          {status === 'authenticated' && (
            <>
              <Link href="/account" className="home-icon">
                <img className="session" src="/img/session.png" alt="Account" />
              </Link>
              <Link href="/ubi" className="home-icon">
                <img className="ubi" src="/img/ubi.png" alt="Location" />
              </Link>
            </>
          )}
        </div>
      </div>
  );
};

export default NavBar;
