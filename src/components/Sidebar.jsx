import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { sidebarData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const { headerContent, links } = sidebarData?.template || {}

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-2 pl-2 pt-3 pb-2.5 rounded-lg  text-white  text-sm m-2';
  const normalLink = 'flex items-center gap-2 pl-2 pt-3 pb-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const SideBarHeader = (props) => (
    <>
      {props.logo ? 
          <div>
            <img
              className=""
              src={props.logo}
              width={props.width}
              alt="logo"
            />
          </div> : 
          <>{props.title}</>
      }
    </>
  );


  return (
    <>
      <Link to="/" onClick={handleCloseSideBar} className="items-center justify-center   flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
        <SideBarHeader  
          logo={headerContent.logo}
          width={headerContent.width} 
          title={headerContent.title}
        />
      </Link>
      <div className="ml-3  h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
        {activeMenu && (
          <>
            <div className="flex justify-between items-center">
              <TooltipComponent content="Menu" position="BottomCenter">
                <button
                  type="button"
                  onClick={() => setActiveMenu(!activeMenu)}
                  style={{ color: currentColor }}
                  className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                >
                  <MdOutlineCancel />
                </button>
              </TooltipComponent>
            </div>
            <div className="mt-10 ">
              {links.map((item) => (
                <div key={item.title}>
                  <p className="text-gray-800 font-bold dark:text-gray-800 m-3 mt-4 uppercase">
                    {item.title}
                  </p>
                  {item.links.map((link) => (
                    <NavLink
                      to={`/${link.name}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentColor : '',
                      })}
                      className={({ isActive }) => (isActive ? activeLink : normalLink)}
                    >
                      {link.icon}
                      <span className="capitalize ">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
    
  );
};

export default Sidebar;
