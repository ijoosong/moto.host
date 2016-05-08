'use strict';
import React from 'react';
import axios from 'axios';
import {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image
} from 'react-native';
import Camera from 'react-native-camera';
import watson from 'watson-developer-cloud';
import fs from 'fs';

class moto extends Component {

  onPhotoCapture(imageBytes) {
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
  }

  getClarifaiAccessToken() {
    var clientId = config.get('clientId');
    var clientSecret = config.get('clientSecret');
    var data = {
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret
    };
    var url = 'https://api.clarifai.com/v1/token';
    return axios.post(url, data);
  }

  function parseClarifaiResponse(resp) {
    var tags = [];
    if (resp.status_code === 'OK') {
      var results = resp.results;
      tags = results[0].result.tag.classes;
    } else {
      console.log('Sorry, something is wrong.');
    }
    return tags;
  }

  generateText(arr) {
    var ret = '';
    if (arr.indexOf('landmark') !== -1 && arr.indexOf('building') !== -1) {
      // TODO: get information about landmarks or buildings here.
    } else {
      ret = 'That\'s a lovely ' + arr[0] + ' there, unfortunately we have no information about it beyond that.';
    }

    return ret;
  }

  textToSpeech(words) {
    var text_to_speech = watson.text_to_speech({
      username: 'username',
      password: 'password',
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
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.onPhotoCapture(data);
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Camera ref={cam => this.camera = cam }
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.disk}>
        </Camera>
        <TouchableOpacity
            style={styles.actionButton}
            onPress={this.takePicture.bind(this)}>
            <Image source={require('./img/camera-icon.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  actionButton: {
        position: 'absolute',
        bottom: 25,
        padding: 16,
        right: 20,
        left: 20,
        borderRadius: 20,
        alignItems: 'center',
  }
});

AppRegistry.registerComponent('moto', () => moto);
