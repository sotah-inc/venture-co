import * as React from "react";

import { Currency } from "./Currency";

interface IRenderers {
  [key: string]: (v: IAttributes) => React.ReactElement;
}

const renderers: IRenderers = {
  Currency: (attributes: IAttributes) => {
    return <Currency amount={Number(attributes.amount)} />;
  },
};

interface IAttributes {
  [key: string]: string;
}

interface IProps {
  identifier: string;
  attributes: IAttributes;
}

export const ShortcodeRenderer: React.SFC<IProps> = ({ identifier, attributes }: IProps) => {
  if (!(identifier in renderers)) {
    return null;
  }

  return renderers[identifier](attributes);
};
