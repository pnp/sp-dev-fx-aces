export const quickView = {
  "type": "AdaptiveCard",
  "version": "1.2",
  "body": [
      {
          "type": "ColumnSet",
          "columns": [
              {
                  "type": "Column",
                  "width": "auto",
                  "items": [
                      {
                          "type": "Image",
                          "url": "${flag}",
                          "width": "0px"
                      }
                  ]
              },
              {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                      {
                          "type": "TextBlock",
                          "text": "${country}",
                          "color": "Accent",
                          "horizontalAlignment": "Center",
                          "spacing": "Medium",
                          "size": "Large",
                          "weight": "Bolder"
                      }
                  ],
                  "verticalContentAlignment": "Center",
                  "horizontalAlignment": "Center"
              }
          ],
          "style": "emphasis"
      },
      {
          "type": "Container",
          "items": [
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "Continent",
                                  "wrap": true,
                                  "size": "Small",
                                  "isSubtle": true
                              },
                              {
                                  "type": "TextBlock",
                                  "text": "${continent}",
                                  "wrap": true,
                                  "size": "Medium",
                                  "isSubtle": false,
                                  "horizontalAlignment": "Left",
                                  "spacing": "None",
                                  "weight": "Bolder"
                              }
                          ]
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "Population",
                                  "wrap": true,
                                  "size": "Small",
                                  "isSubtle": true
                              },
                              {
                                  "type": "TextBlock",
                                  "text": "${population}",
                                  "wrap": true,
                                  "size": "Medium",
                                  "isSubtle": false,
                                  "horizontalAlignment": "Left",
                                  "spacing": "None",
                                  "weight": "Bolder"
                              }
                          ]
                      }
                  ]
              }
          ],
          "style": "emphasis",
          "separator": true,
          "spacing": "Medium"
      },
      {
        "type": "ColumnSet",
        "columns": [
            {
                "type": "Column",
                "width": "stretch",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "CASES",
                    "wrap": true,
                    "horizontalAlignment": "Left",
                    "size": "Medium",

                    "weight": "Bolder",
                    "spacing": "Medium",
                    "color": "Accent"
                },
                ],
                "spacing": "Medium"
            },
            {
                "type": "Column",
                "spacing": "Small",
                "selectAction": {
                    "type": "Action.ToggleVisibility",
                    "title": "expand",
                    "targetElements": [
                      {
                        "elementId": "CASES",

                      },
                      {
                        "elementId": "Deaths",
                        "isVisible": false,

                      },
                      {
                        "elementId": "chevronDownDeaths${$index}",
                        "isVisible": true,

                      },
                      {
                        "elementId": "chevronUpDeaths${$index}",
                        "isVisible": false,

                      },
                      {
                        "elementId": "Tests",
                        "isVisible": false,
                      },
                      {
                        "elementId": "chevronDownTests${$index}",
                        "isVisible": true,

                      },
                      {
                        "elementId": "chevronUpTests${$index}",
                        "isVisible": false,

                      },
                      "chevronDownCases${$index}",
                      "chevronUpCases${$index}"
                    ],
                    "id": "showCases"
                },
                "verticalContentAlignment": "Center",
                "items": [
                    {
                        "type": "Image",
                        "id": "chevronDownCases${$index}",
                        "url": "https://adaptivecards.io/content/down.png",
                        "width": "20px",
                        "altText": "Details collapsed",
                        "isVisible": false,
                    },
                    {
                        "type": "Image",
                        "id": "chevronUpCases${$index}",
                        "url": "https://adaptivecards.io/content/up.png",
                        "width": "20px",
                        "altText": "Details expanded",

                    }
                ],
                "width": "auto"
            }
        ],
        "spacing": "Medium",
        "separator": true
    },

      {
          "type": "Container",
          "id": "CASES",
          "isVisible": true,
          "items": [
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Medium",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "New",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases.new}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Attention",
                                  "spacing": "Medium",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "separator": true,
                  "style": "emphasis"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "Active",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases.active}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "Critical",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases.critical}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "Recovered",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases.recovered}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "1M_pop",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases['1M_pop']}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "TOTAL",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "color": "Warning"
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${cases.total}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              }
          ],
          "style": "default"
      },
      {
          "type": "ColumnSet",
          "columns": [
              {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                      {
                          "type": "TextBlock",
                          "text": "DEATHS",
                          "wrap": true,
                          "horizontalAlignment": "Left",
                          "size": "Medium",

                          "weight": "Bolder",
                          "spacing": "Medium",
                          "color": "Accent"
                      }
                  ],
                  "spacing": "Medium"
              },
              {
                  "type": "Column",
                  "spacing": "Small",
                  "selectAction": {
                      "type": "Action.ToggleVisibility",
                      "title": "expand",
                      "targetElements": [
                        {
                          "elementId": "Deaths",

                        }, {
                          "elementId": "CASES",
                          "isVisible": false,
                        },

                        {
                          "elementId": "Tests",
                          "isVisible": false,
                        }, {
                          "elementId": "chevronDownCases${$index}",
                          "isVisible": true,

                        },
                        {
                          "elementId": "chevronUpCases${$index}",
                          "isVisible": false,

                        },
                        {
                          "elementId": "Tests",
                          "isVisible": false,
                        },
                        {
                          "elementId": "chevronDownTests${$index}",
                          "isVisible": true,

                        },
                        {
                          "elementId": "chevronUpTests${$index}",
                          "isVisible": false,

                        },
                          "chevronDownDeaths${$index}",
                          "chevronUpDeaths${$index}",

                      ],
                      "id": "showDeads"
                  },
                  "verticalContentAlignment": "Center",
                  "items": [
                      {
                          "type": "Image",
                          "id": "chevronDownDeaths${$index}",
                          "url": "https://adaptivecards.io/content/down.png",
                          "width": "20px",
                          "altText": "Details collapsed"
                      },
                      {
                          "type": "Image",
                          "id": "chevronUpDeaths${$index}",
                          "url": "https://adaptivecards.io/content/up.png",
                          "width": "20px",
                          "altText": "Details expanded",
                          "isVisible": false
                      }
                  ],
                  "width": "auto"
              }
          ],
          "spacing": "Medium",
          "separator": true
      },
      {
          "type": "Container",
          "id": "Deaths",
          "items": [
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Medium",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "New",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true,
                                  "color": "Attention"
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Attention",
                                  "spacing": "Medium",
                                  "horizontalAlignment": "Left",
                                  "text": "${deaths.new}"
                                }
                          ]
                      }
                  ],
                  "separator": true,
                  "style": "emphasis"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "1M Pop.",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${deaths['1M_pop']}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "TOTAL",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "color": "Warning"
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${deaths.total}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              }
          ],
          "isVisible": false
      },
      {
          "type": "ColumnSet",
          "columns": [
              {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                      {
                          "type": "TextBlock",
                          "text": "TESTS",
                          "wrap": true,
                          "horizontalAlignment": "Left",
                          "size": "Medium",

                          "weight": "Bolder",
                          "spacing": "Medium",
                          "color": "Accent"
                      }
                  ],
                  "spacing": "Medium"
              },
              {
                  "type": "Column",
                  "spacing": "Small",
                  "selectAction": {
                      "type": "Action.ToggleVisibility",
                      "title": "expand",
                      "targetElements": [
                        {
                          "elementId": "CASES",
                          "isVisible": false,
                        },
                        {
                          "elementId": "Deaths",
                          "isVisible": false,
                        },
                        {
                          "elementId": "chevronDownCases${$index}",
                          "isVisible": true,

                        },
                        {
                          "elementId": "chevronUpCases${$index}",
                          "isVisible": false,

                        },
                        {
                          "elementId": "chevronDownDeaths${$index}",
                          "isVisible": true,

                        },
                        {
                          "elementId": "chevronUpDeaths${$index}",
                          "isVisible": false,

                        },
                        {
                          "elementId": "Tests",

                        },

                          "chevronDown_Tests",
                          "chevronUp_Tests"
                      ],
                      "id": "showTests"
                  },
                  "verticalContentAlignment": "Center",
                  "items": [
                      {
                          "type": "Image",
                          "id": "chevronDown_Tests",
                          "url": "https://adaptivecards.io/content/down.png",
                          "width": "20px",
                          "altText": "Details collapsed"
                      },
                      {
                          "type": "Image",
                          "id": "chevronUp_Tests",
                          "url": "https://adaptivecards.io/content/up.png",
                          "width": "20px",
                          "altText": "Details expanded",
                          "isVisible": false
                      }
                  ],
                  "width": "auto"
              }
          ],
          "spacing": "Medium",
          "separator": true
      },
      {
          "type": "Container",
          "id": "Tests",
          "items": [
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "1M Pop.",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "isSubtle": true
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${tests['1M_pop']}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              },
              {
                  "type": "ColumnSet",
                  "columns": [
                      {
                          "type": "Column",
                          "width": "stretch",
                          "spacing": "Small",
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "TOTAL",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Default",
                                  "weight": "Bolder",
                                  "color": "Warning"
                              }
                          ],
                          "separator": true
                      },
                      {
                          "type": "Column",
                          "width": "stretch",
                          "separator": true,
                          "items": [
                              {
                                  "type": "TextBlock",
                                  "text": "${tests.total}",
                                  "wrap": true,
                                  "height": "stretch",
                                  "size": "Medium",
                                  "weight": "Bolder",
                                  "color": "Default",
                                  "spacing": "Small",
                                  "horizontalAlignment": "Left"
                              }
                          ]
                      }
                  ],
                  "style": "emphasis",
                  "height": "stretch",
                  "spacing": "Small"
              }
          ],
          "isVisible": false
      }
  ]
};

