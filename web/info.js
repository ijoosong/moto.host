var React = require('react');
var axios = require('axios');
var watson = require('./node_modules/watson-developer-cloud');
var fs = require('fs');

var Info = React.createClass({
  getInitialState: function() {
    return {info: ''};
  },
  getInfo: function() {
    if (this.props.dataset === 'buildings') {
      axios.get('http://224ca466.ngrok.io/api/landmarks/-73.985+40.748')
        .then(function(resp){
          console.log(resp.excerpt);
          setState({info: resp.excerpt});
        });
    } else if (this.props.dataset === 'landmarks') {
    } else if (this.props.dataset === 'parks') {
    } else {
      this.setState({info: 'We do not have information on that '+this.props.dataset+', but try something else!'});
    }
  },
  textToSpeech: function(words) {
    var text_to_speech = watson.text_to_speech({
      username: 'c4effe4-5d59-4f85-a9c9-d4f19e3149ef',
      password: 'RvWTq4kxWmRY',
      version: 'v1'
    });

    var params = {
      text: words,
      voice: 'en-US_AllisonVoice',
      accept: 'audio/wav'
    };

    // Pipe the synthesized text to a file
    // TODO: get this somewhere for the headphones
    text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav'));
  },

  render: function() {
    return <div className="information">
      {this.state.info}
    </div>
  }
});
module.exports = Info;
