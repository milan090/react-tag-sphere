import React from "react";
import {
  createRef,
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type TagSphereProps = {
  /** Can be list of strings, html elements or react components */
  tags: (string | ReactNode)[];
  /** @default texts.length * 15 */
  radius?: number;
  /**@default 7 */
  maxSpeed: number;
  /** @default 32 */
  initialSpeed: number;
  /** In degrees
   * @default 135
   */
  initialDirection: 135;
  /** @default true */
  keepRollingAfterMouseOut: boolean;
  className?: string;
  style?: CSSProperties;
  fullWidth: boolean;
  fullHeight: boolean;

  /** Make the items highlightable with selection
   * @default false
   */
  userSelect: boolean;

  /** @default true */
  blur: boolean;

  /**
   * Value between 0 and 1
   * @default 1 */
  blurMultiplier: number;

  /** @default true */
  grayscale: boolean;
};

const defaultStyles = {
  getContainer: (radius: number, fullWidth: boolean, fullHeight: boolean) =>
    ({
      position: "relative",
      width: fullWidth ? "100%" : `${2 * radius}px`,
      maxWidth: "100%",
      minHeight: `${2 * radius}px`,
      height: fullHeight ? "100%" : `${2 * radius}px`,
      touchAction: "none",
    } as CSSProperties),
};

const computeInitialPosition = (
  index: number,
  textsLength: number,
  size: number
) => {
  const phi = Math.acos(-1 + (2 * index + 1) / textsLength);
  const theta = Math.sqrt((textsLength + 1) * Math.PI) * phi;
  return {
    x: (size * Math.cos(theta) * Math.sin(phi)) / 2,
    y: (size * Math.sin(theta) * Math.sin(phi)) / 2,
    z: (size * Math.cos(phi)) / 2,
  };
};

const updateItemPosition = (
  item: any,
  sc: number[],
  depth: number,
  userSelect: boolean,
  blur: boolean,
  blurMultiplier: number,
  grayscale: boolean
) => {
  if (blurMultiplier > 1 || blurMultiplier < 0)
    throw new Error("blurMultiplier should have value between 0 and 1");

  const newItem = { ...item, scale: "" };
  const rx1 = item.x;
  const ry1 = item.y * sc[1] + item.z * -sc[0];
  const rz1 = item.y * sc[0] + item.z * sc[1];

  const rx2 = rx1 * sc[3] + rz1 * sc[2];
  const ry2 = ry1;
  const rz2 = rz1 * sc[3] - rx1 * sc[2];

  const per = (2 * depth) / (2 * depth + rz2); // todo
  newItem.x = rx2;
  newItem.y = ry2;
  newItem.z = rz2;

  if (newItem.x === item.x && newItem.y === item.y && newItem.z === item.z) {
    return item;
  }

  newItem.scale = per.toFixed(3);
  let alpha: number = per * per - 0.25;
  alpha = parseFloat((alpha > 1 ? 1 : alpha).toFixed(3));

  const itemEl = newItem.ref.current as HTMLElement;

  const left = (newItem.x - itemEl.offsetWidth / 2).toFixed(2);

  const top = (newItem.y - itemEl.offsetHeight / 2).toFixed(2);
  const transform = `translate3d(${left}px, ${top}px, 0) scale(${newItem.scale})`;

  // @ts-ignore
  itemEl.style.WebkitTransform = transform;
  // @ts-ignore
  itemEl.style.MozTransform = transform;
  // @ts-ignore
  itemEl.style.OTransform = transform;

  itemEl.style.transform = transform;

  let filter = "";
  if (grayscale) {
    filter += `grayscale(${(alpha - 1) * -8}) `;
  }
  if (blur) {
    filter += `blur(${
      (alpha - 1) * -5 > 1 ? Math.floor((alpha - 1) * -8) * blurMultiplier : 0
    }px)`;
  }
  itemEl.style.filter = filter;
  itemEl.style.zIndex = Math.floor(alpha * 1000) + "";

  itemEl.style.opacity = alpha + "";

  if (!userSelect) itemEl.style.userSelect = "none";

  return newItem;
};

const createItem = (
  text: string | ReactNode,
  index: number,
  textsLength: number,
  size: number,
  itemRef: any
) => {
  const transformOrigin = "50% 50%";
  const transform = "translate3d(-50%, -50%, 0) scale(1)";
  const itemStyles = {
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
  } as CSSProperties;
  // @ts-ignore
  const itemEl = (
    <span ref={itemRef} key={index} style={itemStyles}>
      {text}
    </span>
  );

  return {
    ref: itemRef,
    el: itemEl,
    ...computeInitialPosition(index, textsLength, size),
  };
};

const defaultState: TagSphereProps = {
  tags: [
    "This",
    "is",
    "TagSphere.",
    "Do",
    "you",
    "like",
    <img
      width={50}
      src={"https://cdn.svgporn.com/logos/react.svg"}
      alt={"Random image"}
    />,
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

export const TagSphere: React.FC<Partial<TagSphereProps>> = (props) => {
  // props.style = defaultState.style
  const {
    maxSpeed,
    initialSpeed,
    tags,
    initialDirection,
    keepRollingAfterMouseOut,
    fullHeight,
    fullWidth,
    style,

    userSelect,
    blur,
    blurMultiplier,
    grayscale,
  }: TagSphereProps = { ...defaultState, ...props };

  const radius = props.radius || tags.length * 15;

  const depth = 2 * radius;
  const size = 1.5 * radius;
  const itemHooks = tags.map(() => createRef());
  const [items, setItems]: [any[], any] = useState([]);

  useEffect(() => {
    setItems(() =>
      tags.map((text, index) =>
        createItem(text, index, tags.length, size, itemHooks[index])
      )
    );
  }, [tags]);

  const containerRef = useRef(null);
  const [firstRender, setFirstRender] = useState(true);
  const [lessSpeed, setLessSpeed] = useState(maxSpeed);
  const [active, setActive] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: any) => {
    // @ts-ignore
    const rect = containerRef.current.getBoundingClientRect();

    setMouseX(() => (e.clientX - (rect.left + rect.width / 2)) / 5);
    setMouseY(() => (e.clientY - (rect.top + rect.height / 2)) / 5);
  };

  const checkTouchCoordinates = (e: any) => {
    // @ts-ignore
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;

    if (
      touchX > rect.left &&
      touchX < rect.right &&
      touchY < rect.bottom &&
      touchY > rect.top
    ) {
      return true;
    }

    return false;
  };

  const next = () => {
    setItems((items: any) => {
      if (lessSpeed == 0) return items;

      let a, b;
      if (!keepRollingAfterMouseOut && !active && !firstRender) {
        setLessSpeed((lessSpeedCurrent) => {
          const lessConstant = lessSpeed * (maxSpeed / 200);

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
      } else if (!active && !firstRender && keepRollingAfterMouseOut) {
        a =
          -(Math.min(Math.max(-mouseY, -size), size) / radius) *
          (maxSpeed * 0.5);
        b =
          (Math.min(Math.max(-mouseX, -size), size) / radius) *
          (maxSpeed * 0.5);
      } else {
        a = -(Math.min(Math.max(-mouseY, -size), size) / radius) * maxSpeed;
        b = (Math.min(Math.max(-mouseX, -size), size) / radius) * maxSpeed;
      }

      if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) return items; // pause

      // calculate offset
      const l = Math.PI / 180;
      const sc = [
        Math.sin(a * l),
        Math.cos(a * l),
        Math.sin(b * l),
        Math.cos(b * l),
      ];

      return items.map((item: any) =>
        updateItemPosition(
          item,
          sc,
          depth,
          userSelect,
          blur,
          blurMultiplier,
          grayscale
        )
      );
    });
  };

  const init = () => {
    setActive(false);
    const mouseX0 = initialSpeed * Math.sin(initialDirection * (Math.PI / 180));
    const mouseY0 =
      -initialSpeed * Math.cos(initialDirection * (Math.PI / 180));

    setMouseX(() => mouseX0);
    setMouseY(() => mouseY0);

    next();
  };

  useEffect(() => {
    init();
    setItems((items: any) => [...items]);
  }, []);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(next);
    return () => cancelAnimationFrame(animationFrame);
  }, [mouseX, mouseY, lessSpeed, active, items, props.radius]);

  return (
    <div
      className={props.className}
      ref={containerRef}
      onMouseOver={() => {
        setActive(() => true);
        setFirstRender(() => false);
        setLessSpeed(() => maxSpeed);
      }}
      onMouseOut={() => {
        setActive(() => false);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => {
        setActive(true);
        setLessSpeed(() => maxSpeed);
        setFirstRender(() => false);
      }}
      onTouchMove={(e) => {
        if (checkTouchCoordinates(e)) {
          handleMouseMove(e.targetTouches[0]);
        } else {
          setActive(false);
        }
      }}
      style={{
        ...defaultStyles.getContainer(radius, fullWidth, fullHeight),
        ...style,
      }}
    >
      {items.map((item) => item.el)}
    </div>
  );
};
