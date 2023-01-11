import React , {Component} from 'react';
import {connect} from 'react-redux';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

class TermsAndConditions extends Component{
  constructor(props){
      super(props)
  }
  state = {
      accepted: false
  }

  render(){
    return (
     <View style={styles.container}>
            <Text style={styles.title}>Terms and conditions</Text>
            <ScrollView 
            style={styles.tcContainer}
            onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  this.setState({
                      accepted: true
                  })
                }
              }}
            >
                <Text style={styles.tcP}>Welcome to Multix. If you continue and use this app, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Multix’s relationship with you in relation to this app. If you disagree with any part of these terms and conditions, please do not use our app.</Text>
                {/* <Text style={styles.tcP}>The term ‘Multix’ or ‘us’ or ‘we’ refers to the owner of the app whose registered office is Buddu S. Our company registration number is [company registration number and place of registration]. The term ‘you’ refers to the user or viewer of our website.</Text> */}
                    <Text style={styles.tcL}>{'\u2022'} The content of the screens of this app is for your general information and use only. It is subject to change with or without notice.</Text>
                    <Text style={styles.tcL}>{'\u2022'} This app uses hidden encrypted local databases stored on your device by our servers to store your personal information only so as to improve the speed of the service for your convenience . If you do allow, the following personal information may be stored by us.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this app for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Your use of any information or materials in this app is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this app meet your specific requirements.</Text>
                    <Text style={styles.tcL}>{'\u2022'} This app contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</Text>
                    <Text style={styles.tcL}>{'\u2022'} All trademarks reproduced in this app, which are not the property of, or licensed to the operator, are acknowledged in the app.
Unauthorised use of this app may give rise to a claim for damages and/or be a criminal offence.</Text>
                    <Text style={styles.tcL}>{'\u2022'} From time to time, this app may also include links to some websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the app(s). We have no responsibility for the content of the linked website(s).</Text>
                    <Text style={styles.tcL}>{'\u2022'} Your use of this app and any dispute arising out of such use of the app is subject to the laws of England and Uganda.</Text>
                <Text style={styles.tcP}>The use of this app is subject to the above terms of use</Text>
            </ScrollView>

            <TouchableOpacity disabled={ !this.state.accepted } onPress={ ()=>{
                this.props.navigation.navigate('Welcome to Multix')
        } } style={ this.state.accepted ? styles.button : styles.buttonDisabled }><Text style={styles.buttonLabel}>Accept</Text></TouchableOpacity>
      </View>
    );
  }

}

const { width , height } = Dimensions.get('window');

let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
  }
  
  let mapDispatchToProps = (dispatch) => ({
   
  })
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(TermsAndConditions)
  

const styles = {

  container:{
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  title: {
      fontSize: 22,
      alignSelf: 'center'
  },
  tcP: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcP:{
      marginTop: 10,
      fontSize: 12
  },
  tcL:{
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      fontSize: 12
  },
  tcContainer: {
      marginTop: 15,
      marginBottom: 15,
      height: height * .63
  },

  button:{
      backgroundColor: '#136AC7',
      borderRadius: 5,
      padding: 10
  },

  buttonDisabled:{
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10
 },

  buttonLabel:{
      fontSize: 14,
      color: '#FFF',
      alignSelf: 'center'
  }

}

