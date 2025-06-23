import * as React from "react";

import { useStyles } from "./useStyles";
import { utils } from "../../utils/utils";

export interface StatusIndicatorProps {
  status: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const { getStatusColor } = utils();
  const { statusBullet, root } = useStyles();
  return (
    <div className={root}>
      <span
        className={statusBullet}
        style={{
          backgroundColor: getStatusColor(status),
        }}
      />
    </div>
  );
};
