import React from "react";

import ReactMarkdown from "react-markdown";

interface IProps {
  body: string;
}

export function MarkdownRenderer({ body }: IProps): JSX.Element {
  return <ReactMarkdown>{body}</ReactMarkdown>;
}
