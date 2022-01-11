import React, { Component , useState , Use, useEffect } from 'react'
import { View , TextInput , Text , ScrollView , StyleSheet , TouchableOpacity } from 'react-native'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Avatar , Card } from 'react-native-elements'
import { Sae , Fumi } from 'react-native-textinput-effects';
import { connect } from 'react-redux'


export const Credentials = (props) => {
    const [Name , setName] = useState('')
    const [Location , setLocation] = useState('')
    const [Salary , setSalary] = useState('')
    const [Type , setType] = useState('')
    const [pressed , setpressed] = useState(false)
    useEffect( ()=>{
        const { type } = props.route.params
        setType(type)
    },[] )
    return (
        <ScrollView style = {styles.container}>
            
            <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ width : 0.9 * ScreenWidth, justifyContent : 'center' , alignItems : 'center' , height : 0.14 * ScreenHeight }}>
            <Avatar rounded icon = {{ name : 'check' , size : 18 , type : 'font-awesome' }} containerStyle = {{
                    backgroundColor : 'green'
                }} />
                <Text style = {styles.disclaimer}>Please take a step to make your gig a stand out by carefully filling the steps</Text>
            </View>
            <View style = {styles.input_container} >
            <Sae
                style = {{ width : ScreenWidth-10 , backgroundColor : 'white'}}
                label={'Name'}
                iconClass={FontAwesomeIcon}
                iconName={'pencil'}
                iconColor={'black'}
                inputPadding={16}
                labelHeight={24}
                // active border height
                borderHeight={2}
                // TextInput props
                autoCapitalize={'none'}
                autoCorrect={true}
                inputStyle = {{ color : 'black' , fontSize : 15, }}
                onChangeText = {
                    (text) => {
                        setName(text)
                    }
                }
            />
            <Sae
                style = {{ width : ScreenWidth-10  , backgroundColor : 'white'}}
                label={'Location'}
                iconClass={FontAwesomeIcon}
                iconName={'map-marker'}
                iconColor={'black'}
                inputPadding={16}
                labelHeight={24}
                // active border height
                borderHeight={2}
                // TextInput props
                autoCapitalize={'none'}
                autoCorrect={true}
                inputStyle = {{ color : 'black',fontSize : 15 }}
                onChangeText = {
                    (text) => {
                        setLocation(text)
                    }
                }
            />
           <Sae
                value = { Salary.toLocaleString() }
                style = {{ width : ScreenWidth-10  , backgroundColor : 'white'}}
                label={'Average Salary'}
                iconClass={FontAwesomeIcon}
                iconName={'pencil'}
                iconColor={'black'}
                inputPadding={16}
                labelHeight={24}
                // active border height
                borderHeight={2}
                // TextInput props
                autoCapitalize={'none'}
                autoCorrect={true}
                keyboardType = {'default'}
                inputStyle = {{ color : 'black',fontSize : 15, }}
                onChangeText = {
                    (text) => {
                        setSalary(text)
                    }
                }
            />
            
  </View>
  <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        <TouchableOpacity onPress = {
            async () => {
                if (pressed){

                } 
                else if(!pressed){
                    if (Name){
                        props.destroyer()
                        setpressed(true)
                        setTimeout(() => {
                            props.send_initiation(Type)
                            props.send_name(Name)
                            props.send_location(Location)
                            props.send_salary(Salary)
                        } , 800)
                        props.state.navigation.navigation.navigate('Extra Information' , { type : Type })
                    } else {
                        alert('Please input the name')
                    }
                 
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
    send_initiation  : (type) => dispatch({ type : 'initiate_gig_sign_up' , value : type }),
    send_name : (Name) => dispatch({type : 'gig_word_info' , key : 'Gig_name' , value : Name }),
    send_location : (Location) => dispatch({type : 'gig_word_info' , key : 'Gig_location' , value : Location}),
    send_salary : (Salary) => dispatch({type : 'gig_word_info' , key : 'Gig_salary' , value : Salary}),
    destroyer : () => dispatch({type : 'gig_instance_destroyer'})
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Credentials)


const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        
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
        height : ScreenHeight * 0.5,
        width : ScreenWidth ,
        

    }

})
