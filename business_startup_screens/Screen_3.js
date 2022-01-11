import React , {useState} from 'react'
import { View , StyleSheet , Text , TouchableOpacity , DatePickerAndroid , TextInput , ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'




export function Screen_3(props) {
    const [Birth_date , setBirth_date] = new useState('')
    const [Description , setDescription] = new useState('')
    const pick_birth_date = async () => {
        try{
            const {action , year , month , day} = await DatePickerAndroid.open({ 
                date : new Date(),
                mode : 'default',
             })

             if (action !== DatePickerAndroid.dismissedAction){
                 setBirth_date(year + "-" + month + "-" + day)
             }
    
        } catch ({code , message}){
            console.warn("Cannot open date picker",message)
    
        }
    }

    return (
        <ScrollView contentContainerStyle = {{  
            alignItems : 'center',
         }}style = {styles.container}>
            <View style = {{ top : 20 , alignItems : 'center' , height : ScreenHeight * 0.9  }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: props.fun.Layout_Settings.Icons_surroundings , elevation : 10 }} icon = {{ name : 'user-plus' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 3 OF 8</Text>
            </View>
            <View style = {styles.input_container} >
            <Fumi
                onFocus = {
                    async () =>{
                        await pick_birth_date()
                    }
                }
                value = {Birth_date}
                style = {{ width : ScreenWidth-10 }}
                label={'Birth Date'}
                iconClass={FontAwesomeIcon}
                iconName={'calendar'}
                iconColor={props.fun.Layout_Settings.Icons_Color}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
            />
            <Fumi
                onChangeText = {text => {
                    setDescription(text)
                }}
                label = {'Describe yourself . Dont think too hard . '}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                iconSize={20}
                iconColor = {props.fun.Layout_Settings.Icons_Color}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black',fontSize: 15, }}
                style = {{ width : 0.9 * ScreenWidth }}
                height = {0.28 * ScreenHeight}
                multiline = {true}
             />
            
            
            
  </View>
  <View style = {{ position : 'relative' , bottom : ScreenHeight * 0.001  }}>
        <TouchableOpacity onPress = {
            () => {
                props.send_info_Birthday(Birth_date)
                console.log(Birth_date)
                props.send_info_description(Description)
                props.state.navigation.navigation.navigate('Billing Information')
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>

        </ScrollView>
    )
}
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}

let mapDispatchToProps = (dispatch) => ({
    send_info_Birthday : (Birth_date) => dispatch({ type : 'Business account' , key : 'Date_of_birth' , value : Birth_date }),
    send_info_description : (Description) => dispatch({type : 'Business account' , key : 'Description' , value : Description})

})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_3)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
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
        height :0.6 * ScreenHeight,
        width : ScreenWidth ,

    }

})
