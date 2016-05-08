var React = require('react');

var Info = React.createClass({
  getInitialState: function() {
    return {info: ''};
  },
  getInfo: function() {
    if (this.props.dataset === 'buildings') {
    } else if (this.props.dataset === 'landmarks') {
    } else if (this.props.dataset === 'parks') {
    } else {
      this.setState({info: 'We do not have information on that '+this.props.dataset+', but try something else!'});
    }
  },
  render: function() {
    return <div className="information">
      {this.state.info}
    </div>
  }
});
module.exports = Info;
