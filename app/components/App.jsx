import React, { Component } from 'react';

export default class App extends Component {
  constructor() {
    super();
    this.state={ bla: "123" };
  }

 componentDidMount(){
   var array = [{ sdf:"123", n: "1" }, {sdf: "12321", n: "2"}];
   var item = array.find(x=>x.sdf == this.state.bla);
   
   $('.ui.dropdown').dropdown();
 }

render () {
    return (
      <div>
      <div className="hello">
        <span>aaaaa bbb ddd</span>
      </div>
      <div className="ui dropdown">
          <input type="hidden" name="gender" />
          <i className="dropdown icon"></i>
          <div className="default text">Gender</div>
          <div className="menu">
            <div className="item" data-value="male">Male</div>
            <div className="item" data-value="female">Female</div>
          </div>
        </div>
      </div>
    );
  }
}