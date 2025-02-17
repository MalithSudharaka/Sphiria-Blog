/* import { FC } from "react";
import { EditorContent, Editor } from "@tiptap/react";
import { useDropzone } from "react-dropzone";

interface EditorContentWrapperProps {
  editor: Editor;
  handleDrop: (acceptedFiles: File[]) => void;
}

const EditorContentWrapper: FC<EditorContentWrapperProps> = ({ editor, handleDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className="editor-dropzone">
      <input {...getInputProps()} />
      <EditorContent editor={editor} className="editor" />
    </div>
  );
};

export default EditorContentWrapper;
 */