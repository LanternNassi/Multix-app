import React , {useState , useEffect} from 'react'
import { View , StyleSheet , Text , TouchableOpacity , DatePickerAndroid , TextInput , ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as mime from 'react-native-mime-types'







export const Show_case = (props) => {
    const [ Type , setType ] = useState('')
    const [Dead_date , setDead_date] = useState('')
    const [Action_1 , setAction_1] = useState(false)
    const [Action_2 , setAction_2] = useState(false)
    const [Action_3 , setAction_3] = useState(false)
    const [Action_4 , setAction_4] = useState(false)
    const [Chosen_image_1 , setChosen_image_1] = useState('')
    const [Chosen_image_2 , setChosen_image_2] = useState('')
    const [Chosen_image_3 , setChosen_image_3] = useState('')
    const [Chosen_image_4 , setChosen_image_4] = useState('')
    const [pressed , setpressed] = useState(false)


    const pick_Dead_date = async () => {
        try{
            const {action , year , month , day} = await DatePickerAndroid.open({ 
                date : new Date(),
                mode : 'default',
             })

             if (action !== DatePickerAndroid.dismissedAction){
                 setDead_date(year + "-" + month + "-" + day)
             }
    
        } catch ({code , message}){
            console.warn("Cannot open date picker",message)
    
        }
    }
    useEffect(()=>{
        const {type} = props.route.params
        setType(type)
    } , [])

    return (
        <ScrollView style = {styles.container}>
        <View style = {{ top : 20 , alignItems : 'center' , height : ScreenHeight * 0.9  }}>   
        <View style = {{ width : 0.9 * ScreenWidth, justifyContent : 'space-between' , alignItems : 'center', height : 0.14 * ScreenHeight  }}>
                <Avatar rounded icon = {{ name : 'check' , size : 18 , type : 'font-awesome' }} containerStyle = {{
                    backgroundColor : 'green'
                }} />
                <Text style = {styles.disclaimer}>Please take a step to make your gig a stand out by carefully filling the steps</Text>
            </View>
        <View style = {styles.input_container} >
                { Type === 'Hiring' ? (
                     <Sae
                     onFocus = {
                         async () =>{
                             await pick_Dead_date()
                         }
                     }
                     style = {{ width : ScreenWidth-10 , backgroundColor : 'white'}}
                     label={'Expected date of completion '}
                     iconClass={FontAwesomeIcon}
                     iconName={'pencil'}
                     iconColor={'black'}
                     inputPadding={16}
                     labelHeight={24}
                     value = {Dead_date}
                     // active border height
                     borderHeight={2}
                     // TextInput props
                     autoCapitalize={'none'}
                     autoCorrect={true}
                     inputStyle = {{ color : 'black',fontSize : 15, }}
                     keyboardType = {'numeric'}
                    onChangeText = {
                        (text) => {
                            setDead_date(text)
                        }
                    }
                 />
                ) : (<View/>) }
       
        <View style = {styles.Portfolio}>
            <Text style = {{
                fontWeight : 'bold',
                paddingBottom : 15,
            }}> Pick Some interesting Pictures to show around </Text>
            <ScrollView horizontal = {true}
                showsHorizontalScrollIndicator = {false}
                contentContainerStyle = {{
                    width : 1.9 * ScreenWidth,
                    justifyContent : 'space-around'
                }}
                style = {{
                    width : ScreenWidth,
                    height : 0.25 * ScreenHeight,
                }}
            >
                 { Action_1 ? ( 
                     <View>
                    <TouchableOpacity onPress = {
                        async () => {
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
                                        setChosen_image_1(result.uri)
                                        setTimeout(()=>{
                                            setAction_1(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }

                        }
                    } style = {{
                        position : 'absolute',
                        top : 0.08 * ScreenHeight,
                        left : 0.15 * ScreenWidth,
                        elevation : 15,
                        zIndex : 1,
                    }}>
                        <Avatar rounded icon = {{ name : 'pencil' , size : 16 , type : 'font-awesome'}} containerStyle = {{
                            backgroundColor : 'transparent'
                        }} />
                    </TouchableOpacity>
                    <Avatar rounded source = {{ uri : Chosen_image_1 }} size = {'xlarge'}  containerStyle = {{ elevation : 10}} />
                    </View>

                 ) : (
                     <TouchableOpacity onPress ={
                         async () => {
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
                                        setChosen_image_1(result.uri)
                                        setTimeout(()=>{
                                            setAction_1(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }
                         }
                     }>
                        <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'camera' , type : 'font-awesome' , size : 30 }} size = {'xlarge'}  />
                    </TouchableOpacity>
                  ) }
                  {
                      //Picture 2
                  }
                   { Action_2 ? ( 
                     <View>
                    <TouchableOpacity onPress = {
                        async () => {
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
                                        setChosen_image_2(result.uri)
                                        setTimeout(()=>{
                                            setAction_2(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }

                        }
                    } style = {{
                        position : 'absolute',
                        top : 0.08 * ScreenHeight,
                        left : 0.15 * ScreenWidth,
                        elevation : 15,
                        zIndex : 1,
                    }}>
                        <Avatar rounded icon = {{ name : 'pencil' , size : 16 , type : 'font-awesome'}} containerStyle = {{
                            backgroundColor : 'transparent'
                        }} />
                    </TouchableOpacity>
                    
                    <Avatar rounded source = {{ uri : Chosen_image_2 }} size = {'xlarge'} containerStyle = {{ elevation : 10}}  />
                    </View>

                 ) : (
                     <TouchableOpacity onPress ={
                         async () => {
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
                                        setChosen_image_2(result.uri)
                                        setTimeout(()=>{
                                            setAction_2(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }
                         }
                     }>
                        <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'camera' , type : 'font-awesome' , size : 30 }} size = {'xlarge'}  />
                    </TouchableOpacity>
                  ) }
                  {
                      //Picture 3
                  }
                   { Action_3 ? ( 
                     <View>
                    <TouchableOpacity onPress = {
                        async () => {
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
                                        setChosen_image_3(result.uri)
                                        setTimeout(()=>{
                                            setAction_3(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }

                        }
                    } style = {{
                        position : 'absolute',
                        top : 0.08 * ScreenHeight,
                        left : 0.15 * ScreenWidth,
                        elevation : 15,
                        zIndex : 1,
                    }}>
                        <Avatar rounded icon = {{ name : 'pencil' , size : 16 , type : 'font-awesome'}} containerStyle = {{
                            backgroundColor : 'transparent'
                        }} />
                    </TouchableOpacity>
                    
                    <Avatar rounded source = {{ uri : Chosen_image_3 }} size = {'xlarge'} containerStyle = {{ elevation : 10}}  />
                    </View>

                 ) : (
                     <TouchableOpacity onPress ={
                         async () => {
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
                                        setChosen_image_3(result.uri)
                                        setTimeout(()=>{
                                            setAction_3(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }
                         }
                     }>
                        <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'camera' , type : 'font-awesome' , size : 30 }} size = {'xlarge'}  />
                    </TouchableOpacity>
                  ) }
                  {
                      //Picture 4
                  }
                  { Action_4 ? ( 
                     <View>
                    <TouchableOpacity onPress = {
                        async () => {
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
                                        setChosen_image_4(result.uri)
                                        setTimeout(()=>{
                                            setAction_4(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }

                        }
                    } style = {{
                        position : 'absolute',
                        top : 0.08 * ScreenHeight,
                        left : 0.15 * ScreenWidth,
                        elevation : 15,
                        zIndex : 1,
                    }}>
                        <Avatar rounded icon = {{ name : 'pencil' , size : 16 , type : 'font-awesome'}} containerStyle = {{
                            backgroundColor : 'transparent',
                        
                        }} />
                    </TouchableOpacity>
                    
                    <Avatar rounded source = {{ uri : Chosen_image_4 }} size = {'xlarge'} containerStyle = {{ elevation : 10}} />
                    </View>

                 ) : (
                     <TouchableOpacity onPress ={
                         async () => {
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
                                        setChosen_image_4(result.uri)
                                        setTimeout(()=>{
                                            setAction_4(true)
                                        } , 100)
                                    }
                                  } catch (E) {
                                    console.log(E);
                                  }} else {
                                      console.log("No permissions")
                                  }
                         }
                     }>
                        <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'camera' , type : 'font-awesome' , size : 30 }} size = {'xlarge'}  />
                    </TouchableOpacity>
                  ) }

            </ScrollView>


        </View>
        
        
        
        
</View>
<View style = {{ position : 'relative' , bottom : ScreenHeight * 0.001  }}>
    <TouchableOpacity onPress = {
        () => {
            if (!pressed) {
                setpressed(true)
                if (Type === 'Hiring'){
                    props.send_date(Dead_date)
                }
                props.send_pics([Chosen_image_1, Chosen_image_2 , Chosen_image_3 , Chosen_image_4])
                props.state.navigation.navigation.navigate('Category' , { type : Type })
            }
        }
    } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
        <Text style = {{color : 'white'}}>Next</Text>
    </TouchableOpacity>

</View>
</View>

    </ScrollView>
    )
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
    
}

const mapDispatchToProps = (dispatch) => ({
    send_date : (Date) => dispatch({type : 'gig_word_info' , key : 'Gig_deadline' , value : Date}),
    send_pics : (pic_list) => {
        for(let i = 0 ; i <= pic_list.length-1 ; i++){
            if (pic_list[i]){
                const image = {}
                const newImageUri = "file:///" + pic_list[i].split("file:/").join("")
                image['uri'] = newImageUri
                image['name'] = newImageUri.split("/").pop()
                image['type'] = mime.lookup(newImageUri),
                dispatch({type : 'gig_images' , key : 'ShowCase_' + (i+1) , value : image})
            }
        }
    }

    
})

export default connect(mapStateToProps, mapDispatchToProps)(Show_case)


const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignItems : 'center',
        flex : 1,
    },
    disclaimer : {
        color : 'black',
        fontSize : 14,
        fontWeight : '700',
    },
    input_container : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height :0.6 * ScreenHeight,
        width : ScreenWidth ,
    },
    Portfolio : {
        width : ScreenWidth,
        height : 0.3 * ScreenHeight,
        justifyContent : 'space-between',
        alignItems : 'center',
        
    }

})