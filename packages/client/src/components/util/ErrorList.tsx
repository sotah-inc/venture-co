import { FormGroup, Intent } from "@blueprintjs/core";
import React from "react";

import { IErrors } from "../../types/global";

type Props = Readonly<{
  errors: IErrors;
}>;

const renderError = (value: string | undefined, index: number) => {
  return <FormGroup key={index} helperText={value} intent={Intent.DANGER} />;
};

export const ErrorList: React.SFC<Props> = ({ errors }: Props) => {
  return <>{Object.keys(errors).map((v, i) => renderError(errors[v], i))}</>;
};
