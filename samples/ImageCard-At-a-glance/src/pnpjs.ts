import { extendFactory } from "@pnp/odata";
import { SPRest } from "@pnp/sp";
import { Web, IWeb } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/comments";
import { AdaptiveCardExtensionContext } from "@microsoft/sp-adaptive-card-extension-base";
import { Article } from "./adaptiveCardExtensions/newsGlance/types";
import { format, parseISO } from 'date-fns';

// extend our web object with the custom extensions below so typings work
declare module "@pnp/sp/webs" {
    interface IWeb {
        getArticle: (this: IWeb, id: number) => Promise<Article>;
    }
}

// extend the web factory to add our needed methods
extendFactory(Web, {

    getArticle: async function (this: IWeb, id: number): Promise<Article> {

        try {
            const article = await this.lists.getByTitle("Site Pages").items
            .getById(id)
            .select("Title", "BannerImageUrl", "FileRef", "CanvasContent1", "Modified")
            <{
                Title: string,
                Modified: string,
                BannerImageUrl: {
                    Url: string
                },
                FileRef: string,
                CanvasContent1: string
            }>();

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
});

let _context: AdaptiveCardExtensionContext | null = null;
let _sp: SPRest | null = null;

// a method we can use across the application to get a valid sp object, even when
// we no longer have access to the context, such as within views. This must be called
// the first time from the core ACE class to capture a ref to the context
export function getSP(context: AdaptiveCardExtensionContext = _context): SPRest {

    if (typeof _sp !== "undefined" && _sp !== null) {
        return _sp;
    }

    if (_context === null) {
        _context = context;
    }

    if (typeof _context === "undefined" || _context === null) {
        throw Error("You must call getSP passing the context within the Extension class before using it child views.");
    }

    const sp = new SPRest();

    // setup our sp as needed for this application
    sp.setup({
        spfxContext: context,
        sp: {
            headers: {
                "Accept": "application/json;odata=nometadata",
            },
        },
    });

    _sp = sp;

    return sp;
}