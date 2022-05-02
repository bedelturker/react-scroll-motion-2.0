import React from "react";
interface ScrollPageProps {
    children: React.ReactNode;
    page: number;
    debugBorder?: boolean;
    customStyle?: {};
}
declare const ScrollPage: (props: ScrollPageProps) => JSX.Element;
export default ScrollPage;
