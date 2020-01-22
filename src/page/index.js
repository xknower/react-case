import React from "react";
import ReactDOM from "react-dom";

class Index extends React.Component {
  constructor(props) {
    document.title = "主页";
    super(props);
  }

  render() {
    return (
      <div className="index">
        <h2>HELLO WORLD</h2>
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.querySelector("#init"));
