import {
  FluentProvider,
  IdPrefixProvider,
  Theme,
} from "@fluentui/react-components";

import { ErrorBoundary } from "react-error-boundary";
import { IHealthServices } from "../../models/IServiceHealthResults";
import { IRenderQuickViewProps } from "./IRenderQuickViewProps";
import { IssueDetails } from "../issueDetails/IssueDetails";
import React from "react";
import { ServiceHealth } from "../serviceHealth/ServiceHealth";
import ShowError from "../showError/ShowError";
import Stack from "../stack/Stack";

export const RenderQuickView: React.FC<IRenderQuickViewProps> = ({
  error,
  theme,
  scope,
  data,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<IHealthServices>();

  const onSelected = React.useCallback((selected: IHealthServices): void => {
    setSelectedItem(selected);
    setShowDetails(true);
  }, []);

  const onDismissDetails = React.useCallback((): void => {
    setShowDetails(false);
    setSelectedItem(undefined);
  }, []);

  const fallbackRender = React.useCallback(({ error, resetErrorBoundary }) => {
    console.error(`[ServiceHealth: ${error.message}`);
    return <ShowError message={error.message}>{null}</ShowError>;
  }, []);

  return (
    <>
      <IdPrefixProvider value="service-health-quick-view">
        <FluentProvider theme={theme}>
          <ErrorBoundary fallbackRender={fallbackRender}>
            <Stack rowGap="10px" padding="m">
              <ServiceHealth
                error={error}
                data={data}
                onSelected={onSelected}
                scope={scope}
              />
            </Stack>

            {showDetails && selectedItem && (
              <IssueDetails
                selectedItem={selectedItem}
                onDismiss={onDismissDetails}
                isOpen={showDetails}
                theme={theme as Theme}
              />
            )}
          </ErrorBoundary>
        </FluentProvider>
      </IdPrefixProvider>
    </>
  );
};
