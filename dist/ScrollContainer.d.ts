import React from "react";
interface ScrollContainerProps {
    snap?: "none" | "proximity" | "mandatory";
    children: React.ReactNodeArray;
    scrollParent?: Window | HTMLElement;
    customStyle?: {};
}
declare const ScrollAnimatorContainer: (props: ScrollContainerProps) => JSX.Element;
export default ScrollAnimatorContainer;
