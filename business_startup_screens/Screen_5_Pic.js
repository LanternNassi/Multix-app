import React , {useState} from 'react'
import { View , StyleSheet , Text , TouchableOpacity,ScrollView, Modal } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


export function Screen_5_Pic(props) {
    const [Chosen_image , setChosen_image] = useState(null)
    const [Action , setAction] = useState(false)
    return (
        <ScrollView style = {styles.container}>
            
            <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center' , width : ScreenWidth *0.9  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: props.fun.Layout_Settings.Icons_surroundings , elevation : 10 }} icon = {{ name : 'user-plus' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 5 OF 6</Text>
                <Text style = {{...styles.disclaimer , fontSize : 13 , fontWeight : '500' ,}}>Please endeavour to use a professional looking profile picture to get the best out of the market out there</Text>
            </View>
            <TouchableOpacity style = {styles.input_container} onPress = {
                async ()=>{
                    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                    setChosen_image(result.uri)
                                    setTimeout(()=>{
                                        setAction(true)
                                    } , 100)
                                }
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  console.log("No permissions")
                              }
                }
            } >
                { Action ? ( 
                    <Avatar rounded source = {{ uri : Chosen_image }} size = {'xlarge'}  />

                 ) : (
                    <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'user' , type : 'font-awesome' }} size = {'xlarge'}  />
                  ) }
                
                <TouchableOpacity style = {{ position : 'absolute' , top : ScreenHeight * 0.31, right : ScreenWidth *0.3 }} onPress = {
                    async () => {
                        let image = await ImagePicker.launchCameraAsync({mediaTypes : ImagePicker.MediaTypeOptions.Images , allowsEditing : true , aspect : [4,3] , quality : 0.8 , base64 : true})
                        if (image.uri){
                            setChosen_image(image.uri)
                            setTimeout(()=>{
                                setAction(true)
                            } , 100)
                        } else {
                            console.log("No image")
                        }
                    }
                } >
                <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings , elevation : 10 ,  }} icon = {{  name : 'camera' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} size = {'medium'} />
                </TouchableOpacity>
  </TouchableOpacity>
  <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        <TouchableOpacity onPress = {
            () => {
                Chosen_image ? (props.send_info_pic(Chosen_image)) : ('')
                props.state.navigation.navigation.navigate('Certifications And Preferences')
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>

        </ScrollView>
    )
}
let mapStateToProps = (redux_state) => {
    let state = redux_state.business
    let fun = redux_state.fun
    return {state,fun}
}

let mapDispatchToProps = (dispatch) => ({
    send_info_pic : (Pic) =>  dispatch({type : 'Pic' , pic : Pic})
})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_5_Pic)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        //justifyContent : 'center',
        //alignItems : 'center',
        flex : 1,
        
    },
    disclaimer : {
        color : 'black',
        fontSize : 20,
        fontWeight : '700',
    },
    input_container : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : ScreenHeight * 0.5,
        width : ScreenWidth ,
        

    }

})
