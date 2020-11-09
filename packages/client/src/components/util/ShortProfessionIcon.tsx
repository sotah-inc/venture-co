import React from "react";

import { IShortProfession } from "@sotah-inc/core";

interface IProps {
  profession: IShortProfession;
}

export const ShortProfessionIcon: React.SFC<IProps> = ({ profession }: IProps) => {
  return <img src={profession.icon_url} className="profession-icon" />;
};
