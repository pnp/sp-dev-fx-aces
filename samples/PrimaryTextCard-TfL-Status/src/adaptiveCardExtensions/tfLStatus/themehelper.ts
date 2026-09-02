import { getTheme } from '@uifabric/styling';

interface IThemeState {
    theme?: { [slot: string]: string };
}

const ThemeState: IThemeState = (window as unknown as { __themeState__: IThemeState }).__themeState__;

// Get theme from global UI fabric state object if exists, if not fall back to using uifabric    
export function getThemeColor(slot: string): string {
    if (ThemeState && ThemeState.theme && ThemeState.theme[slot]) {
        return ThemeState.theme[slot];
    }
    const theme = getTheme();
    return (theme as unknown as { [slot: string]: string })[slot];
}