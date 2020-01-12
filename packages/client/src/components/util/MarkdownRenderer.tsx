import React from "react";

import ReactMarkdown from "react-markdown";
// @ts-ignore
import shortcodes from "remark-shortcodes";

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
