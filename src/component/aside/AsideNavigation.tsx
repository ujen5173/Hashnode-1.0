import { Tooltip } from "@mantine/core";
import React, { type FC } from "react";

interface Props {
  item: {
    name: string;
    icon: React.ReactNode;
    href?: string;
    type: string;
  };
}
const AsideNavigation: FC<Props> = ({ item }) => {
  return (
    <Tooltip label={item.name} position="right" withArrow>
      <div
        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 focus:bg-red dark:bg-primary dark:hover:bg-primary-light"
        role="button"
      >
        <div className="flex items-center justify-center">{item.icon}</div>
        <div className="font-semibold text-gray-700 dark:text-text-secondary">
          {item.name}
        </div>
      </div>
    </Tooltip>
  );
};

export default AsideNavigation;
