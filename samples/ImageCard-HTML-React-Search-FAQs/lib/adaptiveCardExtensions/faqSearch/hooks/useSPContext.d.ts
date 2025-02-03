import { ISPFXContext, SPFI } from "@pnp/sp";
/**
 * Initializes and returns the PnPjs SPFI instance using the provided SharePoint context.
 * This ensures that the SPFI instance is initialized only once and reused.
 *
 * @param context - The SharePoint context (ISPFXContext)
 * @param siteUrl - The SharePoint site URL (optional). If not provided, it will use the current site URL.
 * @returns SPFI - The initialized PnPjs instance
 */
export declare const useSPContext: (context: ISPFXContext, siteUrl?: string) => SPFI;
//# sourceMappingURL=useSPContext.d.ts.map