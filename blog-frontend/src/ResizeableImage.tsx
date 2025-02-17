import { Node } from "@tiptap/core";
import Image from "@tiptap/extension-image";

interface ResizableImageOptions {
  onImageResize?: (base64: string) => void; // Callback function for base64
}

const ResizableImage = Image.extend<ResizableImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      onImageResize: undefined, // Default callback is undefined
    };
  },

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
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          return attributes.src ? { src: attributes.src } : {};
        },
      },
      base64: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-base64"),
        renderHTML: (attributes) => {
          return attributes.base64 ? { "data-base64": attributes.base64 } : {};
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

      // Create the resize handles for all four corners
      const createResizeHandle = (position: string) => {
        const resizeHandle = document.createElement("div");
        resizeHandle.style.width = "10px";
        resizeHandle.style.height = "10px";
        resizeHandle.style.background = "blue";
        resizeHandle.style.position = "absolute";
        resizeHandle.style.cursor =
          position === "top-left" || position === "bottom-right"
            ? "nwse-resize"
            : "nesw-resize";

        switch (position) {
          case "top-left":
            resizeHandle.style.top = "0";
            resizeHandle.style.left = "0";
            break;
          case "top-right":
            resizeHandle.style.top = "0";
            resizeHandle.style.right = "0";
            break;
          case "bottom-left":
            resizeHandle.style.bottom = "0";
            resizeHandle.style.left = "0";
            break;
          case "bottom-right":
            resizeHandle.style.bottom = "0";
            resizeHandle.style.right = "0";
            break;
        }

        wrapper.appendChild(resizeHandle);

        return resizeHandle;
      };

      const resizeHandles = [
        createResizeHandle("top-left"),
        createResizeHandle("top-right"),
        createResizeHandle("bottom-left"),
        createResizeHandle("bottom-right"),
      ];

      resizeHandles.forEach((handle) => {
        handle.addEventListener("mousedown", (event) => {
          event.preventDefault();
          const startX = event.clientX;
          const startY = event.clientY;
          const startWidth = img.offsetWidth;
          const startHeight = img.offsetHeight;

          const onMouseMove = (moveEvent: any) => {
            let newWidth = startWidth + (moveEvent.clientX - startX);
            let newHeight = startHeight + (moveEvent.clientY - startY);

            // Adjust the resizing based on which corner is being dragged
            if (handle.style.top === "0px" && handle.style.left === "0px") {
              newWidth = startWidth - (moveEvent.clientX - startX);
              newHeight = startHeight - (moveEvent.clientY - startY);
            }
            if (handle.style.top === "0px" && handle.style.right === "0px") {
              newHeight = startHeight - (moveEvent.clientY - startY);
            }
            if (handle.style.bottom === "0px" && handle.style.left === "0px") {
              newWidth = startWidth - (moveEvent.clientX - startX);
            }

            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
          };

          const onMouseUp = () => {
            // Get new width and height
            const newWidth = img.offsetWidth;
            const newHeight = img.offsetHeight;
          
            // Convert the resized image to base64
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
          
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx?.drawImage(img, 0, 0, newWidth, newHeight);
          
            const base64 = canvas.toDataURL("image/png");
          
            // Append width and height metadata to base64 string
            const base64WithMetadata = `${base64}|width:${newWidth}|height:${newHeight}`;
          
            // Update the node attributes in TipTap
            editor
              .chain()
              .focus()
              .updateAttributes("image", {
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                base64: base64WithMetadata, // Store base64 with embedded metadata
              })
              .run();
          
            // Trigger the callback with the base64 data
            if (this.options.onImageResize) {
              this.options.onImageResize(base64WithMetadata);
            }
          
            // Remove event listeners
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
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