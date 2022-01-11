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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const snap = async () => {
    if (cam){
      console.log(cam);
      let photo = await cam.takePictureAsync()
      props.navigation.navigate("Preview" , { pic_url : photo.uri , height : 500 , width : ScreenWidth  })
    }
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} 
        flashMode = {flash}
        //pictureSize = { ()=> {let size = cam.getAvailablePictureSizesAsync("4:3") ; return size[2]}  }
        ref = { ref => {
          setcam(ref)
        } }
      >
          <View>

          </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
          <FAB
            style = {{ backgroundColor : "transparent" }}
            icon = "refresh"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}/>

          </TouchableOpacity>
          <TouchableOpacity
            style = { styles.snap }
            onPress = {() =>{setsnap_icon("check"); snap();     
           }   } 
          >
            <FAB
              style  = {{ backgroundColor : props.state.theme.icons_surrounding }}
              icon  = {snap_icon}
              color = {props.state.theme.icons}
            />

          </TouchableOpacity>
          <TouchableOpacity>
          <FAB
              style  = {{ backgroundColor : "transparent" }}
              icon  = 'flash'
              color = {props.state.theme.icons}
              small 
              onPress = { ()=> flash === Camera.Constants.FlashMode.off ? setflash(Camera.Constants.FlashMode.on) : setflash(Camera.Constants.FlashMode.off)  }
            />
          </TouchableOpacity>    
        </View>
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
    },
    buttonContainer : {
      
        width : ScreenWidth,
        maxWidth : ScreenWidth,
        height : 90,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',

    
    },
    text : {
        color : "red",
    },
    snap : {
      width : 70,
      height : 70 ,
      borderRadius : 35,
      backgroundColor : 'white',
      justifyContent : 'center',
      alignItems : 'center',
    }

 }); 