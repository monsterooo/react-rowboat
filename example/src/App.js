import React from "react";
import RowBoat from "react-rowboat";

import "./index.css";

const items = [
  'Hello, World',
  'https://coderlane.net',
  '创造最完美的在线实时结对编程环境'
];
function App() {
  return (
    <div className="App">
      <div style={{ height: 300 }}>
        <RowBoat loop length={items.length}>
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
                <div className="nav">
                  {items.map((v, vIndex) => (
                    <div
                      key={vIndex}
                      onClick={() => setIndex(vIndex + 1)}
                      className={`dot ${vIndex + 1 === index ? "active" : ""}`}
                    />
                  ))}
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
                        {v}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </RowBoat>
      </div>
    </div>
  );
}

export default App;
