import * as React from 'react';
import styles from '../QuickView.module.scss';
import { ISPFXContext } from '@pnp/sp';
import { SharePointListService } from '../../services/SharePointListService';
import { IListItem } from '../../models/IListItem';

interface IQuickViewComponentProps {
  context: ISPFXContext;
  listName: string;
}

const QuickViewComponent: React.FC<IQuickViewComponentProps> = ({ context, listName = '' }) => {
  const [listItems, setListItems] = React.useState<IListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchListItems = async (): Promise<void> => {
      // Guard against an undefined SharePoint context (prevents the destructure/undefined error on load)
      if (!context) {
        setError('SharePoint context is not available.');
        setLoading(false);
        return;
      }

      // Guard against an undefined or empty list name
      if (!listName || !listName.trim()) {
        setError('The list name should be configured in the property pane.');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const service = new SharePointListService(context);
        const items = await service.getListItems(listName);
        setListItems(items);
      } catch (err) {
        console.error('Error fetching list items:', err);
        setError('An error occurred while fetching the list items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListItems().catch((err): void => {
      console.error('Unexpected error fetching list items:', err);
      setError('An unexpected error occurred while loading the list items.');
      setLoading(false);
    });
  }, [context, listName]);

  return (
    <div className={styles.container}>
      <h2>React-Based QuickView: Displaying List Items</h2>
      <p>List Name: {listName}</p>

      {loading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {listItems.length > 0 ? (
            listItems.map((item) => (
              <li key={item.Id}>
                <p>{item.Title}</p>
              </li>
            ))
          ) : (
            <p>No items found in the list.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default QuickViewComponent;
