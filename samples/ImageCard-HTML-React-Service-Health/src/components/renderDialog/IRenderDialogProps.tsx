import * as React from 'react';

import { Theme } from '@fluentui/react-components';

export interface IRenderDialogProps {
  isOpen: boolean;
  dialogTitle?: string | React.ReactNode;
  dialogActions?: JSX.Element;
  onDismiss?: (open?: boolean) => void;
  minWidth?: number | string;
  maxWidth?: number | string;
  className?: string;
  minHeight?: number | string;
  maxHeight?: number | string;
  theme: Theme | undefined;
}
