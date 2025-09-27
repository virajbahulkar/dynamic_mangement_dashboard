// ...existing code...
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import useDashboardConfig from '../hooks/useDashboardConfig';
import { resolveIcon } from './iconRegistry';
import { useStateContext } from '../contexts/ContextProvider';

const SideBarHeader = ({ logo, width, title }) => (
  <>
    {logo ? (
      <div>
        <img className="" src={logo} width={width} alt="logo" />
      </div>
    ) : (
      <>{title}</>
    )}
  </>
);

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const { config } = useDashboardConfig('sidebar');
  const { headerContent = {}, links = [] } = (config?.data || {}).template || {};

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-2 pl-2 pt-3 pb-2.5 rounded-lg  text-white  text-sm m-2';
  const normalLink =
    'flex items-center gap-2 pl-2 pt-3 pb-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <>
      <Link
        to="/"
        onClick={handleCloseSideBar}
        className="items-center justify-center   flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
      >
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
                      {link.icon ? resolveIcon(link.icon) : null}
                      <span className="capitalize ">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
              {/* Static tools section */}
              <div>
                <p className="text-gray-800 font-bold dark:text-gray-800 m-3 mt-6 uppercase">Tools</p>
                <NavLink
                  to="/builder"
                  key="builder"
                  onClick={handleCloseSideBar}
                  style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  <span className="capitalize">Builder</span>
                </NavLink>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
