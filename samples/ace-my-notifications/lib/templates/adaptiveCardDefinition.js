export var heroCard = {
    type: "AdaptiveCard",
    body: [
        {
            type: "ColumnSet",
            columns: [
                {
                    type: "Column",
                    width: "stretch",
                    items: [
                        {
                            type: "TextBlock",
                            text: "${title}",
                            weight: "bolder",
                            size: "medium",
                        },
                        {
                            type: "Image",
                            url: "${imageUrl}",
                            with: "auto",
                            height: "300px",
                        },
                    ],
                },
            ],
        },
        {
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: "${message}",
                    height: "65px",
                    size: "Small",
                    wrap: true,
                },
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            width: "auto",
                            items: [
                                {
                                    type: "Image",
                                    url: "${profilePhotoUrl}",
                                    size: "small",
                                    style: "person",
                                    width: "28px",
                                },
                            ],
                        },
                        {
                            type: "Column",
                            width: "stretch",
                            items: [
                                {
                                    type: "TextBlock",
                                    text: "${author.displayName}",
                                    weight: "bolder",
                                    wrap: true,
                                    size: "small",
                                },
                                {
                                    type: "TextBlock",
                                    spacing: "none",
                                    text: "{{DATE(${publishedDate},SHORT)}}",
                                    isSubtle: true,
                                    wrap: true,
                                    size: "small",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "Container",
                    items: [
                        {
                            type: "TextBlock",
                            text: "[View](https://www.google.pt)",
                            $when: "${if(length(linkUrl) >= 0, true, false)}",
                            wrap: true,
                            horizontalAlignment: "Right",
                        },
                    ],
                },
            ],
        },
    ],
};
export var heroCardMobile = {
    type: "AdaptiveCard",
    body: [
        {
            type: "ColumnSet",
            columns: [
                {
                    type: "Column",
                    width: "stretch",
                    items: [
                        {
                            type: "TextBlock",
                            text: "${title}",
                            weight: "bolder",
                            size: "medium",
                        },
                        {
                            type: "Image",
                            url: "${imageUrl}",
                            with: "auto",
                            height: "200px",
                        },
                    ],
                },
            ],
        },
        {
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: "${message}",
                    height: "65px",
                    size: "Small",
                    wrap: true,
                },
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            width: "auto",
                            items: [
                                {
                                    type: "Image",
                                    url: "${profilePhotoUrl}",
                                    size: "small",
                                    style: "person",
                                    width: "28px",
                                },
                            ],
                        },
                        {
                            type: "Column",
                            width: "stretch",
                            items: [
                                {
                                    type: "TextBlock",
                                    text: "${author.displayName}",
                                    weight: "bolder",
                                    wrap: true,
                                    size: "small",
                                },
                                {
                                    type: "TextBlock",
                                    spacing: "none",
                                    text: "{{DATE(${publishedDate},SHORT)}}",
                                    isSubtle: true,
                                    wrap: true,
                                    size: "small",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "Container",
                    items: [
                        {
                            type: "TextBlock",
                            text: "[View](https://www.google.pt)",
                            $when: "${if(length(linkUrl) >= 0, true, false)}",
                            wrap: true,
                            horizontalAlignment: "Right",
                        },
                    ],
                },
            ],
        },
    ],
};
export var thumbnailCard = {
    type: "AdaptiveCard",
    body: [
        {
            type: "Container",
            items: [
                {
                    type: "ColumnSet",
                    columns: [
                        {
                            type: "Column",
                            items: [
                                {
                                    type: "Image",
                                    height: "160px",
                                    url: "${imageUrl}",
                                },
                            ],
                            height: "stretch",
                        },
                        {
                            type: "Column",
                            width: "stretch",
                            items: [
                                {
                                    type: "TextBlock",
                                    text: "${title}",
                                    size: "medium",
                                    weight: "Bolder",
                                },
                                {
                                    type: "TextBlock",
                                    wrap: true,
                                    width: "220px",
                                    text: "${message}",
                                    size: "small",
                                },
                                {
                                    type: "ColumnSet",
                                    separator: true,
                                    spacing: "${if(length(message) == 0, 'small', 'medium')}",
                                    columns: [
                                        {
                                            type: "Column",
                                            items: [
                                                {
                                                    type: "Image",
                                                    style: "Person",
                                                    url: "${profilePhotoUrl}",
                                                    size: "Small",
                                                    width: "28px",
                                                },
                                            ],
                                            width: "auto",
                                        },
                                        {
                                            type: "Column",
                                            items: [
                                                {
                                                    type: "TextBlock",
                                                    weight: "Bolder",
                                                    text: "${author.displayName}",
                                                    size: "Small",
                                                },
                                                {
                                                    type: "TextBlock",
                                                    spacing: "None",
                                                    text: "{{DATE(${publishedDate},SHORT)}}",
                                                    isSubtle: true,
                                                    wrap: true,
                                                    size: "Small",
                                                },
                                            ],
                                            width: "stretch",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: "Container",
            items: [
                {
                    type: "TextBlock",
                    text: "[View](https://www.google.pt)",
                    $when: "${if(length(linkUrl) >= 0, true, false)}",
                    wrap: true,
                    horizontalAlignment: "Right",
                },
            ],
        },
    ],
};
export var teste = {
    "type": "AdaptiveCard",
    "version": "1.2",
    "body": [
        {
            "type": "TextBlock",
            "text": "Notifications:",
            "weight": "bolder",
        },
        {
            "type": "ColumnSet",
            "spacing": "Small",
            "columns": [
                {
                    "type": "Column",
                    "width": "auto",
                    "items": [
                        {
                            "type": "Image",
                            "url": "${profilePhotoUrl}",
                            "size": "small",
                            "style": "Person",
                            "width": "42px"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 4,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "${author.displayName}",
                            "weight": "Bolder",
                            "fontType": "Default",
                            "size": "Small"
                        },
                        {
                            "type": "TextBlock",
                            "text": "{{DATE(${publishedDate},SHORT)}}",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "Lighter"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Item  [New Item 5](https://www.google.com) was changed ",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "bolder"
                        }
                    ]
                }
            ],
            "selectAction": {
                "type": "Action.OpenUrl",
                "url": "ms-cortana:silver-star-mountain"
            },
            "style": "emphasis"
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "auto",
                    "items": [
                        {
                            "type": "Image",
                            "url": "${profilePhotoUrl}",
                            "size": "small",
                            "style": "Person",
                            "width": "42px"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 4,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "${author.displayName}",
                            "weight": "Bolder",
                            "fontType": "Default",
                            "size": "Small"
                        },
                        {
                            "type": "TextBlock",
                            "text": "{{DATE(${publishedDate},SHORT)}}",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "Lighter"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Item  [New Item 2](https://www.google.com) was add ",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "bolder"
                        }
                    ]
                }
            ],
            "selectAction": {
                "type": "Action.OpenUrl",
                "url": "ms-cortana:kitchen-remodel"
            },
            "style": "emphasis",
            "spacing": "Small"
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "auto",
                    "items": [
                        {
                            "type": "Image",
                            "url": "${profilePhotoUrl}",
                            "size": "small",
                            "style": "Person",
                            "width": "42px"
                        }
                    ]
                },
                {
                    "type": "Column",
                    "width": 4,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "${author.displayName}",
                            "weight": "Bolder",
                            "fontType": "Default",
                            "size": "Small"
                        },
                        {
                            "type": "TextBlock",
                            "text": "{{DATE(${publishedDate},SHORT)}}",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "Lighter"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Item  [New Item](https://www.google.com) was changed ",
                            "isSubtle": true,
                            "spacing": "None",
                            "size": "Small",
                            "weight": "bolder"
                        }
                    ]
                }
            ],
            "selectAction": {
                "type": "Action.OpenUrl",
                "url": "ms-cortana:the-witcher"
            },
            "style": "emphasis",
            "spacing": "Small"
        }
    ],
    "actions": [
        {
            "type": "Action.OpenUrl",
            "title": "Clear all",
            "url": "ms-cortana:resume-all"
        },
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
};
export var outLookCard = "<html>\n<head>\n<script type=\"application/adaptivecard+json\">\n   \"##_adaptiveCard_##\"\n</head>\n<body><br><br>\n</body>\n</html>";
//# sourceMappingURL=adaptiveCardDefinition.js.map