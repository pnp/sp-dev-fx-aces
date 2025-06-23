/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import {
  Button,
  DataGridProps,
  TableColumnSizingOptions,
} from "@fluentui/react-components";
import { DataGrid, IColumnConfig, ISortState } from "../dataGrid";

import { EMessageType } from "../../constants/EMessageTypes";
import { IHealthServices } from "../../models/IServiceHealthResults";
import { IServiceHealthProps } from "./IServiceHealthProps";
import { Icon } from "@iconify/react";
import ServiceIcon from "../serviceIcon/ServiceIcon";
import { ServiceName } from "../../hooks/useServiceIcons";
import { ShowMessage } from "../showMessage";
import { StatusIndicator } from "../statusIndicator/StatusIndicator";
import { useServiceHealthStyles } from "./useServiceHealthStyles";

export const ServiceHealth: React.FC<IServiceHealthProps> = ({
  data,
  onSelected,
  refresh,
  scope,
  error,
}) => {
  const styles = useServiceHealthStyles();
  const [sortState, setSortState] = React.useState<
    Parameters<NonNullable<DataGridProps["onSortChange"]>>[1]
  >({
    sortColumn: "status",
    sortDirection: "ascending",
  });
  const onSortChange = (nextSortState: ISortState) => {
    setSortState(nextSortState);
  };

  const columnSizingOptions: TableColumnSizingOptions = {
    service: {
      minWidth: 140,
      defaultWidth: 180,
      idealWidth: 180,
    },
    status: {
      defaultWidth: 120,
      minWidth: 120,
      idealWidth: 120,
    },
  };

  const columns: IColumnConfig<IHealthServices>[] = [
    {
      column: "service",
      header: "Service",
      order: (a, b) => a.service.localeCompare(b.service),
      media: (item) => {
        return (
          <ServiceIcon
            service={item.service as ServiceName}
            size={28}
            alt={item.service}
          />
        );
      },
    },
    {
      column: "status",
      header: "Status",
      media: (item) => {
        return <StatusIndicator status={item.status} />;
      },
      onRender: (item) => {
        if (item.status === "serviceOperational") {
          return <></>;
        }
        return (
          <Button
            appearance="secondary"
            icon={<Icon icon="fluent:content-view-16-regular" />}
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              if (onSelected) {
                onSelected(item);
              }
            }}
            aria-label="View details"
            title="View details"
          >
            Details
          </Button>
        );
      },
      order: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  if (error) {
    return (
      <ShowMessage message={error.message} messageType={EMessageType.ERROR} />
    );
  }

  return (
    <DataGrid<IHealthServices>
      columns={columns}
      items={data}
      enableSorting={true}
      enableResizing={false}
      selectionMode="none"
      resizableColumnsOptions={{ autoFitColumns: false }}
      onSelectionChange={(items) => {
        if (onSelected) {
          onSelected(items[0]);
        }
      }}
      columnSizingOptions={columnSizingOptions}
      onSortChange={onSortChange}
      defaultSortState={sortState}
      noItemsMessage={"Service health data not available."}
      dataGridBodyClassName={styles.gridContainer}
    />
  );
};
