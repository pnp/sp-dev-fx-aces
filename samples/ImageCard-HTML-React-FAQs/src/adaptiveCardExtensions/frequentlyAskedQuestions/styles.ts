import { stylesheet } from "typestyle";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

// Styles for accordion
export const createAccordionStyles = (theme: IReadonlyTheme) => stylesheet({
    accordion: {
        $nest: {
            '.chevron-down': {
                marginLeft: 'auto',
                transition: 'transform 0.25s cubic-bezier(0, 0, 0, 1)',
                width: '20px'
            },
            '.szh-accordion': {
                borderBottom: `1px solid ${theme?.palette?.themeLighter ?? '#d3d3d3'}`,
                $nest: {
                    '&__item': {
                        borderBottom: `1px solid ${theme?.palette?.themeLighter ?? '#d3d3d3'}`,
                        $nest: {
                            '&-btn': {
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                margin: 0,
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: 400,
                                textAlign: 'left',
                                color: theme?.palette?.themePrimary ?? '#0078d4',
                                backgroundColor: 'transparent',
                                border: 'none',
                                $nest: {
                                    '&:hover': {
                                        backgroundColor: theme?.palette?.themeLighterAlt ?? '#f3f2f1'
                                    }
                                }
                            },
                            '&-content': {
                                transition: 'height 0.25s cubic-bezier(0, 0, 0, 1)'
                            },
                            '&-panel': {
                                padding: '0.5rem'
                            },
                            '&--expanded': {
                                $nest: {
                                    '.szh-accordion__item-btn': {
                                        backgroundColor: theme?.palette?.themeLighter ?? '#f3f2f1'
                                    },
                                    '.chevron-down': {
                                        transform: 'rotate(180deg)'
                                    },
                                    '.szh-accordion__item-heading': {
                                         boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                         borderRadius: "5px",
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

// The chevron down image
export const chevronDown = (theme: IReadonlyTheme | undefined): string => {
    console.log("theme", theme);
    const storkeColour = theme?.palette?.themePrimary?.substr(1) ?? '0078d4';
    return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23${storkeColour}' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m2 5 6 6 6-6'/%3E%3C/svg%3E`;
} 