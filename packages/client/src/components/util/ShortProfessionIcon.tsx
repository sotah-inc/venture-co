import React from "react";

import { IShortProfession } from "@sotah-inc/core";

interface IProps {
  profession: IShortProfession;
}

export const ShortProfessionIcon = ({ profession }: IProps): React.ReactNode => {
  return <img alt="" src={profession.icon_url} className="profession-icon" />;
};
