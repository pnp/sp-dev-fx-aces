import {
  Theme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  teamsLightTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { Theme as V8Theme, getTheme } from "@fluentui/react";

import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { DirectoryRole } from "@microsoft/microsoft-graph-types";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { createV9Theme } from "@fluentui/react-migration-v8-v9";

export const isUserAdmin = async (
  client: MSGraphClientV3
): Promise<boolean> => {
  try {
    const response = await client.api("/me/memberOf").version("v1.0").get();
    type DirectoryRoleWithOData = DirectoryRole & { "@odata.type"?: string };
    const roles: DirectoryRoleWithOData[] = response.value;

    const adminRoles = [
      "Global Administrator",
      "Service Support Administrator",
      "Helpdesk Administrator",
      "Global Reader",
      "Power Platform admin",
      "User admin",
    ].map((role) => role.trim().toLowerCase());

    return roles.some(
      (role) =>
        role.displayName &&
        role["@odata.type"] === "#microsoft.graph.directoryRole" &&
        adminRoles.includes(role.displayName.trim().toLowerCase())
    );
  } catch (error) {
    console.error("Error checking user roles:", error);
    return false;
  }
};
// Load the current theme from the window object
export const loadTheme = (): IReadonlyTheme | undefined => {
  if (typeof window.__loadTheme === "function") {
    return window.__loadTheme();
  }
  console.warn("Theme loading function not found.");
  return undefined;
};

/**
 * Converts an SPFx IReadonlyTheme into a full Fluent UI v8 Theme
 * by using Fluent's DefaultTheme as fallback.
 */
export const convertToV8Theme = (spfxTheme: IReadonlyTheme): V8Theme => {
  const DefaultTheme = getTheme();
  return {
    ...DefaultTheme,
    palette: {
      ...DefaultTheme.palette,
      ...(spfxTheme.palette || {}),
    },
  };
};

export const getAppTheme = async (
  context: AdaptiveCardExtensionContext
): Promise<Theme> => {
  const theme = loadTheme();

  const hasTeamsContext = context.sdks?.microsoftTeams?.teamsJs !== undefined;

  if (hasTeamsContext) {
    // get teams theme
    const teamsContext =
      await context?.sdks?.microsoftTeams?.teamsJs?.app?.getContext();
    console.log("teamsContext", teamsContext);
    // If the context is available, determine the theme based on the app info
    if (teamsContext) {
      console.log("teamsContext.app", teamsContext.app);
      const teamsTheme = teamsContext.app?.appInfo.theme || "default";
      switch (teamsTheme) {
        case "dark":
          return teamsDarkTheme;
        case "contrast":
          return teamsHighContrastTheme;
        case "default":
          return teamsLightTheme;
        default:
          return teamsLightTheme; // Fallback to light theme
      }
    }
  }
  // Use the theme loaded from SPFx
  if (theme) {
    const v8Theme = convertToV8Theme(theme);
    return createV9Theme(v8Theme);
  }
  // Fallback to web light theme if no theme is found
  return webLightTheme;
};
