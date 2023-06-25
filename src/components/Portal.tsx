import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  wrapperId: string;
  children?: ReactNode;
};

export const Portal = (props: PortalProps) => {
  const { wrapperId, children } = props;
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let wrapper = document.getElementById(wrapperId) as HTMLDivElement | null;
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.setAttribute("id", wrapperId);
      document.body.appendChild(wrapper);
    }

    setWrapperEl(wrapper);

    // Delete Portal HTMLDivElement when unmounted
    return () => {
      if (!wrapper || !wrapper.parentNode) {
        return;
      }

      wrapper.parentNode.removeChild(wrapper);
    };
  }, [wrapperId]);

  if (!wrapperEl || !children) {
    return null;
  }

  return createPortal(children, wrapperEl);
};
