var React = require('react');
var FileInput = require('react-file-input');

var App = React.createClass({
  handleChange: function(event) {
    console.log('Selected file:', event.target.files[0]);
  },
  onPhotoCapture: function(imageBytes) {
    var accessToken = this.getClarifaiAccessToken();
    var url = 'https://api.clarifai.com/v1/tag';
    var data = {'encoded_image': imageBytes};
    return axios.post(url, data, {
      'headers': {
        'Authorization': 'Bearer ' + accessToken
      },
      'content-type': 'application/x-www-form-urlencoded'
    })
    .then(function(r){
      console.log(r);
    },
    function(){
      console.log('Sorry, something is wrong.');
    });
    /*
    .then((response) => response.json())
    .then((responseData) => {
      console.log(
        'Response Body -> ' + JSON.stringify(responseData.body)
      );
    })
    .done();*/
  },
  getClarifaiAccessToken: function() {
    var clientId = config.get('clientId');
    var clientSecret = config.get('clientSecret');
    var data = {
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret
    };
    var url = 'https://api.clarifai.com/v1/token';
    return axios.post(url, data);
  },

  parseClarifaiResponse: function(resp) {
    var tags = [];
    if (resp.status_code === 'OK') {
      var results = resp.results;
      tags = results[0].result.tag.classes;
    } else {
      console.log('Sorry, something is wrong.');
    }
    return tags;
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
                   onChange={this.handleChange} />
        </form>
      </div>
    </div>
  }
})
React.render(<App />, document.querySelector('#content'))
