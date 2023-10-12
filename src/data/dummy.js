import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingBag, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsCurrencyDollar, BsShield, BsChatLeft, BsFillArrowRightSquareFill } from 'react-icons/bs';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GrLocation } from 'react-icons/gr';
import avatar from './avatar.jpg';
import logo from './logo.png';
import { RiNotification3Line } from 'react-icons/ri';
import { BsBoxArrowRight } from 'react-icons/bs';

export const areaPrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'y',
  majorGridLines: { width: 0 },
  intervalType: 'Years',
  edgeLabelPlacement: 'Shift',
  labelStyle: { color: 'gray' },
};

export const areaPrimaryYAxis = {
  labelFormat: '{value}%',
  lineStyle: { width: 0 },
  maximum: 4,
  interval: 1,
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelStyle: { color: 'gray' },

};
export const barPrimaryXAxis = {
  valueType: 'Category',
  interval: 1,
  majorGridLines: { width: 0 },
};
export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelStyle: { color: 'transparent' },
};

export const colorMappingData = [
  [
    { x: 'Jan', y: 6.96 },
    { x: 'Feb', y: 8.9 },
    { x: 'Mar', y: 12 },
    { x: 'Apr', y: 17.5 },
    { x: 'May', y: 22.1 },
    { x: 'June', y: 25 },
    { x: 'July', y: 29.4 },
    { x: 'Aug', y: 29.6 },
    { x: 'Sep', y: 25.8 },
    { x: 'Oct', y: 21.1 },
    { x: 'Nov', y: 15.5 },
    { x: 'Dec', y: 9.9 },
  ],
  ['#FFFF99'],
  ['#FFA500'],
  ['#FF4040'],
];

export const rangeColorMapping = [
  {
    label: '1°C to 10°C',
    start: '1',
    end: '10',
    colors: colorMappingData[1]
  },

  {
    label: '11°C to 20°C',
    start: '11',
    end: '20',
    colors: colorMappingData[2]
  },

  {
    label: '21°C to 30°C',
    start: '21',
    end: '30',
    colors: colorMappingData[3]
  },

];

export const ColorMappingPrimaryXAxis = {
  valueType: 'Category',
  majorGridLines: { width: 0 },
  title: 'Months',
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}°C',
  title: 'Temperature',
};

export const LinePrimaryXAxis = {


  edgeLabelPlacement: 'Shift',
  majorGridLines: { width: 0 },
  background: 'white',
};

