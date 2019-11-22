import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { noop, packRefs, setDirectionStyle } from "./utils";
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
    delay: PropTypes.number
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
      }
    };
  }
  componentDidMount() {
    const { autoplay } = this.props;
    this.setRect();
    autoplay && this.setAutoPlay(true);
    window.addEventListener("resize", this._resize);
  }
  componentDidUpdate(prevProps) {
    const { autoplay } = this.props;
    if (prevProps.autoplay !== autoplay) {
      autoplay && !this.timer
        ? this.setAutoPlay(true)
        : this.setAutoPlay(false);
    }
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
  getWrapperProps = ({ style, ...rest } = {}) => {
    const { index, containerRect } = this.state;
    const { speed, direction } = this.props;
    const setStyle = this.props.setDirectionStyle || setDirectionStyle;
    return {
      style: {
        ...setStyle(index, direction, speed, containerRect),
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
    const { index: currentIndex } = this.state;
    const { length, loop } = this.props;
    if ((currentIndex === index || index < 1 || index > length) && !loop)
      return;
    if (loop && index > length) {
      return this.setState({
        index: 1
      });
    }
    if (loop && index < 1) {
      return this.setState({
        index: length
      });
    }
    this.setState({
      index
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
