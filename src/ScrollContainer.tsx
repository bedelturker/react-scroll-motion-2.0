import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollContainerContext } from "./ScrollContext";
import environment from "./utils/environment";

interface ScrollContainerProps {
  snap?: "none" | "proximity" | "mandatory";
  children: React.ReactNodeArray;
  scrollParent?: Window | HTMLElement;
  style : {}
}

interface IState {
  currentY: number;
  viewportHeight: number;
  totalPage: number;
  totalHeight: number;
  totalProgress: number;
  realPage: number;
  currentPage: number;
  currentProgress: number;
}

const ScrollAnimatorContainer = (props: ScrollContainerProps) => {
  const { snap = "none", children, scrollParent = window, style } = props;

  const [scrollData, setScrollData] = useState<IState>({
    currentY: 0, // Current Scroll Position (px)
    viewportHeight: 0, // Screen Height(px)
    totalPage: 0, // Total number of pages
    totalHeight: 0, // Total page height (px)
    totalProgress: 0, // Total page progress (%)
    realPage: 0, //  
    currentPage: 0, // 
    currentProgress: 0, // (%)
  });

  const doSnap: boolean = snap !== "none";
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

  const scrollEvent = useCallback(() => {
    if (snap && scrollTimer.current) clearTimeout(scrollTimer.current);

    const currentY: number =
      scrollParent === window
        ? window.pageYOffset
        : (scrollParent as HTMLElement).scrollTop;
    const viewportHeight: number =
      scrollParent === window
        ? environment.height
        : (scrollParent as HTMLElement).clientHeight;
    const totalPage: number = children.length || 0;
    const totalHeight: number = totalPage * (viewportHeight - 1);
    const totalProgress: number = currentY / totalHeight; // Full page progress 0 ~ 1
    const realPage: number = currentY / viewportHeight;
    const currentPage: number = Math.floor(realPage);
    const currentProgress: number = realPage - currentPage;
    
    setScrollData({
      currentY,
      viewportHeight,
      totalPage,
      totalHeight,
      totalProgress,
      realPage,
      currentPage,
      currentProgress,
    } as IState);

    if (doSnap) {
      scrollTimer.current = setTimeout(() => {
        const newCurrentPage = Math.round(realPage);
        let newCurrentY = currentY;

        if (snap === "mandatory" || Math.abs(newCurrentPage - realPage) < 0.3)
          newCurrentY = newCurrentPage * viewportHeight;

        if (newCurrentY !== currentY)
          window.scrollTo({
            top: newCurrentY,
            behavior: "smooth",
          });
      }, 50);
    }
  }, [children.length, doSnap, scrollParent, snap]);

  useEffect(() => {
    scrollEvent();
    scrollParent.addEventListener("scroll", scrollEvent);
    scrollParent.addEventListener("resize", scrollEvent);
    return () => scrollParent.removeEventListener("scroll", scrollEvent);
  }, [scrollEvent, scrollParent]);

  return (
    <div style={style}>
      <ScrollContainerContext.Provider value={scrollData}>
        {children}
      </ScrollContainerContext.Provider>
    </div>
  );
};

export default ScrollAnimatorContainer;
