'use strict';
import React from 'react';
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

class moto extends Component {

  onPhotoCapture(imageBytes) {
    var accessToken = 'get it';
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

  takePicture() {
    console.log("Hello");
    this.camera.capture()
      .then((data) => {
        this.onPhotoCapture(data).bind(this);
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
