var React = require('react');
var FileInput = require('react-file-input');

var App = React.createClass({
  render: function () {
    return <div>
      <h1>clicked {this.state.n} times</h1>
      <button onClick={this.handleClick}>click me!</button>
      <FileInput name="myImage"
                 accept=".png,.jpg,.gif"
                 placeholder="My Image"
                 className="inputClass"
                 onChange={this.handleChange} />
    </div>
  },

  handleChange: function(event) {
    console.log('Selected file:', event.target.files[0]);
  }
})
React.render(<App />, document.querySelector('#content'))
