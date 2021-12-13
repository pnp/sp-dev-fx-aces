export declare const heroCard: {
    type: string;
    body: ({
        type: string;
        columns: {
            type: string;
            width: string;
            items: ({
                type: string;
                text: string;
                weight: string;
                size: string;
                url?: undefined;
                with?: undefined;
                height?: undefined;
            } | {
                type: string;
                url: string;
                with: string;
                height: string;
                text?: undefined;
                weight?: undefined;
                size?: undefined;
            })[];
        }[];
        items?: undefined;
    } | {
        type: string;
        items: ({
            type: string;
            text: string;
            height: string;
            size: string;
            wrap: boolean;
            columns?: undefined;
            items?: undefined;
        } | {
            type: string;
            columns: ({
                type: string;
                width: string;
                items: {
                    type: string;
                    url: string;
                    size: string;
                    style: string;
                    width: string;
                }[];
            } | {
                type: string;
                width: string;
                items: ({
                    type: string;
                    text: string;
                    weight: string;
                    wrap: boolean;
                    size: string;
                    spacing?: undefined;
                    isSubtle?: undefined;
                } | {
                    type: string;
                    spacing: string;
                    text: string;
                    isSubtle: boolean;
                    wrap: boolean;
                    size: string;
                    weight?: undefined;
                })[];
            })[];
            text?: undefined;
            height?: undefined;
            size?: undefined;
            wrap?: undefined;
            items?: undefined;
        } | {
            type: string;
            items: {
                type: string;
                text: string;
                $when: string;
                wrap: boolean;
                horizontalAlignment: string;
            }[];
            text?: undefined;
            height?: undefined;
            size?: undefined;
            wrap?: undefined;
            columns?: undefined;
        })[];
        columns?: undefined;
    })[];
};
export declare const heroCardMobile: {
    type: string;
    body: ({
        type: string;
        columns: {
            type: string;
            width: string;
            items: ({
                type: string;
                text: string;
                weight: string;
                size: string;
                url?: undefined;
                with?: undefined;
                height?: undefined;
            } | {
                type: string;
                url: string;
                with: string;
                height: string;
                text?: undefined;
                weight?: undefined;
                size?: undefined;
            })[];
        }[];
        items?: undefined;
    } | {
        type: string;
        items: ({
            type: string;
            text: string;
            height: string;
            size: string;
            wrap: boolean;
            columns?: undefined;
            items?: undefined;
        } | {
            type: string;
            columns: ({
                type: string;
                width: string;
                items: {
                    type: string;
                    url: string;
                    size: string;
                    style: string;
                    width: string;
                }[];
            } | {
                type: string;
                width: string;
                items: ({
                    type: string;
                    text: string;
                    weight: string;
                    wrap: boolean;
                    size: string;
                    spacing?: undefined;
                    isSubtle?: undefined;
                } | {
                    type: string;
                    spacing: string;
                    text: string;
                    isSubtle: boolean;
                    wrap: boolean;
                    size: string;
                    weight?: undefined;
                })[];
            })[];
            text?: undefined;
            height?: undefined;
            size?: undefined;
            wrap?: undefined;
            items?: undefined;
        } | {
            type: string;
            items: {
                type: string;
                text: string;
                $when: string;
                wrap: boolean;
                horizontalAlignment: string;
            }[];
            text?: undefined;
            height?: undefined;
            size?: undefined;
            wrap?: undefined;
            columns?: undefined;
        })[];
        columns?: undefined;
    })[];
};
export declare const thumbnailCard: {
    type: string;
    body: ({
        type: string;
        items: {
            type: string;
            columns: ({
                type: string;
                items: {
                    type: string;
                    height: string;
                    url: string;
                }[];
                height: string;
                width?: undefined;
            } | {
                type: string;
                width: string;
                items: ({
                    type: string;
                    text: string;
                    size: string;
                    weight: string;
                    wrap?: undefined;
                    width?: undefined;
                    separator?: undefined;
                    spacing?: undefined;
                    columns?: undefined;
                } | {
                    type: string;
                    wrap: boolean;
                    width: string;
                    text: string;
                    size: string;
                    weight?: undefined;
                    separator?: undefined;
                    spacing?: undefined;
                    columns?: undefined;
                } | {
                    type: string;
                    separator: boolean;
                    spacing: string;
                    columns: ({
                        type: string;
                        items: {
                            type: string;
                            style: string;
                            url: string;
                            size: string;
                            width: string;
                        }[];
                        width: string;
                    } | {
                        type: string;
                        items: ({
                            type: string;
                            weight: string;
                            text: string;
                            size: string;
                            spacing?: undefined;
                            isSubtle?: undefined;
                            wrap?: undefined;
                        } | {
                            type: string;
                            spacing: string;
                            text: string;
                            isSubtle: boolean;
                            wrap: boolean;
                            size: string;
                            weight?: undefined;
                        })[];
                        width: string;
                    })[];
                    text?: undefined;
                    size?: undefined;
                    weight?: undefined;
                    wrap?: undefined;
                    width?: undefined;
                })[];
                height?: undefined;
            })[];
        }[];
    } | {
        type: string;
        items: {
            type: string;
            text: string;
            $when: string;
            wrap: boolean;
            horizontalAlignment: string;
        }[];
    })[];
};
export declare const teste: {
    type: string;
    version: string;
    body: ({
        type: string;
        text: string;
        weight: string;
        spacing?: undefined;
        columns?: undefined;
        selectAction?: undefined;
        style?: undefined;
    } | {
        type: string;
        spacing: string;
        columns: ({
            type: string;
            width: string;
            items: {
                type: string;
                url: string;
                size: string;
                style: string;
                width: string;
            }[];
        } | {
            type: string;
            width: number;
            items: ({
                type: string;
                text: string;
                weight: string;
                fontType: string;
                size: string;
                isSubtle?: undefined;
                spacing?: undefined;
            } | {
                type: string;
                text: string;
                isSubtle: boolean;
                spacing: string;
                size: string;
                weight: string;
                fontType?: undefined;
            })[];
        })[];
        selectAction: {
            type: string;
            url: string;
        };
        style: string;
        text?: undefined;
        weight?: undefined;
    })[];
    actions: {
        type: string;
        title: string;
        url: string;
    }[];
    $schema: string;
};
export declare const outLookCard = "<html>\n<head>\n<script type=\"application/adaptivecard+json\">\n   \"##_adaptiveCard_##\"\n</head>\n<body><br><br>\n</body>\n</html>";
//# sourceMappingURL=adaptiveCardDefinition.d.ts.map