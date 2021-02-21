import React from "react";

import { IProfession } from "@sotah-inc/core";

interface IProps {
  profession: IProfession;
}

export const ProfessionIcon = ({ profession }: IProps): JSX.Element | null => {
  if (profession.icon_url.length === 0) {
    return null;
  }

  return <img alt="" src={profession.icon_url} className="item-icon" />;
};
