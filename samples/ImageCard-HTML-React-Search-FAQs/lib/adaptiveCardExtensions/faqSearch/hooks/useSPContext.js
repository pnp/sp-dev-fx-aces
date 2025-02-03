import { spfi, SPFx } from "@pnp/sp";
import { Logger } from "@pnp/logging";
var spInstance = null;
/**
 * Initializes and returns the PnPjs SPFI instance using the provided SharePoint context.
 * This ensures that the SPFI instance is initialized only once and reused.
 *
 * @param context - The SharePoint context (ISPFXContext)
 * @param siteUrl - The SharePoint site URL (optional). If not provided, it will use the current site URL.
 * @returns SPFI - The initialized PnPjs instance
 */
export var useSPContext = function (context, siteUrl) {
    if (!spInstance) {
        // Use the provided siteUrl or default to the current site URL
        var resolvedSiteUrl = siteUrl || context.pageContext.web.absoluteUrl;
        try {
            spInstance = spfi(resolvedSiteUrl).using(SPFx(context)); // Initialize the SPFI instance
        }
        catch (error) {
            Logger.write("Error initializing PnPjs: ".concat(error.message), 3 /* LogLevel.Error */);
            throw new Error("Failed to initialize PnPjs.");
        }
    }
    return spInstance;
};
//# sourceMappingURL=useSPContext.js.map