import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {Avatar} from 'react-native-elements'
import { Camera } from 'expo-camera';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { FAB } from 'react-native-paper'
import {connect } from 'react-redux';

export function Camera_screen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [snap_icon , setsnap_icon] = useState("camera");
  const [cam , setcam] = useState()
  const [flash , setflash] = useState(Camera.Constants.FlashMode.off)

  let camera;
  const record_video = async () => {
    console.log(camera)
    let video = await camera.recordAsync();
    //console.log(video.uri)
    
  }

  const stop_record_video = async () => {
      if (camera) {
          camera.stopRecording()
      }
  }
 

  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      //const audio_status = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === 'granted' );
      
      props.second_flag_recording? record_video() : stop_record_video()
    })();
    
  }, [props.second_flag_recording]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

 
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.front} 
      o
        flashMode = {flash}
        ref = { ref => {
          camera = ref;
        } }
      >
          
   
      </Camera>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {state}
}

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps,mapDispatchToProps)(Camera_screen)

const styles = StyleSheet.create({ 
    container : {
        flex : 1,
    },
    camera : {
        flex : 1,
        aspectRatio : 0.75,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        height : 180,
        width : 180,
        overflow : 'hidden',
        
    },
    
    

 }); 