export const LinePrimaryYAxis = {
  rangePadding: 'None',
  minimum: 43,
  maximum: 995,
  interval: 318,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

const calulatePercentage = (props) => {
  const percentWidth = +(((+props.ape / (+props.ape + 2)) * 100).toFixed(0))
  return (
    <div style={{ backgroundColor: '#efeded', width: '100%' }}>
      <div style={{
        backgroundColor: percentWidth !== 0 ? 'orange' : '#efeded',
        padding: '10px',
        margin: '-4px',
        width: percentWidth !== 0 ? `${percentWidth}px` : '0px'
      }}>{props.ape}</div>
    </div>
  )
}

const calulatePercentage1 = (props) => {
  const percentWidth = +(((+props.collected / (+props.collectible)) * 100).toFixed(0))
  return (
    <div >{percentWidth}</div>
  )
}

export const employeesGrid = [
  {
    field: 'channel',
    headerText: 'Channel',
    textAlign: 'Center',
  },
  {
    field: 'wpi',
    headerText: 'WPI',
    textAlign: 'Center',
  },
  {
    field: 'nop',
    headerText: 'NOP',
    textAlign: 'Center'
  },
  {
    field: 'ape',
    headerText: 'APE',
    textAlign: 'Center',
  },
  {
    field: 'flag',
    headerText: 'Flag',
    textAlign: 'Center'
  },
];

export const childGrid = [
  {
    field: 'achivement',
    headerText: 'Achivement',
    textAlign: 'Center',
  },
  {
    field: 'ges',
    headerText: 'GES',
    textAlign: 'Center',
  },
  {
    field: 'non_par',
    headerText: 'Non Par',
    textAlign: 'Center'
  },
  {
    field: 'par',
    headerText: 'Par',
    textAlign: 'Center',
  },
  {
    field: 'pipeline',
    headerText: 'Pipeline',
    textAlign: 'Center'
  },
  {
    field: 'target',
    headerText: 'Target',
    textAlign: 'Center'
  },
];

export const persistencyGrid = [
  {
    field: 'channel',
    headerText: 'Channel',
    textAlign: 'Center',
  },
  {
    field: 'collected',
    headerText: 'Collected',
    textAlign: 'Center',
  },
  {
    field: 'collectible',
    headerText: 'Collectible',
    textAlign: 'Center'
  },
  {
    field: 'collected_percent',
    headerText: 'Collected percent',
    textAlign: 'Center',
    template: calulatePercentage1
  },
  {
    field: 'collectible_percent',
    headerText: 'Collectible percent',
    textAlign: 'Center',
    template: calulatePercentage1
  }, ,
  {
    field: 'flag',
    headerText: 'Flag',
    textAlign: 'Center'
  },
];

export const sidebarData = {
  headerText: "",
  template: {
    headerContent: {
      isVisible: true,
      logo: logo,
      width: "200",
      title: ""
    },
    hederActions: {
      isVisible: false,
      title: "",
      action: ""
    },
    links: [
      {
        title: 'Dashboard',
        links: [
          {
            name: 'management-dashboard',
            icon: <FiShoppingBag />,
          },
        ],
      },
      {
        title: 'Dyanamic Components',
        links: [
          {
            name: 'dynamic-form',
            icon: <FiShoppingBag />,
          },
          {
            name: 'dynamic-html-components',
            icon: <FiShoppingBag />,
          },
        ],
      }

    ]
  }
}

export const HtmlFields = [
  {
    id: "heading1",
    label: "",
    placeholder: "",
    type: "heading",
    typeAs: "h1",
    content: "Channel performance",
    style: {
      padding: {
        all: "1.5"
      },
      background: {
        color: "themeColor"
      },
      border: {
        width: "1",
        color: "black",
        style: "none"
      },
      font: {
        weight: "bold",
        style: "italic"
      },
      text: {
        size: "xl",
        color: "white"
      }


    },
    submitButton: {
      color: 'white'
    },
    isFormField: false
  }
]

export const navbarData = {
  headerText: "",
  template: {
    content: [
      {
        title: "Menu",
        greeting: "",
        type: "button",
        subtext: "",
        icon: <AiOutlineMenu />,
        action: {
          type: "handleActiveMenu"
        },
        color: ""
      },
      {
        text: "Management Dashboard",
        greeting: "",
        type: "title",
        subtext: "Inventory / Pipeline",
        icon: "",
        align: "start",
        color: ""
      },
      {
        title: "Notification",
        greeting: "",
        type: "button",
        icon: <RiNotification3Line />,
        action: {
          type: "click",
          value: "notification",
        },
        color: ""
      },
      {
        title: "Michale",
        greeting: "Hi, ",
        type: "panel",
        icon: avatar,
        action: {
          type: "click",
          value: "userProfile",
        },
        color: ""
      },
      {
        title: "Logout",
        greeting: "",
        type: "button",
        icon: <BsBoxArrowRight />,
        align: "right",
        action: {
          type: "click",
          value: "logout",
        },
        color: ""
      }
    ]
  }
}

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
  {
    icon: <BsShield />,
    title: 'My Inbox',
    desc: 'Messages & Emails',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
  },
  {
    icon: <FiCreditCard />,
    title: 'My Tasks',
    desc: 'To-do and Daily Tasks',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
  },
];

export const lineChartData = [
  [
    { x: new Date(2005, 0, 1), y: 21 },
    { x: new Date(2006, 0, 1), y: 24 },
    { x: new Date(2007, 0, 1), y: 36 },
    { x: new Date(2008, 0, 1), y: 38 },
    { x: new Date(2009, 0, 1), y: 54 },
    { x: new Date(2010, 0, 1), y: 57 },
    { x: new Date(2011, 0, 1), y: 70 },
  ],
  [
    { x: new Date(2005, 0, 1), y: 28 },
    { x: new Date(2006, 0, 1), y: 44 },
    { x: new Date(2007, 0, 1), y: 48 },
    { x: new Date(2008, 0, 1), y: 50 },
    { x: new Date(2009, 0, 1), y: 66 },
    { x: new Date(2010, 0, 1), y: 78 },
    { x: new Date(2011, 0, 1), y: 84 },
  ],

  [
    { x: new Date(2005, 0, 1), y: 10 },
    { x: new Date(2006, 0, 1), y: 20 },
    { x: new Date(2007, 0, 1), y: 30 },
    { x: new Date(2008, 0, 1), y: 39 },
    { x: new Date(2009, 0, 1), y: 50 },
    { x: new Date(2010, 0, 1), y: 70 },
    { x: new Date(2011, 0, 1), y: 100 },
  ],
];
export const dropdownData = [
  {
    Id: '1',
    Time: 'March 2021',
  },
  {
    Id: '2',
    Time: 'April 2021',
  }, {
    Id: '3',
    Time: 'May 2021',
  },
];

