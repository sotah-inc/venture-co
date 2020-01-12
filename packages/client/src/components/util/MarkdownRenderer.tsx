import React from "react";

import ReactMarkdown from "react-markdown";

// tslint:disable-next-line:no-var-requires
const shortcodes = require("remark-shortcodes");

import { ShortcodeRenderer } from "./ShortcodeRenderer";

interface IProps {
  body: string;
}

export function MarkdownRenderer({ body }: IProps) {
  return (
    <ReactMarkdown
      escapeHtml={false}
      plugins={[[shortcodes, { inlineMode: true }]]}
      source={body}
      renderers={{ shortcode: ShortcodeRenderer }}
    />
  );
}
