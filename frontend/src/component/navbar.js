// Assets
import logo from '../src-assets/image/logo.svg';

// Sub component
import CompLogin from './login';
import CompRegister from './register';
import CompAfterLogin from './afterLogin';

import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/authContext';

function WrapperNavbar(props) {
  // Ref: https://stackoverflow.com/a/59511511
  const [navBackgroundColor, setNavBackgroundColor] = useState("bg-transparent");
  const isFixedColorNav = props.isFixedColorNav;
  useEffect(() => {
    console.log("running nav");
    if (!isFixedColorNav) {
      const onScroll = () => {
        const backgroundColor = window.scrollY >= 50 ? "bg-gray-ds-300" : "bg-transparent";
        setNavBackgroundColor(backgroundColor);
      }
  
      document.addEventListener("scroll", onScroll);
  
      // Fix memory leak: https://stackoverflow.com/a/56606967
      // Cleaning the event handler from web API
      return () => {
        document.removeEventListener("scroll", onScroll);
      }
    } else {
      setNavBackgroundColor("bg-gray-ds-300");
    }
  }, [isFixedColorNav, navBackgroundColor, setNavBackgroundColor]);

  return (
    <div className={`${navBackgroundColor} fixed z-20 inset-x-0 top-0 h-16 flex flex-row justify-center`}>
      <div className='flex flex-row justify-between items-center h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16'>
        <div>
          <Link to='/'>
            <img src={logo} alt='Logo' /> 
          </Link>
        </div>
        <div className='flex flex-row items-center'>
          {props.children}
        </div>
      </div>
    </div>
  );
}

function CompNavbar(props) {
  const [state,] = useContext(UserContext);
  const isLogin = state.isLogin;
  const isFixedColorNav = props.isFixedColorNav;
  
  return (
    <WrapperNavbar isFixedColorNav={isFixedColorNav}>
      { isLogin ?
        <CompAfterLogin />
        :
        <>
          <CompLogin />
          <CompRegister />
        </>
      }
    </WrapperNavbar>
  );
}

export default CompNavbar;