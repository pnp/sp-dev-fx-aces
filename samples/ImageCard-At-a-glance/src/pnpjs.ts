import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/comments";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { Article } from "./adaptiveCardExtensions/newsGlance/types";
import { format, parseISO } from "date-fns";

let _sp: SPFI | null = null;

// A method we can use across the application to get a valid SPFI object, even when
// we no longer have access to the context, such as within views. This must be called
// the first time from the core ACE class to capture a reference to the context.
export function getSP(context?: AdaptiveCardExtensionContext): SPFI {

    if (_sp === null && context) {
        _sp = spfi().using(SPFx(context));
    }

    if (_sp === null) {
        throw Error("You must call getSP passing the context within the Extension class before using it in child views.");
    }

    return _sp;
}

// Helper that reads a Site Pages article by id and maps it to the Article model.
export async function getArticle(sp: SPFI, id: number): Promise<Article> {

    try {
        const article = await sp.web.lists.getByTitle("Site Pages").items
            .getById(id)
            .select("Title", "BannerImageUrl", "FileRef", "CanvasContent1", "Modified")();

        return {
            title: `${article.Title} (${format(parseISO(article.Modified), "do MMM yyyy")})`,
            link: article.FileRef,
            imageUrl: article.BannerImageUrl?.Url,
            content: article.CanvasContent1
        };
    } catch (error) {
        return null;
    }
}
