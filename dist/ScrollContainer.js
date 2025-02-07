"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var ScrollContext_1 = require("./ScrollContext");
var environment_1 = __importDefault(require("./utils/environment"));
var ScrollAnimatorContainer = function (props) {
    var _a = props.snap, snap = _a === void 0 ? "none" : _a, children = props.children, _b = props.scrollParent, scrollParent = _b === void 0 ? window : _b, customStyle = props.customStyle;
    var _c = react_1.useState({
        currentY: 0,
        viewportHeight: 0,
        totalPage: 0,
        totalHeight: 0,
        totalProgress: 0,
        realPage: 0,
        currentPage: 0,
        currentProgress: 0,
    }), scrollData = _c[0], setScrollData = _c[1];
    var doSnap = snap !== "none";
    var scrollTimer = react_1.useRef();
    var scrollEvent = react_1.useCallback(function () {
        if (snap && scrollTimer.current)
            clearTimeout(scrollTimer.current);
        var currentY = scrollParent === window
            ? window.pageYOffset
            : scrollParent.scrollTop;
        var viewportHeight = scrollParent === window
            ? environment_1.default.height
            : scrollParent.clientHeight;
        var totalPage = children.length || 0;
        var totalHeight = totalPage * (viewportHeight - 1);
        var totalProgress = currentY / totalHeight; // Full page progress 0 ~ 1
        var realPage = currentY / viewportHeight;
        var currentPage = Math.floor(realPage);
        var currentProgress = realPage - currentPage;
        setScrollData({
            currentY: currentY,
            viewportHeight: viewportHeight,
            totalPage: totalPage,
            totalHeight: totalHeight,
            totalProgress: totalProgress,
            realPage: realPage,
            currentPage: currentPage,
            currentProgress: currentProgress,
        });
        if (doSnap) {
            scrollTimer.current = setTimeout(function () {
                var newCurrentPage = Math.round(realPage);
                var newCurrentY = currentY;
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
    react_1.useEffect(function () {
        scrollEvent();
        scrollParent.addEventListener("scroll", scrollEvent);
        scrollParent.addEventListener("resize", scrollEvent);
        return function () { return scrollParent.removeEventListener("scroll", scrollEvent); };
    }, [scrollEvent, scrollParent]);
    return (react_1.default.createElement("div", { style: customStyle },
        react_1.default.createElement(ScrollContext_1.ScrollContainerContext.Provider, { value: scrollData }, children)));
};
exports.default = ScrollAnimatorContainer;
