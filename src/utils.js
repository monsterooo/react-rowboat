import { HORIZONTAL, VERTICAL } from "./constants";

const noop = () => {};
const packRefs = (...refs) => node =>
  refs.forEach(ref => {
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  });
const setDirectionStyle = (index, direction, speed, containerRect) => {
  const { width, height } = containerRect;
  const style = {
    transitionDuration: `${speed}ms`
  };
  if (direction === HORIZONTAL) {
    const x = index ? (index - 1) * width : 0;
    style.transform = `translate3d(${-x}px, 0px, 0px)`;
    style.flexDirection = "row";
  } else if (direction === VERTICAL) {
    const y = (index - 1) * height;
    style.transform = `translate3d(0px, ${-y}px, 0px)`;
    style.flexDirection = "column";
  }
  return style;
};

// 翻转移动的数量单位，让它适合translate
const reversalNumber = number => number > 0 ? -number : Math.abs(number);

const getStyle = (node, attr) => window.getComputedStyle(node)[attr];

// matrix.length => y坐标    matrix.length - 1 => x坐标
const parseMatrix = value => value.match(/-?\d+\.?\d*/g)

// 如果移动超过容器一半那么就算作移动一步
const getStep = (value, width) => Math.floor(Math.abs(value) / (width / 2));

export { noop, packRefs, setDirectionStyle, reversalNumber, getStyle, parseMatrix, getStep };
