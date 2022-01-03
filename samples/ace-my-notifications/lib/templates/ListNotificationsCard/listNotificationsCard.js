export var listNotificationsCard = {
    type: "AdaptiveCard",
    version: "1.2",
    body: [
        {
            type: "ColumnSet",
            columns: [
                {
                    type: "Column",
                    items: [
                        {
                            type: "TextBlock",
                            text: "Notifications:",
                            weight: "bolder",
                        },
                    ],
                },
                {
                    type: "Column",
                    id: "clearall",
                    items: [
                        {
                            type: "TextBlock",
                            $when: "${!empty(listNotifications)}",
                            text: "[Clear all](#clearall)",
                            horizontalAlignment: "Right",
                            color: "Light",
                            isSubtle: true
                        },
                    ],
                    selectAction: {
                        type: "Action.Submit",
                        title: "",
                        id: "ClearAll",
                        data: { clear: "all" },
                    },
                },
            ],
        },
        {
            type: "ColumnSet",
            $when: "${empty(listNotifications)}",
            columns: [
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "No Notification(s)",
                            "weight": "Bolder",
                            "horizontalAlignment": "Center"
                        }
                    ],
                    "width": "stretch"
                }
            ],
            style: "emphasis",
            horizontalAlignment: "Center"
        },
        {
            type: "Container",
            $data: "${listNotifications}",
            items: [
                {
                    type: "ColumnSet",
                    spacing: "small",
                    columns: [
                        {
                            type: "Column",
                            width: "auto",
                            items: [
                                {
                                    type: "Image",
                                    url: "${author.profilePhotoUrl}",
                                    size: "small",
                                    style: "Person",
                                    width: "42px",
                                },
                            ],
                        },
                        {
                            type: "Column",
                            width: 4,
                            items: [
                                {
                                    type: "TextBlock",
                                    text: "${author.displayName}",
                                    weight: "Bolder",
                                    fontType: "Default",
                                    size: "small",
                                },
                                {
                                    type: "TextBlock",
                                    text: "{{DATE(${date},SHORT)}}",
                                    isSubtle: true,
                                    spacing: "None",
                                    size: "Small",
                                    weight: "Lighter",
                                },
                                {
                                    type: "TextBlock",
                                    text: "${type} [${name}](${url}) was ${action} ",
                                    isSubtle: true,
                                    wrap: true,
                                    spacing: "None",
                                    size: "Small",
                                    weight: "bolder",
                                },
                            ],
                        },
                        {
                            type: "Column",
                            horizontalAlignment: "right",
                            width: "auto",
                            isVisible: true,
                            items: [
                                {
                                    type: "Image",
                                    url: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%221em%22%20height%3D%221em%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cg%20stroke-width%3D%221.5%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M6.758%2017.243L12.001%2012m5.243-5.243L12%2012m0%200L6.758%206.757M12.001%2012l5.243%205.243%22%20stroke%3D%22currentColor%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E",
                                    size: "small",
                                    width: "26px",
                                    selectAction: {
                                        type: "Action.Submit",
                                        title: "",
                                        id: "Remove",
                                        data: { index: "${$index}",
                                            fromCard: 1
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                    style: "emphasis",
                },
            ],
        },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
};
//# sourceMappingURL=listNotificationsCard.js.map