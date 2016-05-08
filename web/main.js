var React = require('react');
var FileInput = require('react-file-input');
var axios = require('axios');
var config = require('./config');
var Info = require('./info');

var App = React.createClass({
  getInitialState: function() {
    return {dataset: 'unknown', location: 'unknown'};
  },
  handleChange: function(event) {
    console.log('Selected file:', event.target.files[0]);
  },
  onPhotoCapture: function(event) {
    var imageBytes = event.target.files[0];
    var accessToken = 'FSQGpNPD3ifaWTwwCK8OIHFHJuJQVJ';
    var url = 'https://api.clarifai.com/v1/tag';
    //var data = {'encoded_image': imageBytes};
    var data = {'url': 'http://sametomorrow.com/blog/wp-content/uploads/2012/10/empire-state-building-05.jpg'};
    var self = this;
    return axios.post(url, data, {
      'headers': {
        'Authorization': 'Bearer ' + accessToken
      },
      'content-type': 'application/x-www-form-urlencoded'
    })
    .then(function(r) {
      self.determineDataset(r.data.results[0].result.tag.classes);
    },
    function() {
      console.log('Sorry, something is wrong.');
    });
  },
  // not being called
  getClarifaiAccessToken: function() {
    var clientId = config.get('clientId');
    var clientSecret = config.get('clientSecret');
    var data = {
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret
    };
    var url = 'https://api.clarifai.com/v1/token';
    var self = this;
    return axios.post(url, data,{
      'transformRequest': [
        function() {
          return self.transformDataToParams(data);
        }
      ]
    }).then(function(r) {
      console.log(r);
      // this will expire, fix later
      localStorage.setItem('accessToken', r.access_token);
    },
    function(err) {
      console.log(err);
    });
  },
  transformDataToParams: function(data) {
    var str = [];
    for ( var p in data ) {
      if (data.hasOwnProperty(p) && data[p]) {
        if (typeof data[p] === 'string'){
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
        }
        if (typeof data[p] === 'object'){
          for ( var i in data[p] ) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
          }
        }
      }
    }
    return str.join('&');
  },
  determineDataset: function(tags) {
    var dset = '';
    if (tags.indexOf('architecture') !== -1 || tags.indexOf('skyscraper') !== -1 || tags.indexOf('building') !== -1) {
      dset = 'buildings';
    } else if (tags.indexOf('landmark') !== -1) {
      dset = 'landmarks';
    } else if (tags.indexOf('outdoors') !== -1 || tags.indexOf('nature') !== -1) {
      dset = 'parks';
    } else {
      dset = tags[0];
    }
    this.setState({dataset:dset});
  },

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
                   onChange={this.onPhotoCapture} />
        </form>
      </div>
      <Info location={this.state.location} dataset={this.state.dataset} />
    </div>
  }
});

React.render(<App />, document.querySelector('#content'));
