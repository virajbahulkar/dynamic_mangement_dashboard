// ...existing code...
import React, { useEffect, useMemo, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import useDashboardConfig from '../hooks/useDashboardConfig';
import { resolveIcon } from './iconRegistry';
import { capitalizeFirstLetter } from '../helpers/capitalize';
import useAxios from '../hooks/useAxios';
import Notification from './Notification';
import UserProfile from './UserProfile';

const NavButton = ({ title, customFunc, icon, color, dotColor, className }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className={`${className} relative text-xl rounded-full p-3 hover:bg-light-gray`}
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const NavTitle = ({ title, subtitle, className }) => (
  <p className={className}>
    <span className="text-gray-400 text-2xl">{title}</span>
    <span className="text-gray-400 font-bold ml-1 text-sm">{subtitle}</span>
  </p>
);

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  const { config: navConfigDoc } = useDashboardConfig('navbar');
  // Extract template content & its own config (renamed to avoid shadowing)
  const { contentData = [], config: templateConfig } = (navConfigDoc?.data || {}).template || {};

  const [content, setContent] = useState([]);

  // Derive API config (single) if template specifies it; memoize to keep stable reference
  const apiConfig = useMemo(() => {
    if (!templateConfig?.dataType || !templateConfig?.apiKey) return null;
    return {
      url: templateConfig.apiKey,
      key: templateConfig.dataType,
      method: 'get',
    };
  }, [templateConfig]);

  const { response } = useAxios(apiConfig ? { apis: [apiConfig] } : { apis: [] });

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  useEffect(() => {
    if (!contentData.length) return;
    if (!response || !response.length) {
      // Base content (without dynamic user data)
      setContent(contentData.map((i) => ({ ...i })));
      return;
    }
    const user = response[0] || {};
    const next = contentData.map((item) => {
      if (item?.type === 'panel') {
        return {
          ...item,
          title: item.title || capitalizeFirstLetter(user?.name || ''),
          email: user?.email_id || item.email || '',
        };
      }
      return { ...item };
    });
    setContent(next);
  }, [response, contentData]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const handleButtonClick = (action) => {
    if (action?.type === 'handleActiveMenu') {
      return handleActiveMenu();
    }
    return handleClick(action?.value);
  };

  return (
    <div className="flex p-2 ">
      {content?.map((item, idx) => (
        <React.Fragment key={idx}>
          {item?.type === 'panel' && (
            <TooltipComponent content="Profile" position="BottomCenter">
              <div
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray  border-x-1 px-6"
                onClick={() => handleButtonClick(item?.action)}
              >
                {typeof item?.icon === 'string' ? (
                  resolveIcon(item.icon) || (
                    <img className="rounded-full w-8 h-8" src={item?.icon} alt="user-profile" />
                  )
                ) : (
                  <img className="rounded-full w-8 h-8" src={item?.icon} alt="user-profile" />
                )}
                <p>
                  {item?.greeting && (
                    <span className="text-gray-400 text-14">{item?.greeting}</span>
                  )}{' '}
                  {item?.title && (
                    <span className="text-gray-400 font-bold ml-1 text-14">{item?.title}</span>
                  )}
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-14" />
              </div>
            </TooltipComponent>
          )}
          {item?.type === 'button' && (
            <NavButton
              title={item?.title}
              customFunc={() => handleButtonClick(item?.action)}
              color={currentColor}
              icon={typeof item?.icon === 'string' ? resolveIcon(item.icon) : item?.icon}
              className="flex-none"
            />
          )}
          {item?.type === 'title' && (
            <NavTitle
              title={item?.text}
              subtitle={item?.subtext}
              className={
                item?.align ? `items-${item?.align} grow flex flex-col` : 'grow flex flex-col'
              }
            />
          )}
          {isClicked.notification && <Notification />}
          {isClicked.userProfile && item?.type === 'panel' && <UserProfile data={item} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Navbar;
