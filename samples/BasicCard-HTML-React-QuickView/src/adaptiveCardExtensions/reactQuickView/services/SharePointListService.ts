import { ISPFXContext, SPFI, spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

import { IListItem } from '../models/IListItem';

export class SharePointListService {
  private readonly _sp: SPFI;

  constructor(context: ISPFXContext) {
    if (!context) {
      throw new Error('SharePointListService requires a valid SPFx context.');
    }

    this._sp = spfi().using(SPFx(context));
  }

  public async getListItems(listName: string): Promise<IListItem[]> {
    return this._sp.web.lists.getByTitle(listName).items.select('Id', 'Title')();
  }
}
