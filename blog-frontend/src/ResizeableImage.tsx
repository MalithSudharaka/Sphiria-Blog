import { Node } from "@tiptap/core";
import Image from "@tiptap/extension-image";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => {
          return attributes.width ? { width: attributes.width } : {};
        },
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("height") || "auto",
        renderHTML: (attributes) => {
          return attributes.height ? { height: attributes.height } : {};
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.style.width = node.attrs.width || "auto";
      img.style.height = node.attrs.height || "auto";
      img.style.cursor = "pointer";
      img.draggable = false;

      // Create a resizable wrapper
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      wrapper.style.position = "relative";
      wrapper.appendChild(img);

      // Create a resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.style.width = "10px";
      resizeHandle.style.height = "10px";
      resizeHandle.style.background = "blue";
      resizeHandle.style.position = "absolute";
      resizeHandle.style.bottom = "0";
      resizeHandle.style.right = "0";
      resizeHandle.style.cursor = "nwse-resize";
      wrapper.appendChild(resizeHandle);

      resizeHandle.addEventListener("mousedown", (event) => {
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;

        const onMouseMove = (moveEvent: any) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          const newHeight = startHeight + (moveEvent.clientY - startY);
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        };

        const onMouseUp = () => {
          editor.commands.updateAttributes("image", {
            width: img.style.width,
            height: img.style.height,
          });
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });

      return {
        dom: wrapper,
        update: (updatedNode) => {
          img.src = updatedNode.attrs.src;
          img.style.width = updatedNode.attrs.width || "auto";
          img.style.height = updatedNode.attrs.height || "auto";
          return true;
        },
      };
    };
  },
});

export default ResizableImage;
