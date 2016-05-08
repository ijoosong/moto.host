var React = require('react');
var FileInput = require('react-file-input');

var App = React.createClass({
  render: function () {
    return <div className="container">
      <h1>moto.host</h1>
      <h3>Your Moble Tour Host</h3>
      <div className="filePicker">
        <form>
        Click here to take/select a photo!
        <FileInput name="myImage"
                   accept=".png,.jpg,.gif"
                   placeholder="My Image"
                   className="inputClass"
                   onChange={this.handleChange} />
        </form>
      </div>
    </div>
  },

  handleChange: function(event) {
    console.log('Selected file:', event.target.files[0]);
  }
})
React.render(<App />, document.querySelector('#content'))
