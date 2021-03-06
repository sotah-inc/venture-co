import React from "react";

import moment from "moment";

interface IProps {
  targetDate: Date;
}

export const LastModified = ({ targetDate }: IProps): JSX.Element => {
  return (
    <p style={{ textAlign: "right" }}>
      <em>
        Last updated: <abbr title={targetDate.toString()}>{moment(targetDate).fromNow()}</abbr>
      </em>
    </p>
  );
};
