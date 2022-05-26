import {
  FaHeart,
  FaHandsHelping,
  FaVoteYea,
  FaPaperPlane,
  FaRegComments,
  FaTachometerAlt,
  FaHandHoldingHeart,
  FaCompress,
} from 'react-icons/fa';

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from 'react-pro-sidebar';

import 'react-pro-sidebar/dist/css/styles.css';
import { WebsiteRights } from '../Footer/FooterElements';
import { Img } from '../InfoSection/InfoElements';
import { NavLogo, NavBtnClick } from '../Navbar/NavbarElements';

import { Link } from 'react-router-dom';

import './index.scss';
import { useState } from 'react';

const VerticalNavbar = ({ collapsed, handleCollapse, toggled }) => {
  const [activePage, setActivePage] = useState(null);

  function handleActive(event) {
    if (!event.target.classList.value.includes('active')) {
      event.target.classList.toggle('active');
      if (activePage) activePage.classList.remove('active');
      setActivePage(event.target);
    }
  }

  return (
    <ProSidebar collapsed={collapsed} toggled={toggled} className='box'>
      <SidebarHeader>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            paddingRight: '20px',
          }}
        >
          {!collapsed && (
            <NavLogo to='/'>
              <Img
                src={require('../../images/logo-text-white.png')}
                alt='Logo'
              />
            </NavLogo>
          )}
          <NavBtnClick onClick={() => handleCollapse(!collapsed)}>
            <FaCompress />
          </NavBtnClick>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu>
          <MenuItem
            active={window.location.pathname === '/'}
            onClick={handleActive}
            icon={<FaTachometerAlt />}
          >
            Dashboard
            <Link to='/' onClick={handleActive} />
          </MenuItem>
          <MenuItem
            active={window.location.pathname === '/helpOthers'}
            icon={<FaHandHoldingHeart />}
          >
            Help Others
            <Link to='/helpOthers' onClick={handleActive} />
          </MenuItem>

          <MenuItem
            active={window.location.pathname === '/getHelp'}
            icon={<FaHeart />}
          >
            Get Help
            <Link to='/getHelp' onClick={handleActive} />
          </MenuItem>
          <MenuItem
            active={window.location.pathname === '/messages'}
            icon={<FaPaperPlane />}
          >
            Messages
            <Link to='/messages' onClick={handleActive} />
          </MenuItem>
          <MenuItem
            active={window.location.pathname === '/chat'}
            icon={<FaRegComments />}
          >
            Chat Room
            <Link to='/chat' onClick={handleActive} />
          </MenuItem>
          <MenuItem
            active={window.location.pathname === '/vote'}
            icon={<FaVoteYea />}
          >
            Voting Hub
            <Link to='/vote' onClick={handleActive} />
          </MenuItem>
          <MenuItem
            active={window.location.pathname === '/support'}
            icon={<FaHandsHelping />}
          >
            Support Us
            <Link to='/support' onClick={handleActive} />
          </MenuItem>
        </Menu>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter>
          <div style={{ margin: '20px' }}>
            <WebsiteRights>
              Wolon<sup> 3.0</sup> © 2022 All rights reserved.
            </WebsiteRights>
          </div>
        </SidebarFooter>
      )}
    </ProSidebar>
  );
};

export default VerticalNavbar;
