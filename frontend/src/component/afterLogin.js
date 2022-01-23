import avatar from '../src-assets/image/avatar.png';
import avatarAdmin from '../src-assets/image/avatar-admin.png';
import iconAddMusic from '../src-assets/image/icon-add-music.svg';
import iconAddArtis from '../src-assets/image/icon-add-artis.svg';
import iconPay from '../src-assets/image/icon-pay.svg';
import iconLogout from '../src-assets/image/icon-logout.svg';

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/authContext';
import { useHistory } from "react-router-dom";

function CompAfterLogin() {
  // Dropdown handler
  const [stateDropdown, setStateDropdown] = useState('none');
  const toggleDropdown = () => stateDropdown === 'none' ? setStateDropdown('block') : setStateDropdown('none');
  const closeDropdown = () => setStateDropdown('none');

  const history = useHistory();
  const [stateUser, dispatchUser] = useContext(UserContext)
  const isAdmin = (stateUser.user.listAs === "1") ? true : false;
  // Logout handler
  const logoutHandler = () => {
    dispatchUser({
      type: 'LOGOUT',
    });

    history.push('/');
  }

  return (
    <>
      <div
        style={{ display: stateDropdown }}
        onClick={closeDropdown}
        className='fixed inset-x-0 top-0 visible h-screen'
      />
      <div className='relative'>
        <div
          onClick={toggleDropdown}
          className='w-11 h-11 cursor-pointer'
        >
          <img src={isAdmin ? avatarAdmin : avatar} alt="Avatar User" />
        </div>

        {/* Dropdown Menu */}
        <div
          style={{ display: stateDropdown }}
          className='absolute right-2 top-14 w-0 h-0 border-x-12 border-b-24 border-b-gray-ds-100 border-x-transparent'
        />
        <div
          style={{ display: stateDropdown }}
          className='absolute right-0 top-20 w-48'>
          <div className='z-10 flex flex-col bg-gray-ds-100 py-6 rounded-md shadow-md'>
            {isAdmin ?
              <>
                <Link to='/add-music'>
                  <div className='flex flex-row items-center mb-6 px-4'>
                    <div className='w-6 mr-3'>
                      <img src={iconAddMusic} alt="Icon Add Music" />
                    </div>
                    <div className='text-white hover:text-orange-ds-200 font-semibold'>
                      Add Music
                    </div>
                  </div>
                </Link>
                <Link to='/add-artis'>
                  <div className='flex flex-row items-center mb-6 px-4'>
                    <div className='w-6 mr-3'>
                      <img src={iconAddArtis} alt="Icon Add Artis" />
                    </div>
                    <div className='text-white hover:text-orange-ds-200 font-semibold'>
                      Add Artis
                    </div>
                  </div>
                </Link>
              </>
              :
              <Link to='/subscribe'>
                <div className='flex flex-row items-center mb-6 px-4'>
                  <div className='w-6 mr-3'>
                    <img src={iconPay} alt="Icon Pay" />
                  </div>
                  <div className='text-white hover:text-orange-ds-200 font-semibold'>
                    Pay
                  </div >
                </div>
              </Link>
            }
            <div className='h-0.5 bg-gray-400 mb-5' />
            <div
              onClick={logoutHandler}
              className='cursor-pointer flex flex-row items-center px-4'
            >
              <div className='w-6 mr-3'>
                <img src={iconLogout} alt="Icon Logout" />
              </div>
              <div className='text-white hover:text-orange-ds-200 font-semibold'>
                Logout
              </div >
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompAfterLogin;