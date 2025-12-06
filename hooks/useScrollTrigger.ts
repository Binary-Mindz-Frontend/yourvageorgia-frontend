import { useEffect, useState } from "react";

const useScrollTrigger = () => {
  const [scrolled, setScrolled] = useState(false);
  const handleScrollCange = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScrollCange);

    return () => {
      window.removeEventListener("scroll", handleScrollCange);
    };
  }, []);
  return { scrolled };
};

export default useScrollTrigger;
