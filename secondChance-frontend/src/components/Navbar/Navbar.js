import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();

  const navigate = useNavigate();
  useEffect(() => {
    const authTokenFromSession = sessionStorage.getItem('auth-token');
    const nameFromSession = sessionStorage.getItem('name');
    if (authTokenFromSession) {
      if (isLoggedIn && nameFromSession) {
        setUserName(nameFromSession);
      } else {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName])
  const handleLogout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    setIsLoggedIn(false);
    navigate(`/app`);

  }
  const profileSecton = () => {
    navigate(`/app/profile`);
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg" id='navbar_container'>
        <Link className="navbar-brand" to="/app">SecondChance</Link>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/app" end>Items</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/app/search">Search</NavLink>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item"> <span className="nav-link" style={{ color: "var(--text-primary)", cursor: "pointer" }} onClick={profileSecton}>Welcome, {userName}</span> </li>
                <li className="nav-item"><button className="nav-link logout-btn btn" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item">

                  <Link className="nav-link login-btn" to="/app/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link register-btn" to="/app/register">Register</Link>
                </li>
              </>
            )

            }
          </ul>
        </div>
      </nav>
    </>
  )
}
