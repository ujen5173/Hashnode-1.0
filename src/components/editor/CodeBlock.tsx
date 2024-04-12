/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Extension } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { type Node as ProsemirrorNode } from "prosemirror-model";
import { type FC } from "react";
import Select from "../inputs/Select";

export interface CodeBlockComponentProps {
  node: ProsemirrorNode;
  updateAttributes: (attrs: { language: string }) => void;
  extension: Extension;
}
const CodeBlock: FC<CodeBlockComponentProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  return (
    <NodeViewWrapper className="relative">
      <div className="absolute right-4 top-4">
        <Select
          defaultText={defaultLanguage || "auto"}
          onChange={(event) => {
            updateAttributes({ language: event.value });
          }}
          options={(() => {
            const res = extension.options.lowlight
              .listLanguages()
              .map((lang: string) => ({
                label: lang,
                value: lang,
              }));

            return res;
          })()}
        />
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