export const lineCustomSeries = [
  {
    dataSource: lineChartData[0],
    xName: 'x',
    yName: 'y',
    name: 'Germany',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line'
  },

  {
    dataSource: lineChartData[1],
    xName: 'x',
    yName: 'y',
    name: 'England',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line'
  },

  {
    dataSource: lineChartData[2],
    xName: 'x',
    yName: 'y',
    name: 'India',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line'
  },

];

export const pieChartData = [
  { x: 'Labour', y: 18, text: '18%' },
  { x: 'Legal', y: 8, text: '8%' },
  { x: 'Production', y: 15, text: '15%' },
  { x: 'License', y: 11, text: '11%' },
  { x: 'Facilities', y: 18, text: '18%' },
  { x: 'Taxes', y: 14, text: '14%' },
  { x: 'Insurance', y: 16, text: '16%' },
];

export const contextMenuItems = [
  'AutoFit',
  'AutoFitAll',
  'SortAscending',
  'SortDescending',
  'Copy',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'PdfExport',
  'ExcelExport',
  'CsvExport',
  'FirstPage',
  'PrevPage',
  'LastPage',
  'NextPage',
];

export const stackedPrimaryXAxis = {
  majorGridLines: { width: 0 },
  minorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  interval: 1,
  lineStyle: { width: 0 },
  labelIntersectAction: 'Rotate45',
  valueType: 'Category',
};

export const stackedPrimaryYAxis = {
  lineStyle: { width: 0 },
  minimum: 0,
  maximum: 2000,
  interval: 400,
  majorTickLines: { width: 0 },
  majorGridLines: { width: 1 },
  minorGridLines: { width: 1 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}',
};

