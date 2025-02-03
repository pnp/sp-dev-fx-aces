import * as React from 'react';
import styles from '../QuickView.module.scss';
import { ISPFXContext, SPFI, spfi } from '@pnp/sp';  
import { SPFx } from '@pnp/sp';        
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";

interface IQuickViewComponentProps {
  context: ISPFXContext;  
  listName: string;      
}

const QuickViewComponent: React.FC<IQuickViewComponentProps> = (props) => {
  const [listItems, setListItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize PnPjs using the SPFx context
  const sp: SPFI = spfi().using(SPFx(props.context));

  // Fetch the list items on component mount
  React.useEffect(() => {
    const fetchListItems = async () => {
      // Check if listName is empty and set an error message
      if (!props.listName.trim()) {
        setError('The list name should be configured in the property pane.');
        setLoading(false);
        return;
      }

      try {
        setError(null); // Reset error state before fetching
        setLoading(true); // Set loading to true while fetching
        // Fetch list items using PnPjs
        const items = await sp.web.lists.getByTitle(props.listName).items();
        setListItems(items);  // Update state with fetched items
      } catch (error) {
        console.error('Error fetching list items:', error);
        setError('An error occurred while fetching the list items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListItems();
  }, [props.listName]);

  return (
    <div className={styles.container}>
      <h2>React-Based QuickView: Displaying List Items</h2>
      <p>List Name: {props.listName}</p>

      {loading ? (
        <p>Loading items...</p>
      ) : error ? (
        <p>{error}</p> // Display error message if an error occurred or list name is missing
      ) : (
        <ul>
          {listItems.length > 0 ? (
            listItems.map((item) => (
              <li key={item.Id}>
                <p>{item.Title}</p> {/* Assuming the list has a Title field */}
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
