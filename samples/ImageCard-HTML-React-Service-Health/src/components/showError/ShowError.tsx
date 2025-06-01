import {
  Body1Strong,
  Subtitle1,
} from '@fluentui/react-components';

import { ErrorIcon } from '../errorSVG/ErrorSVG';
import { IErrorDisplayProps } from './IErrorDisplayProps';
import React from 'react';
import { useShowErrorStyles } from './useShowErrorStyles';

export const ShowError: React.FC<IErrorDisplayProps> = ({ message }) => {
  const styles = useShowErrorStyles();
  return (
    <div className={styles.container}>
      <Subtitle1>Service Health</Subtitle1>
      <ErrorIcon className={styles.icon} />
      <Body1Strong className={styles.message}>{message}</Body1Strong>
    </div>
  );
};

export default ShowError;