export const TabData = {
  data: [
    {
      title: "Management Dashboard",
      content: {
        filterData: {
          submit: "onChange",
          parent: {
            style: {
              padding: {
                all: "2"
              },
              margin: {
                leftRight: "3"
              },
              background: {
                color: "white"
              }
            },
          },
          style: {
            background: {
              color: "white"
            },
            border: {
              radius: "3xl",

            }
          },
          submitButton: {
            icon: <BsFillArrowRightSquareFill />,
            color: 'themeColor'
          },
          fields: [
            {
              id: "lob",
              label: "LOB",
              placeholder: "full name",
              position: "left",
              type: "select",
              style: {
                height: 30,
                font: {
                  size: '1'
                },
                label: {
                  style: {
                    font: {
                      size: 'xs'
                    },
                  }
                },
              },
              options: ["All", "GROUP", "RETAIL"],
              value: "",
              isFormField: true
            },
            {
              id: "dim_dt",
              label: "",
              placeholder: "",
              type: "radio",
              style: {
                label: {
                  font: {
                    size: 'xs',
                  },
                  border: {
                    width: 'none'
                  }
                },
                labelBox: {
                  border: {
                    width: '2',
                    
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }
                    },
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  },
                  

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                group: {

                  border: {
                    width: 'none',
                    radius: '3xl'
                  },
                  padding: {
                    all: '0'
                  }
                }
              },
              validationType: "string",
              value: "",
              options: ["MTD", "YTD"],
              isFormField: true
            },
            {
              id: "premiumFilters",
              label: "",
              placeholder: "",
              type: "radio",
              validationType: "string",
              style: {
                label: {
                  font: {
                    size: 'xs',
                  },
                  border: {
                    width: 'none'
                  },
                  background: {
                    color: "white"
                  }
                },
               
                labelBox: {
                  border: {
                    width: '2'
                  },
                  background: {
                    color: "white"
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                    }
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                    }
                  },
                  left: {
                    border: {
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '0',
                      }
                    },
                  },
                  right: {
                    border: {
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  }

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                group: {

                  border: {
                    width: 'none'
                  },
                  padding: {
                    all: '0'
                  }
                }
              },
              value: "",
              options: [
                {label: "APE", value: 'ape'}, 
                {label: "NOP", value: 'nop'}, 
                {label: "WPI", value: 'wpi'}
              ],
              isFormField: true
            },
            {
              id: "flag",
              label: "",
              placeholder: "full name",
              position: "top",
              type: "radio",
              isFormField: true,
              style: {
                label: {
                  font: {
                    size: 'xs',
                  }
                },
                labelBox: {
                  border: {
                    width: '2'
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  background: {
                    color: "white"
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }
                    },
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  },

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                
              },
              options: ["LOGIN", "ISSUANCE"],
              value: "",
            }
          ]
        },
        numberOfRows: 3,
        rows: [
          {
            id: 1,
            dashboardContent: {
              numberOfQuadrants: "2",
              quadrants: [
                {
                  type: "table",
                  hasCollapse: true,
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      radius: "3xl",

                    }
                  },
                  title: "Channel performance",
                  hasChildGrid: true,
                  childConfig: {
                    dataKey: "channel-performance-megazone",
                    dataType: "issuanceData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance-megazone",
                    headings: childGrid,
                    data: []
                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "Channel performance",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: "white"
                        }


                      },
                      submitButton: {
                        color: 'white'
                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,
                  id: "1",
                  span: "3",
                  config:
                  {
                    quadrantDataKey: "channelPerformanceData",
                    dataType: "issuanceData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance",
                    headings: employeesGrid,
                    data: []
                  }
                },
                {
                  type: "chart",
                  hasCollapse: true,
                  title: "YOY comparison",
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      width: "1"
                    }

                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "YOY comparison",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: 'white'
                        }


                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,
                  id: "2",
                  span: "2",
                  config: {
                    hasCustomFilters: true,
                    dataType: "yoyData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance-yoy",
                    showFilters: false,
                    filters: {
                      submit: "onChange",
                      style: {
                        customClasses: 'absolute right-8 top-0',
                        shadow: {
                          boxShadow: "shadow-lg"
                        },
                        padding: {
                          all: "1.5"
                        },
                        margin: {
                          top: "t-2"
                        },
                        
                
                      },
                      fields: [
                        {
                          id: "premiumFilters",
                          label: "",
                          placeholder: "",
                          type: "radio",
                          validationType: "string",
                          style: {
                            label: {
                              font: {
                                size: 'xs',
                              },
                              border: {
                                width: 'none'
                              },
                              background: {
                                color: "white"
                              }
                            },
                           
                            labelBox: {
                              border: {
                                width: '2'
                              },
                              background: {
                                color: "white"
                              },
                              margin: {
                                all: '0'
                              },
                              padding: {
                                right: '2'
                              },
                              first: {
                                border: {
                                  radius: {
                                    left: '3xl'
                                  },
                                }
                              },
                              last: {
                                border: {
                                  radius: {
                                    right: '3xl'
                                  },
                                }
                              },
                              left: {
                                border: {
                                  left: {
                                    width: '0',
                                  },
                                  right: {
                                    width: '0',
                                  }
                                },
                              },
                              right: {
                                border: {
                                  left: {
                                    width: '2',
                                  },
                                  right: {
                                    width: '2',
                                  }
            
                                },
                              }
            
                            },
                            input: {
                              padding: {
                                all: 1
                              },
                              text: {
                                size: 'xs'
                              }
                            },
                            group: {
            
                              border: {
                                width: 'none'
                              },
                              padding: {
                                all: '0'
                              }
                            }
                          },
                          value: "",
                          options: [
                            {label: "APE", value: 'ape'}, 
                            {label: "NOP", value: 'nop'}, 
                            {label: "WPI", value: 'wpi'}
                          ],
                          isFormField: true
                        },
                      ],
                      submitButton: {
                        icon: <BsFillArrowRightSquareFill />,
                        color: 'white'
                      }
                    },
                    chartXAxis: stackedPrimaryXAxis,
                    chartYAxis: stackedPrimaryYAxis,
                    chartTitle: "YOY comparison",
                    variant: "stacked-bar",
                    chartSeriesType: "StackingColumn",
                    hasScroll: false,
                    group: ['channel', 'yoy'],
                    mapping: {
                      stackedXYValues: {
                        stackedX: "yoy",
                        stackedY1: "wpi",
                        stackedY2: "ape",
                        stackedY3: "nop"
                      },
                      legends: {
                        key: "channel",
                        values: [
                          "CAN",
                          "HSBC",
                          "DIGITAL",
                          "PNB",
                          "RRB"
                        ]
                      }
                    },
                    quadrantDataKey: "channelYOYPerformanceData",
                    data: []
                  }

                },
              ]
            }
          },
          {
            id: 2,
            dashboardContent: {
              numberOfQuadrants: "1",
              quadrants: [
                {
                  type: "table",
                  hasCollapse: true,
                  title: "Persistency",
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      radius: "3xl",

                    }
                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "Persistency",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: "white"
                        }


                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,

                  id: "1",
                  span: "full",
                  config: {
                    quadrantDataKey: "persistencydata",
                    headings: persistencyGrid,
                    dataType: "persistanyData",
                    apiKey: "/management-dashboard/persistency",
                    data: []
                  }
                }
              ]
            }
          }
        ]
      },
      visible: true
    },
    {
      title: "Business Summary",
      content: {
        filterData: {
          submit: "onChange",
          parent: {
            style: {
              padding: {
                all: "2"
              },
              margin: {
                leftRight: "3"
              },
              background: {
                color: "white"
              }
            },
          },
          style: {
            background: {
              color: "white"
            },
            border: {
              radius: "3xl",

            }
          },
          fields: [
            {
              id: "lob",
              label: "LOB",
              placeholder: "full name",
              position: "left",
              type: "select",
              style: {
                height: 30,
                font: {
                  size: '1'
                },
                label: {
                  style: {
                    font: {
                      size: 'xs'
                    },
                  }
                },
              },
              options: ["All", "GROUP", "RETAIL"],
              value: "",
              isFormField: true
            },
            {
              id: "dim_dt",
              label: "",
              placeholder: "",
              type: "radio",
              style: {
                label: {
                  font: {
                    size: 'xs',
                  },
                  border: {
                    width: 'none'
                  }
                },
                labelBox: {
                  border: {
                    width: '2',
                    
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }
                    },
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  },
                  

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                group: {

                  border: {
                    width: 'none',
                    radius: '3xl'
                  },
                  padding: {
                    all: '0'
                  }
                }
              },
              validationType: "string",
              value: "",
              options: ["MTD", "YTD"],
              isFormField: true
            },
            {
              id: "premiumFilters",
              label: "",
              placeholder: "",
              type: "radio",
              validationType: "string",
              style: {
                label: {
                  font: {
                    size: 'xs',
                  },
                  border: {
                    width: 'none'
                  }
                },
                labelBox: {
                  border: {
                    width: '2'
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                    }
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                    }
                  },
                  left: {
                    border: {
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '0',
                      }
                    },
                  },
                  right: {
                    border: {
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  }

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                group: {

                  border: {
                    width: 'none'
                  },
                  padding: {
                    all: '0'
                  }
                }
              },
              value: "",
              options: [
                {label: "APE", value: 'ape'}, 
                {label: "NOP", value: 'nop'}, 
                {label: "WPI", value: 'wpi'}
              ],
              isFormField: true
            },
            {
              id: "flag",
              label: "",
              placeholder: "full name",
              position: "top",
              type: "radio",
              isFormField: true,
              style: {
                label: {
                  font: {
                    size: 'xs',
                  }
                },
                labelBox: {
                  border: {
                    width: '2'
                  },
                  margin: {
                    all: '0'
                  },
                  padding: {
                    right: '2'
                  },
                  background: {
                    color: "white"
                  },
                  first: {
                    border: {
                      radius: {
                        left: '3xl'
                      },
                      left: {
                        width: '2',
                      },
                      right: {
                        width: '2',
                      }
                    },
                  },
                  last: {
                    border: {
                      radius: {
                        right: '3xl'
                      },
                      left: {
                        width: '0',
                      },
                      right: {
                        width: '2',
                      }

                    },
                  },

                },
                input: {
                  padding: {
                    all: 1
                  },
                  text: {
                    size: 'xs'
                  }
                },
                
              },
              options: ["LOGIN", "ISSUANCE"],
              value: "",
            }
          ]
        },
        numberOfRows: 3,
        rows: [
          {
            id: 1,
            dashboardContent: {
              numberOfQuadrants: "2",
              quadrants: [
                {
                  type: "table",
                  hasCollapse: true,
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      radius: "3xl",

                    }
                  },
                  title: "Channel performance",
                  hasChildGrid: true,
                  childConfig: {
                    dataKey: "channel-performance-megazone",
                    dataType: "issuanceData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance-megazone",
                    headings: childGrid,
                    data: []
                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "Channel performance",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: "white"
                        }


                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,
                  id: "1",
                  span: "3",
                  config:
                  {
                    quadrantDataKey: "channelPerformanceData",
                    dataType: "issuanceData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance",
                    headings: employeesGrid,
                    data: []
                  }
                },
                {
                  type: "chart",
                  hasCollapse: true,
                  title: "YOY comparison",
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      width: "1"
                    }

                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "YOY comparison",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: 'white'
                        }


                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,
                  id: "2",
                  span: "2",
                  config: {
                    hasCustomFilters: true,
                    dataType: "yoyData",
                    method: 'get',
                    apiKey: "/management-dashboard/channel-performance-yoy",
                    showFilters: true,
                    filters: {
                      submit: "onChange",
                      style: {
                        customClasses: 'absolute right-8 top-0',
                        shadow: {
                          boxShadow: "shadow-lg"
                        },
                        padding: {
                          all: "1.5"
                        },
                        margin: {
                          top: "t-2"
                        },
                        background: {
                          color: "white"
                        },
                      },
                     
                    },
                    chartXAxis: stackedPrimaryXAxis,
                    chartYAxis: stackedPrimaryYAxis,
                    chartTitle: "YOY comparison",
                    variant: "stacked-bar",
                    chartSeriesType: "StackingColumn",
                    hasScroll: false,
                    group: ['channel', 'yoy'],
                    mapping: {
                      stackedXYValues: {
                        stackedX: "yoy",
                        stackedY1: "wpi",
                        stackedY2: "ape",
                        stackedY3: "nop"
                      },
                      legends: {
                        key: "channel",
                        values: [
                          "CAN",
                          "HSBC",
                          "DIGITAL",
                          "PNB",
                          "RRB"
                        ]
                      }
                    },
                    quadrantDataKey: "channelYOYPerformanceData",
                    data: []
                  }

                },
              ]
            }
          },
          {
            id: 2,
            dashboardContent: {
              numberOfQuadrants: "1",
              quadrants: [
                {
                  type: "table",
                  hasCollapse: true,
                  title: "Persistency",
                  style: {
                    background: {
                      color: "white"
                    },
                    border: {
                      radius: "3xl",

                    }
                  },
                  quadrantHeaderFields: [
                    {
                      id: "heading1",
                      label: "",
                      placeholder: "",
                      type: "heading",
                      typeAs: "h1",
                      content: "Persistency",
                      style: {
                        padding: {
                          all: "1.5"
                        },
                        background: {
                          color: "themeColor"
                        },
                        border: {
                          width: "1",
                          color: "black",
                          style: "none"
                        },
                        font: {
                          weight: "bold",
                          style: "italic"
                        },
                        text: {
                          size: "xl",
                          color: "white"
                        }


                      },
                      isFormField: false
                    },
                  ],
                  isDynamicComponent: true,

                  id: "1",
                  span: "full",
                  config: {
                    quadrantDataKey: "persistencydata",
                    headings: persistencyGrid,
                    dataType: "persistanyData",
                    apiKey: "/management-dashboard/persistency",
                    data: []
                  }
                }
              ]
            }
          }
        ]
      },
      visible: true
    },
    {
      title: "PRoduct Mix",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "SPLY",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "Special Product View",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "Special Product View 1",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "Special Product View 2",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "Special Product View 3",
      content: "tab 3 content.",
      visible: true
    },
    {
      title: "Special Product View 5",
      content: "tab 3 content.",
      visible: true
    }
  ]
};
export const formData = {
  submit: "onSubmit",
  fields: [
    {
      id: "name",
      label: "Full Name",
      placeholder: "full name",
      type: "text",
      validationType: "string",
      isFormField: true,
      value: "",
      validations: [
        {
          type: "required",
          params: ["name is required"],
        },
        {
          type: "min",
          params: [5, "name can't be less than 5 characters"],
        },
        {
          type: "max",
          params: [10, "name can't be more than 10 characters"],
        },
      ],
    },
    {
      id: "photo",
      label: "Photo",
      placeholder: "",
      type: "upload",
      validationType: "string",
      value: "",
      isFormField: true,
      validations: [
        {
          type: "required",
          params: ["photo is required"],
        },
      ],
    },
    {
      id: "email",
      label: "Email",
      placeholder: "email",
      type: "text",
      validationType: "string",
      value: "",
      isFormField: true,
      validations: [
        {
          type: "required",
          params: ["email is required"],
        },
        {
          type: "min",
          params: [5, "email can't be less than 5 characters"],
        },
        {
          type: "max",
          params: [20, "email can't be more than 20 characters"],
        },
        {
          type: "email",
          params: ["please enter a valid email"],
        },
      ],
    },
    {
      id: "phone_number",
      label: "Phone Number",
      placeholder: "phone number",
      type: "text",
      validationType: "number",
      value: "",
      isFormField: true,
      validations: [
        {
          type: "required",
          params: ["phone number is required"],
        },
      ],
    },
    {
      id: "total",
      label: "Total Family Member",
      placeholder: "total family member",
      type: "text",
      validationType: "number",
      value: "",
      isFormField: true,
      validations: [
        {
          type: "required",
          params: ["total family's member is required"],
        },
        {
          type: "min",
          params: [1, "there should be atleast 1 family member"],
        },
        {
          type: "max",
          params: [5, "max family members can be 5"],
        },
      ],
    },
    {
      id: "city",
      label: "City Address",
      placeholder: "",
      type: "select",
      validationType: "string",
      value: "",
      isFormField: true,
      options: ["Batam", "Jakarta", "Bandung"],
      validations: [
        {
          type: "required",
          params: ["city address is required"],
        },
      ],
    },
    {
      id: "home",
      label: "Home Address",
      placeholder: "home address",
      type: "textarea",
      validationType: "string",
      value: "",
      isFormField: true,
      validations: [
        {
          type: "required",
          params: ["home address is required"],
        },
        {
          type: "min",
          params: [10, "home address can't be less than 10 characters"],
        },
      ],
    },
    {
      id: "gender",
      label: "Gender",
      placeholder: "",
      type: "radio",
      validationType: "string",
      value: "",
      isFormField: true,
      options: ["Male", "Female"],
      validations: [
        {
          type: "required",
          params: ["gender is required"],
        },
      ],
    },
    {
      id: "hobbies",
      label: "Hobbies",
      placeholder: "",
      type: "checkbox",
      validationType: "string",
      value: "",
      isFormField: true,
      options: ["Playing Football", "Online Games", "Travelling"],
      validations: [
        {
          type: "required",
          params: ["hobbies is required"],
        },
      ],
    },
  ]
};

