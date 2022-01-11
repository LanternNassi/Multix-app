import React , {Component} from 'react'
import { View , StyleSheet , Text , TouchableOpacity,ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

export class Screen_4_Billing extends Component  {
    state = {
        form_data : ''
    }
    _onChange = (form) => {
        console.log(form)
        this.setState({form_data : form})
        
    }
    render = () =>{
        return (
            <ScrollView style = {{ flex : 1 }}>
            <View style = {styles.container}>
                <View style = {{ top : 20 , alignItems : 'center' }}>   
                <View style = {{ justifyContent : 'space-around' , alignItems : 'center' , flexWrap : 'nowrap'  }}>
                    <Avatar rounded containerStyle = {{ backgroundColor: this.props.fun.Layout_Settings.Icons_surroundings , elevation : 10 }} icon = {{ name : 'credit-card-alt' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                    <Text style = {styles.disclaimer}>BILLING INFORMATION</Text>
                    <Text style = {{ fontSize : 9, color : 'red' }}> This feature is still under maintainance by the Multix engineers and not yet stable. Press 'Skip' </Text>

                </View>
                <View style = {styles.input_container} >
                <CreditCardInput autofocus
                allowScroll = {true}
                 onChange={this._onChange}
                 />
      </View>
      <View style = {{ position : 'relative' , bottom : -20 }}>
            <TouchableOpacity onPress = {
                () => {
                    this.props.send_info_Name('Multix Express')
                    this.props.send_info_Number('000')
                    this.props.send_info_expiry('2021-05-05')
                    this.props.send_info_cvc('')
                    this.props.state.navigation.navigation.navigate('Profile Picture')
                }
            } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : this.props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                <Text style = {{color : 'white'}}>Next</Text>
            </TouchableOpacity>
    
      </View>
      <View style = {{ position : 'relative' , top : -70,  }}>
            <TouchableOpacity onPress = {
                () => {
                    this.props.send_info_Name('Multix Express')
                    this.props.send_info_Number('000')
                    this.props.send_info_expiry('2021-05-05')
                    this.props.send_info_cvc('')
                    this.props.state.navigation.navigation.navigate('Profile Picture')
                }
            } style = {{ width : 180 , elevation : 20, height : 42 , borderRadius :21  , backgroundColor : this.props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                <Text style = {{color : 'white'}}>Skip for now</Text>
            </TouchableOpacity>
      </View>
      </View>
    
            </View>
            </ScrollView>
        )
    }
    
}
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}

let mapDispatchToProps = (dispatch) => ({
    send_info_Name : (Name) => dispatch({type : 'Billing information' , key : 'Name_on_card' , value : Name}),
    send_info_Number : (Number) => dispatch({type : 'Billing information' , key : 'Card_Number' , value : Number }),
    send_info_expiry : (Expiry) =>{ 
        //let split_date = Expiry.split("/")
        //let final_date = "20" + split_date[1] + "-" + split_date[0] + "-" + "01" 
        //console.log(final_date)
        dispatch({type : 'Billing information' , key : 'Expiration_date' , value : Expiry })},
    send_info_cvc : (cvc) => dispatch({type : 'Billing information' , key : 'CVC' , value : cvc }),

})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_4_Billing)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignItems : 'center',
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
        height : 0.55 * ScreenHeight,
        width : ScreenWidth ,
        elevation : 10

    }

})
