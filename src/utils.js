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
    style.transform = `translate3d(${-x}px, 0px, 0)`;
    style.flexDirection = "row";
  } else if (direction === VERTICAL) {
    const y = (index - 1) * height;
    style.transform = `translate3d(0px, ${-y}px, 0)`;
    style.flexDirection = "column";
  }
  return style;
};

export { noop, packRefs, setDirectionStyle };