export const managementDashboardData = {
  "Q1-channel_performance": [
    {
      "branch_id": "BR001",
      "agent_id": "AG001",
      "channel": "CAN",
      "wpi": 123,
      "nop": 1,
      "ape": 0.7072788,
      "flag": "LOGIN",
      "dim_dt": "FTD",
      "lob": "RETAIL"
    },
    {
      "branch_id": "BR002",
      "agent_id": "AG002",
      "channel": "HSBC",
      "wpi": 43,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "YTD",
      "lob": "GROUP"
    },
    {
      "branch_id": "BR003",
      "agent_id": "AG003",
      "channel": "DIGITAL",
      "wpi": 54,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "QTD",
      "lob": "GROUP"
    },
    {
      "branch_id": "BR004",
      "agent_id": "AG004",
      "channel": "PNB",
      "wpi": 635,
      "nop": 1,
      "ape": 0.1140499,
      "flag": "LOGIN",
      "dim_dt": "MTD",
      "lob": "RETAIL"
    },
    {
      "branch_id": "BR005",
      "agent_id": "AG005",
      "channel": "CAN",
      "wpi": 45.8,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "MTD",
      "lob": "GROUP"
    },

  ],
  "Q2-comparison_YOY": [
    {
      "branch_id": "BR001",
      "agent_id": "AG001",
      "channel": "CAN",
      "wpi": 123,
      "nop": 1,
      "ape": 0.7072788,
      "flag": "LOGIN",
      "dim_dt": "FTD",
      "lob": "RETAIL",
      "YOY": 2010
    },
    {
      "branch_id": "BR002",
      "agent_id": "AG002",
      "channel": "HSBC",
      "wpi": 43,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "YTD",
      "lob": "GROUP",
      "YOY": 2011
    },
    {
      "branch_id": "BR003",
      "agent_id": "AG003",
      "channel": "DIGITAL",
      "wpi": 54,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "QTD",
      "lob": "GROUP",
      "YOY": 2012
    },
    {
      "branch_id": "BR004",
      "agent_id": "AG004",
      "channel": "PNB",
      "wpi": 635,
      "nop": 1,
      "ape": 0.1140499,
      "flag": "LOGIN",
      "dim_dt": "MTD",
      "lob": "RETAIL",
      "YOY": 2014
    },
    {
      "branch_id": "BR005",
      "agent_id": "AG005",
      "channel": "CAN",
      "wpi": 45.8,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "MTD",
      "lob": "GROUP",
      "YOY": 2016
    },
    {
      "branch_id": "BR006",
      "agent_id": "AG006",
      "channel": "HSBC",
      "wpi": 45.8,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "FTD",
      "lob": "GROUP",
      "YOY": 2019
    },
    {
      "branch_id": "BR007",
      "agent_id": "AG007",
      "channel": "DIGITAL",
      "wpi": 995,
      "nop": 4,
      "ape": 0.8801371,
      "flag": "LOGIN",
      "dim_dt": "MTD",
      "lob": "RETAIL",
      "YOY": 2022
    },
    {
      "branch_id": "BR008",
      "agent_id": "AG008",
      "channel": "PNB",
      "wpi": 43,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "MTD",
      "lob": "GROUP",
      "YOY": 2021
    },
    {
      "branch_id": "BR009",
      "agent_id": "AG009",
      "channel": "RRB",
      "wpi": 54,
      "nop": 0,
      "ape": 0,
      "flag": "ISSUANCE",
      "dim_dt": "FTD",
      "lob": "RETAIL",
      "YOY": 2020
    },
    {
      "branch_id": "BR010",
      "agent_id": "AG010",
      "channel": "DIGITAL",
      "wpi": 45.8,
      "nop": 0,
      "ape": 0,
      "flag": "LOGIN",
      "dim_dt": "QTD",
      "lob": "GROUP",
      "YOY": 2022
    },

  ],
  "Q3-Persistency": [
    {
      "branch_id": "BR001",
      "agent_id": "AG001",
      "channel": "CAN",
      "flag": "LOGIN",
      "dim_dt": "FTD",
      "lob": "RETAIL",
      "collected": 210,
      "collectible": 200,
      "collected_percent": 60,
      "collectible_percent": 65
    },
    {
      "branch_id": "BR002",
      "agent_id": "AG002",
      "channel": "HSBC",
      "flag": "ISSUANCE",
      "dim_dt": "YTD",
      "lob": "GROUP",
      "collected": 200,
      "collectible": 150,
      "collected_percent": 45,
      "collectible_percent": 47.9
    },
    {
      "branch_id": "BR003",
      "agent_id": "AG003",
      "channel": "DIGITAL",
      "flag": "ISSUANCE",
      "dim_dt": "QTD",
      "lob": "GROUP",
      "collected": 170,
      "collectible": 160,
      "collected_percent": 70,
      "collectible_percent": 55.08
    },
    {
      "branch_id": "BR004",
      "agent_id": "AG004",
      "channel": "PNB",
      "flag": "LOGIN",
      "dim_dt": "MTD",
      "lob": "RETAIL",
      "collected": 180,
      "collectible": 210,
      "collected_percent": 75.8,
      "collectible_percent": 45
    },
    {
      "branch_id": "BR005",
      "agent_id": "AG005",
      "channel": "CAN",
      "flag": "ISSUANCE",
      "dim_dt": "MTD",
      "lob": "GROUP",
      "collected": 220,
      "collectible": 200,
      "collected_percent": 50,
      "collectible_percent": 60
    },
    {
      "branch_id": "BR006",
      "agent_id": "AG006",
      "channel": "HSBC",
      "flag": "ISSUANCE",
      "dim_dt": "FTD",
      "lob": "GROUP",
      "collected": 150,
      "collectible": 170,
      "collected_percent": 45.5,
      "collectible_percent": 75
    },
    {
      "branch_id": "BR007",
      "agent_id": "AG007",
      "channel": "DIGITAL",
      "flag": "LOGIN",
      "dim_dt": "MTD",
      "lob": "RETAIL",
      "collected": 160,
      "collectible": 180,
      "collected_percent": 65,
      "collectible_percent": 47.9
    },
    {
      "branch_id": "BR008",
      "agent_id": "AG008",
      "channel": "PNB",
      "flag": "ISSUANCE",
      "dim_dt": "MTD",
      "lob": "GROUP",
      "collected": 210,
      "collectible": 190,
      "collected_percent": 47.9,
      "collectible_percent": 55.08
    },
    {
      "branch_id": "BR009",
      "agent_id": "AG009",
      "channel": "RRB",
      "flag": "ISSUANCE",
      "dim_dt": "FTD",
      "lob": "RETAIL",
      "collected": 170,
      "collectible": 200,
      "collected_percent": 55.08,
      "collectible_percent": 40
    },

  ]
}


