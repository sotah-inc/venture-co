import React from "react";

import ReactMarkdown from "react-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shortcodes from "remark-shortcodes";

import { ShortcodeRenderer } from "./ShortcodeRenderer";

interface IProps {
  body: string;
}

export function MarkdownRenderer({ body }: IProps): JSX.Element {
  return (
    <ReactMarkdown
      escapeHtml={false}
      plugins={[[shortcodes, { inlineMode: true }]]}
      source={body}
      renderers={{ shortcode: ShortcodeRenderer }}
    />
  );
}
