import { useEffect, useState } from "react";

const useCloseMenu = (elementId) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const outsideClickHandler = (e) => {
      if (
        isMenuOpen &&
        !document.getElementById(elementId).contains(e.target)
      ) {
        setIsMenuOpen((p) => !p);
      }
    };

    document.addEventListener("mousedown", outsideClickHandler);

    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [elementId, isMenuOpen]);

  return { isMenuOpen, setIsMenuOpen };
};

export default useCloseMenu;
