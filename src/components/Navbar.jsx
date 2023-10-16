import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft, BsBoxArrowRight } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/avatar.jpg';
import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { navbarData } from '../data/dummy';
import useAxios from '../hooks/useAxios';

const NavButton = ({ title, customFunc, icon, color, dotColor, className }) => (
  <TooltipComponent content={title} position="BottomCenter" >
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
    <span className="text-gray-400 font-bold ml-1 text-sm">
      {subtitle}
    </span>
  </p>
)

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

  const { contentData, config } = navbarData?.template || {}

  const [ content, setContent ] = useState([])

  const [apis, setApis] = useState([]);

  const { response, error, loading } = useAxios(apis ? { apis } : [])

  const getAPiUrlFromConfig = (config) => {
    if (config?.dataType && config?.apiKey) {
      const obj = {
        url: config?.apiKey,
        key: config?.dataType,
        method: 'get'
      }
      return obj
    }
  }

  const setApiUrl = () => {
    const urlObj = getAPiUrlFromConfig(config)
    setApis(Array.apply(null, Array(urlObj)))
  }

  useMemo(() => {
    setApiUrl()
  }, [])

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();
   
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    let data = []
    if(response) {
     data = contentData.map((item) => {
        if(item?.type === 'panel') {
          item.title = response[0]?.name.charAt(0).toUpperCase() +
          response[0]?.name.slice(1)
          item.email =  response[0]?.email_id
        }
        return item
      })
      setContent(data)
    }
  }, [response])

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const handleButtonClick = (action) => {
    if (action?.type === "handleActiveMenu") {
      return handleActiveMenu()
    } else {
      return handleClick(action?.value)
    }
  }

  return (
    <div className="flex p-2 ">
      {content?.map((item) => (
        <>
          {item?.type === "panel" && (
            <TooltipComponent content="Profile" position="BottomCenter">
              <div
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray  border-x-1 px-6"
                onClick={() => handleButtonClick(item?.action)}
              >
                <img
                  className="rounded-full w-8 h-8"
                  src={item?.icon}
                  alt="user-profile"
                />
                <p>
                  {item?.greeting && <span className="text-gray-400 text-14">{item?.greeting}</span>}{' '}
                  {item?.title && <span className="text-gray-400 font-bold ml-1 text-14">
                    {item?.title}
                  </span>}
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-14" />
              </div>
            </TooltipComponent>
          )}
          <>
            {(item?.type === "button") &&
              (<NavButton
                title={item?.title}
                customFunc={() => handleButtonClick(item?.action)}
                color={currentColor}
                icon={item?.icon}
                className={'flex-none'}
              />)}
            {(item?.type === "title") &&
              (<NavTitle
                title={item?.text}
                subtitle={item?.subtext}
                className={item?.align ? `items-${item?.align} grow flex flex-col` : 'grow flex flex-col'}
              />
              )}
          </>
          {isClicked.notification && (<Notification />)}
          {(isClicked.userProfile && item?.type === "panel") && (<UserProfile data={item} />)}
        </>
      ))}
    </div>
  );
};

export default Navbar;
