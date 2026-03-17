"use client";

import { useEffect } from "react";

const EscapeAnimationStopper = () => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      document.documentElement.classList.add("animations-paused");
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
};

export default EscapeAnimationStopper;