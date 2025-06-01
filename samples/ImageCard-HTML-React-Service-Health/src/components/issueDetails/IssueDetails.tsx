import * as React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogSurface,
  FluentProvider,
  IdPrefixProvider,
} from "@fluentui/react-components";

import { IIssueDetailsProps } from "./IIssueDetailsProps";
import { IssueInformation } from "./IssueInformation";
import { RenderHeader } from "../renderHeader";
import ServiceIcon from "../serviceIcon/ServiceIcon";
import { ServiceName } from "../../hooks/useServiceIcons";
import Stack from "../stack/Stack";
import TypographyControl from "../typographyControl/TypographyControl";
import strings from "M365ServiceHealthAdaptiveCardExtensionStrings";

export const IssueDetails: React.FunctionComponent<IIssueDetailsProps> = (
  props: React.PropsWithChildren<IIssueDetailsProps>
) => {
  const { selectedItem, onDismiss, isOpen, theme } = props;

  const RenderContent = React.useMemo(() => {
    return <IssueInformation healthService={selectedItem} />;
  }, [selectedItem]);

  const RenderDialog = React.useMemo(() => {
    return (
       <IdPrefixProvider value="service-health">
          <FluentProvider theme={theme}>
      <Dialog
        open={isOpen}
        onOpenChange={(_, { open }) => !open && onDismiss()}
      >
        <DialogSurface style={{ paddingTop: 0 }}>
          <Stack>
            <RenderHeader
              onDismiss={onDismiss}
              title={selectedItem.service}
              description={strings.IssueDetailsDescription}
              icon={<ServiceIcon service={selectedItem.service as ServiceName} />}
              showCloseButton={true}
            />
            <Stack rowGap="15px"  paddingTop="m">
              <TypographyControl fontSize="m" fontWeight="semibold" paddingBottom="l">
                {strings.InformationHeader}
              </TypographyControl>
             
              {RenderContent}
            </Stack>
          </Stack>

          <DialogActions style={{ paddingTop: 20 }}>
            <Button appearance="secondary" onClick={onDismiss}>
              Cancel
            </Button>
          </DialogActions>
        </DialogSurface>
      </Dialog>
      </FluentProvider>
      </IdPrefixProvider>
    );
  }, [isOpen, selectedItem, onDismiss, RenderContent]);

  return <>{RenderDialog}</>;
};
