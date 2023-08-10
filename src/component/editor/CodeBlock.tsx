import { Extension } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { FC } from 'react';
import { Select } from '../miniComponent';

export interface CodeBlockComponentProps {
  node: ProsemirrorNode;
  updateAttributes: (attrs: { language: string }) => void;
  extension: Extension;
}
const CodeBlock: FC<CodeBlockComponentProps> = ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => {
  return (
    <NodeViewWrapper className="relative">
      <div className="absolute top-4 right-4">
        <Select
          defaultText={defaultLanguage || "auto"}
          onChange={
            (event) => {
              updateAttributes({ language: event.value })
            }
          }
          options={
            (() => {
              const res = extension.options.lowlight.listLanguages().map((lang: string, index: string | number) => ({
                label: lang,
                value: lang
              }));

              return res;
            })()
          }
        /></div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}

export default CodeBlock;