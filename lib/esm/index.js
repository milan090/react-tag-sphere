var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React from "react";
import { createRef, useEffect, useRef, useState, } from "react";
var defaultStyles = {
    getContainer: function (radius, fullWidth, fullHeight) {
        return ({
            position: "relative",
            width: fullWidth ? "100%" : "".concat(2 * radius, "px"),
            maxWidth: "100%",
            minHeight: "".concat(2 * radius, "px"),
            height: fullHeight ? "100%" : "".concat(2 * radius, "px"),
            touchAction: "none",
        });
    },
};
var computeInitialPosition = function (index, textsLength, size) {
    var phi = Math.acos(-1 + (2 * index + 1) / textsLength);
    var theta = Math.sqrt((textsLength + 1) * Math.PI) * phi;
    return {
        x: (size * Math.cos(theta) * Math.sin(phi)) / 2,
        y: (size * Math.sin(theta) * Math.sin(phi)) / 2,
        z: (size * Math.cos(phi)) / 2,
    };
};
var updateItemPosition = function (item, sc, depth, userSelect, blur, blurMultiplier, grayscale) {
    if (blurMultiplier > 1 || blurMultiplier < 0)
        throw new Error("blurMultiplier should have value between 0 and 1");
    var newItem = __assign(__assign({}, item), { scale: "" });
    var rx1 = item.x;
    var ry1 = item.y * sc[1] + item.z * -sc[0];
    var rz1 = item.y * sc[0] + item.z * sc[1];
    var rx2 = rx1 * sc[3] + rz1 * sc[2];
    var ry2 = ry1;
    var rz2 = rz1 * sc[3] - rx1 * sc[2];
    var per = (2 * depth) / (2 * depth + rz2); // todo
    newItem.x = rx2;
    newItem.y = ry2;
    newItem.z = rz2;
    if (newItem.x === item.x && newItem.y === item.y && newItem.z === item.z) {
        return item;
    }
    newItem.scale = per.toFixed(3);
    var alpha = per * per - 0.25;
    alpha = parseFloat((alpha > 1 ? 1 : alpha).toFixed(3));
    var itemEl = newItem.ref.current;
    var left = (newItem.x - itemEl.offsetWidth / 2).toFixed(2);
    var top = (newItem.y - itemEl.offsetHeight / 2).toFixed(2);
    var transform = "translate3d(".concat(left, "px, ").concat(top, "px, 0) scale(").concat(newItem.scale, ")");
    // @ts-ignore
    itemEl.style.WebkitTransform = transform;
    // @ts-ignore
    itemEl.style.MozTransform = transform;
    // @ts-ignore
    itemEl.style.OTransform = transform;
    itemEl.style.transform = transform;
    var filter = "";
    if (grayscale) {
        filter += "grayscale(".concat((alpha - 1) * -8, ") ");
    }
    if (blur) {
        filter += "blur(".concat((alpha - 1) * -5 > 1 ? Math.floor((alpha - 1) * -8) * blurMultiplier : 0, "px)");
    }
    itemEl.style.filter = filter;
    itemEl.style.zIndex = Math.floor(alpha * 1000) + "";
    itemEl.style.opacity = alpha + "";
    if (!userSelect)
        itemEl.style.userSelect = "none";
    return newItem;
};
var createItem = function (text, index, textsLength, size, itemRef) {
    var transformOrigin = "50% 50%";
    var transform = "translate3d(-50%, -50%, 0) scale(1)";
    var itemStyles = {
        willChange: "transform, opacity, filter",
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: index + 1,
        filter: "alpha(opacity=0)",
        opacity: 0,
        WebkitTransformOrigin: transformOrigin,
        MozTransformOrigin: transformOrigin,
        OTransformOrigin: transformOrigin,
        transformOrigin: transformOrigin,
        WebkitTransform: transform,
        MozTransform: transform,
        OTransform: transform,
        transform: transform,
    };
    // @ts-ignore
    var itemEl = (React.createElement("span", { ref: itemRef, key: index, style: itemStyles }, text));
    return __assign({ ref: itemRef, el: itemEl }, computeInitialPosition(index, textsLength, size));
};
var defaultState = {
    tags: [
        "This",
        "is",
        "TagSphere.",
        "Do",
        "you",
        "like",
        React.createElement("img", { width: 50, src: "https://cdn.svgporn.com/logos/react.svg", alt: "Random image" }),
        "it?",
        "Glad",
        "to",
        "see",
        "you",
    ],
    maxSpeed: 7,
    initialSpeed: 32,
    initialDirection: 135,
    keepRollingAfterMouseOut: true,
    fullWidth: false,
    fullHeight: false,
    userSelect: false,
    blur: true,
    blurMultiplier: 1,
    grayscale: true,
};
export var TagSphere = function (props) {
    // props.style = defaultState.style
    var _a = __assign(__assign({}, defaultState), props), maxSpeed = _a.maxSpeed, initialSpeed = _a.initialSpeed, tags = _a.tags, initialDirection = _a.initialDirection, keepRollingAfterMouseOut = _a.keepRollingAfterMouseOut, fullHeight = _a.fullHeight, fullWidth = _a.fullWidth, style = _a.style, userSelect = _a.userSelect, blur = _a.blur, blurMultiplier = _a.blurMultiplier, grayscale = _a.grayscale;
    var radius = props.radius || tags.length * 15;
    var depth = 2 * radius;
    var size = 1.5 * radius;
    var itemHooks = tags.map(function () { return createRef(); });
    var _b = useState([]), items = _b[0], setItems = _b[1];
    useEffect(function () {
        setItems(function () {
            return tags.map(function (text, index) {
                return createItem(text, index, tags.length, size, itemHooks[index]);
            });
        });
    }, [tags]);
    var containerRef = useRef(null);
    var _c = useState(true), firstRender = _c[0], setFirstRender = _c[1];
    var _d = useState(maxSpeed), lessSpeed = _d[0], setLessSpeed = _d[1];
    var _e = useState(false), active = _e[0], setActive = _e[1];
    var _f = useState(0), mouseX = _f[0], setMouseX = _f[1];
    var _g = useState(0), mouseY = _g[0], setMouseY = _g[1];
    var handleMouseMove = function (e) {
        // @ts-ignore
        var rect = containerRef.current.getBoundingClientRect();
        setMouseX(function () { return (e.clientX - (rect.left + rect.width / 2)) / 5; });
        setMouseY(function () { return (e.clientY - (rect.top + rect.height / 2)) / 5; });
    };
    var checkTouchCoordinates = function (e) {
        // @ts-ignore
        var rect = containerRef.current.getBoundingClientRect();
        var touchX = e.targetTouches[0].clientX;
        var touchY = e.targetTouches[0].clientY;
        if (touchX > rect.left &&
            touchX < rect.right &&
            touchY < rect.bottom &&
            touchY > rect.top) {
            return true;
        }
        return false;
    };
    var next = function () {
        setItems(function (items) {
            if (lessSpeed == 0)
                return items;
            var a, b;
            if (!keepRollingAfterMouseOut && !active && !firstRender) {
                setLessSpeed(function (lessSpeedCurrent) {
                    var lessConstant = lessSpeed * (maxSpeed / 200);
                    return lessSpeedCurrent - lessConstant > 0.01
                        ? lessSpeedCurrent - lessConstant
                        : 0;
                });
                a = -(Math.min(Math.max(-mouseY, -size), size) / radius) * lessSpeed;
                b = (Math.min(Math.max(-mouseX, -size), size) / radius) * lessSpeed;
                /*setMouseX(
                                                                                                                      Math.abs(mouseX - mouseX0) < 1 ? mouseX0 : (mouseX + mouseX0) / 2,
                                                                                                                    );
                                                                                                                    setMouseY(
                                                                                                                      Math.abs(mouseY - mouseY0) < 1 ? mouseY0 : (mouseY + mouseY0) / 2,
                                                                                                                    );*/
            }
            else if (!active && !firstRender && keepRollingAfterMouseOut) {
                a =
                    -(Math.min(Math.max(-mouseY, -size), size) / radius) *
                        (maxSpeed * 0.5);
                b =
                    (Math.min(Math.max(-mouseX, -size), size) / radius) *
                        (maxSpeed * 0.5);
            }
            else {
                a = -(Math.min(Math.max(-mouseY, -size), size) / radius) * maxSpeed;
                b = (Math.min(Math.max(-mouseX, -size), size) / radius) * maxSpeed;
            }
            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01)
                return items; // pause
            // calculate offset
            var l = Math.PI / 180;
            var sc = [
                Math.sin(a * l),
                Math.cos(a * l),
                Math.sin(b * l),
                Math.cos(b * l),
            ];
            return items.map(function (item) {
                return updateItemPosition(item, sc, depth, userSelect, blur, blurMultiplier, grayscale);
            });
        });
    };
    var init = function () {
        setActive(false);
        var mouseX0 = initialSpeed * Math.sin(initialDirection * (Math.PI / 180));
        var mouseY0 = -initialSpeed * Math.cos(initialDirection * (Math.PI / 180));
        setMouseX(function () { return mouseX0; });
        setMouseY(function () { return mouseY0; });
        next();
    };
    useEffect(function () {
        init();
        setItems(function (items) { return __spreadArray([], items, true); });
    }, []);
    useEffect(function () {
        var animationFrame = requestAnimationFrame(next);
        return function () { return cancelAnimationFrame(animationFrame); };
    }, [mouseX, mouseY, lessSpeed, active, items, props.radius]);
    return (React.createElement("div", { className: props.className, ref: containerRef, onMouseOver: function () {
            setActive(function () { return true; });
            setFirstRender(function () { return false; });
            setLessSpeed(function () { return maxSpeed; });
        }, onMouseOut: function () {
            setActive(function () { return false; });
        }, onMouseMove: handleMouseMove, onTouchStart: function () {
            setActive(true);
            setLessSpeed(function () { return maxSpeed; });
            setFirstRender(function () { return false; });
        }, onTouchMove: function (e) {
            if (checkTouchCoordinates(e)) {
                handleMouseMove(e.targetTouches[0]);
            }
            else {
                setActive(false);
            }
        }, style: __assign(__assign({}, defaultStyles.getContainer(radius, fullWidth, fullHeight)), style) }, items.map(function (item) { return item.el; })));
};
