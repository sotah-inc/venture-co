import React from "react";

import { Currency } from "./Currency";
import { ItemStandalone } from "./ItemStandalone";

interface IRenderers {
  [key: string]: (v: IAttributes) => React.ReactElement;
}

const renderers: IRenderers = {
  Currency: (attributes: IAttributes) => {
    return <Currency amount={Number(attributes.amount)} />;
  },
  Item: attrs => {
    return <ItemStandalone itemId={attrs.itemId} />;
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
