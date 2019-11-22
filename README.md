[![NPM](https://img.shields.io/npm/v/react-rowboat.svg)](https://www.npmjs.com/package/react-rowboat) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<h1 align="center">
  react-rowboat🚣
</h1>

<p align="center" style="font-size: 1.4rem;">
  构建原始、简单、可扩展的react slide | carousel组件
</p>

<p align="center">
![react-rowboat](https://user-images.githubusercontent.com/18432680/69444463-5cfe3400-0d8b-11ea-991a-579972d95332.gif)
<p>

## 使用场景

如果您需要在网页中构建slide | carousel组件，并且希望它灵活且简单。您可以尝试使用它

## 实现原理

react-rowboat使用了[React Render Props](https://github.com/monsterooo/blog/issues/17)模式最大程度的减少API，为您自定义组件提供了最大的灵活性。因为所有的组件内容和样式都是您自己负责渲染。

## Install

```bash
npm install --save react-rowboat
```

## Usage

建议保持`getContainerProps`和`getWrapperProps`行div所在的层级关系，因为它们有一些基本的样式依赖，除此之外您可以渲染任意的内容。

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import RowBoat from "react-rowbot";

const items = [
  "img src1",
  "img src2",
  "img src3"
];
ReactDOM.render(
  <RowBoat
    length={items.length}
    loop
  >
    {({
      index,
      setIndex,
      getContainerProps,
      getWrapperProps,
      getItemProps
    }) => {
      return (
        <div className="slide" {...getContainerProps()}>
          <div className="prev" onClick={() => setIndex(index - 1)}>
            prev
          </div>
          <div className="next" onClick={() => setIndex(index + 1)}>
            next
          </div>
          <div {...getWrapperProps()}>
            {items.map((v, vIndex) => {
              return (
                <div
                  key={vIndex}
                  className={`slide-item ${
                    index - 1 === vIndex ? "actives" : ""
                  }`}
                  {...getItemProps()}
                >
                  <img src={v} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      );
    }}
  </RowBoat>,
  document.getElementById("root")
)
```

## 基础属性

下面列举出了所有`RowBoat`组件所能使用的属性

### children

> `function({})` | _required_

接收一个函数类型，它应该返回您所需要的组件。

### length

> `number` | _required_

`length`用于边界判断，一般使用`items.length`的属性即可

### defaultIndex

> `number/null` | 默认为`1`

用于设置默认的`index`索引

### speed

> `number/null` | 默认为`300`, 单位为`ms`

用于控制播放的时间间隔，单位为`ms`

### loop

> `bool/null` | 默认为`false`

用于设置当`index`到达末尾时是否重新设置为`1`

### direction

> `string/null` | 默认为`horizontal`

有两种模式可以选择，您可以通过下面的方式引入
```jsx
import RowBoat, { HORIZONTAL, VERTICAL } from "rect-rowboat";
```

`HORIZONTAL`为水平动画模式，`VERTICAL`为垂直动画模式

### autoplay

> `bool/null` | 默认为`false`

如果传递此属性，`react-rowboat`将会自动播放

### delay

> `number/null` | 默认为`3000`，单位为`ms`

用于控制自动播放的时间间隔，单位为`ms`


## Children Function

您可以像下面这样去使用Render Props， 一般情况请使用下面的结构

```jsx
<RowBoat
  length={items.length}
>
  {({
    index,
    setIndex,
    getContainerProps,
    getWrapperProps,
    getItemProps
  }) => {
    return (
      <div {...getContainerProps()}>
        <div {...getWrapperProps()}>
          {items.map((v, vIndex) => <div>{/* 你的jsx组件代码 */}</div>)}
        </div>
      </div>
    );
  }}
</RowBoat>
```

在这里对[React Render Props](https://github.com/monsterooo/blog/issues/17)模式所能使用的参数进行说明

| 属性                    | 类型         | 描述                       |
|------------------------|-------------|----------------------------|
| `index`                | `number`    | 当前正在显示中的索引          |
| `setIndex`             | `func`      | 设置`index`的值             |
| `getContainerProps`    | `func`      | 返回容器元素必须的属性        |
| `getWrapperProps`      | `func`      | 返回包装元素必须的属性        |
| `getItemProps`         | `func`      | 返回项目元素必须的属性        |

## License

MIT © [https://github.com/monsterooo](https://github.com/https://github.com/monsterooo)
