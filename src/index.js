import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { noop, packRefs, setDirectionStyle, reversalNumber, getStyle, parseMatrix, getStep } from "./utils";
import { HORIZONTAL, VERTICAL } from "./constants";

class RowBoat extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    defaultIndex: PropTypes.number,
    direction: PropTypes.string,
    setDirectionStyle: PropTypes.func,
    length: PropTypes.number,
    speed: PropTypes.number,
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    delay: PropTypes.number,
    drag: PropTypes.bool,
  };
  static defaultProps = {
    children: noop,
    defaultIndex: 1,
    direction: HORIZONTAL,
    speed: 300,
    delay: 3000
  };

  constructor(props) {
    super(props);
    const { defaultIndex: index } = props;
    this.state = {
      index,
      containerRect: {
        width: 0,
        height: 0
      },
      wrapperStyle: {}, // 包装元素style
    };
    this.mouse = {
      clientXOrigin: 0,
      clientYOrigin: 0,
      diffX: 0, // 拖动后的距离
      diffY: 0, // 拖动后的距离
    };
    this.wrapper = {
      x: 0,
      y: 0,
      'transition-duration': ''
    };
  }
  componentDidMount() {
    const { autoplay, drag } = this.props;
    this.setRect();
    autoplay && this.setAutoPlay(true);
    window.addEventListener("resize", this._resize);
    if (drag) {
      window.addEventListener('mouseup', this._windowMouseUp);
      this._containerNode.addEventListener('mousedown', this._containerMouseDown);
      window.addEventListener('mousemove', this._windowMouseMove);
    }
  }
  componentDidUpdate(prevProps) {
    const { autoplay } = this.props;
    if (prevProps.autoplay !== autoplay) {
      autoplay && !this.timer
        ? this.setAutoPlay(true)
        : this.setAutoPlay(false);
    }
  }
  _containerMouseDown = e => {
    const { wrapperStyle } = this.state;
    const matrix = parseMatrix(getStyle(this._wrapperNode, 'transform')) || [0,0,0,0,0,0];
    const [,,,,x, y] = matrix;
    this.wrapper.x = +x;
    this.wrapper.y = +y;
    this.mouseDown = true;
    this.mouse.clientXOrigin = e.clientX;
    this.mouse.clientYOrigin = e.clientY;

    this.setState({
      wrapperStyle: {
        ...wrapperStyle,
        transitionDuration: '0ms',
      }
    });
  }
  _windowMouseMove = e => {
    if (!this.mouseDown) return;
    const { direction } = this.props;
    const { wrapperStyle } = this.state;
    const { x, y } = this.wrapper;
    const { clientXOrigin, clientYOrigin } = this.mouse;
    const { clientX, clientY } = e;
    const diffX = reversalNumber(clientXOrigin - clientX);
    const diffY = reversalNumber(clientYOrigin - clientY);

    this.mouse.diffX = diffX;
    this.mouse.diffY = diffY;

    const translate = direction === HORIZONTAL ? `translate3d(${x + diffX}px, 0px, 0px)` : `translate3d(0px, ${y + diffY}px, 0px)`;
    this.setState({
      wrapperStyle: {
        ...wrapperStyle,
        transform: translate,
      }
    })
  }
  _windowMouseUp = e => {
    if (!this.mouseDown) return;
    const { direction } = this.props;
    const { index, wrapperStyle } = this.state;
    const { diffX, diffY } = this.mouse;
    const { width, height } = this.state.containerRect;
    const stepX = getStep(diffX, width);
    const stepY = getStep(diffY, height);
    this.mouseDown = false;

    if (!diffX && direction === HORIZONTAL) return;
    if (!diffY && direction === VERTICAL) return;
    const step = direction === HORIZONTAL ? stepX : stepY;
    const diff = direction === HORIZONTAL ? diffX : diffY;
    this.setState({
      wrapperStyle: {
        ...wrapperStyle,
        transitionDuration: `${this.props.speed}ms`,
      }
    }, () => {
      this.setIndex(diff >= 0 ? index - step : index + step);
    });
    this.mouse.diffX = 0;
    this.mouse.diffY = 0;
  }
  _resize = () => {
    this.setRect();
  };
  setRect = () => {
    const { width, height } = this._containerNode.getBoundingClientRect();
    this.setState({
      containerRect: {
        width,
        height
      }
    });
  };
  setAutoPlay = isSet => {
    const { delay } = this.props;
    if (isSet) {
      this.timer = setInterval(() => {
        const { index } = this.state;
        const { loop, length } = this.props;
        if (!loop && index === length) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.setIndex(index + 1);
      }, delay);
    } else {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
  getContainerNode = node => {
    this._containerNode = node;
  };
  getWrapperNode = node => {
    this._wrapperNode = node;
  };
  getStateAndMethod() {
    const { index } = this.state;
    const { getWrapperProps, getContainerProps, getItemProps, setIndex } = this;

    return {
      index,
      getWrapperProps,
      getContainerProps,
      getItemProps,
      setIndex
    };
  }
  // 获取容器元素的属性
  getContainerProps = ({ refKey = "ref", ref, style, ...rest } = {}) => {
    return {
      [refKey]: packRefs(ref, this.getContainerNode),
      style: {
        overflow: "hidden",
        width: "100%",
        height: "100%",
        position: "relative",
        ...style
      },
      ...rest
    };
  };
  // 获取包装元素的属性
  getWrapperProps = ({ refKey = "ref", ref, style, ...rest } = {}) => {
    const { wrapperStyle } = this.state;

    return {
      [refKey]: packRefs(ref, this.getWrapperNode),
      style: {
        ...wrapperStyle,
        display: "flex",
        width: "100%",
        height: "100%",
        transitionProperty: "transform",
        boxSizing: "content-box",
        ...style
      },
      ...rest
    };
  };
  getItemProps = () => {
    return {
      style: {
        display: "flex",
        flexShrink: 0,
        width: "100%",
        height: "100%"
      }
    };
  };
  setIndex = index => {
    const { containerRect } = this.state;
    const { length, loop, speed, direction, drag } = this.props;
    const setStyle = this.props.setDirectionStyle || setDirectionStyle;

    if (drag && index > length) index = length;
    if (drag && index < 1) index = 1;
    if (loop && !drag && index > length) index = 1;
    if (loop && !drag && index < 1) index = length;

    const wrapperStyle = setStyle(index, direction, speed, containerRect);
    this.setState({
      index,
      wrapperStyle
    });
  };
  render() {
    const { children } = this.props;
    const element = children(this.getStateAndMethod());

    if (!element) return null;
    return cloneElement(element);
  }
}

export { HORIZONTAL, VERTICAL };
export default RowBoat;
