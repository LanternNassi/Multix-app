import React , {useState, Component} from 'react'
import { View , StyleSheet , Text , TouchableOpacity , DatePickerAndroid , Dimensions , ScrollView } from 'react-native'
import { Avatar,Icon } from 'react-native-elements'
import TagInput from 'react-native-tags-input'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import * as Animatable from 'react-native-animatable'
import {CirclesLoader, TextLoader} from 'react-native-indicator'
import {connect} from 'react-redux'
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import FormData, {getHeaders} from 'form-data';
import * as SQLite from 'expo-sqlite'
import { documentDirectory } from 'expo-file-system'
import business_database from '../redux/Database_transactions.js'
import Spinner from 'react-native-loading-spinner-overlay'
import * as MediaLibrary from 'expo-media-library'


const mainColor = '#3ca897';
const sign_up = {
  0 : {
    bottom : 0,
    height : 0,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.6)'

},
0.5 : {
    bottom : 0,
    height : 0.1 * ScreenHeight,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.6)'

},
1 : {
    bottom : 0,
    height : 0.3 * ScreenHeight,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.8)'
}

}
const finished_sign_up = {
  0 : {
    bottom : 0,
    height : 0.3 * ScreenHeight,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.8)'
},
0.5 : {
    bottom : 0,
    height : 0.1 * ScreenHeight,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.6)'

},
1 : {
    bottom : 0,
    height : 0,
    width : ScreenWidth,
    backgroundColor : 'rgba(0,0,0,0.6)'

},
}

export class Screen_6_Preferences extends Component{
    constructor(props) {
        super(props);
        this.state = {
          current_style : sign_up,
          Signing_up : false,
          spin : false,
          created : false,
          submitted : false,
          tags_Certs: {
            tag: '',
            tagsArray: []
          },
          tags_Pref:{
              tag : '',
              tagsArray : []
          },
          tagsColor: mainColor,
          tagsText: '#fff',
        };
      }

      storing_profile_pic_to_folder = async (pic) => {
        if (pic){ 
          const profile_pic_directory = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/')
          if (!profile_pic_directory){
            await FileSystem.makeDirectoryAsync(profile_pic_directory, {intermediates : true})
          }
          const new_uri = FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/' + pic.name
          await FileSystem.copyAsync({from : pic.uri , to : new_uri })
          // await MediaLibrary.createAssetAsync(new_uri)
          return new_uri
        }else {
          return null
        }
       
      }
      
      insert_profile_to_database = (profile , certifications ,Billing_info ) => {
        console.log(profile)
        const db = SQLite.openDatabase('Business_database.db')
        db.transaction((tx)=>{
          tx.executeSql(
            'INSERT INTO Business_account (user_id,Multix_token,Name,Password,Contact,Email,Description,Place_of_residence,Date_of_birth,Rating,Date_of_creation,Preference_1,Preference_2,Preference_3,Preference_4,Profile_pic) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
             [...profile] , (tx , Result) => {
              console.log('Inserted at id '+ Result.insertId)
              if (Result.rowsAffected > 0 ) {
                for(let i = 0 ; i<=certifications.length-1; i++){
                  tx.executeSql(
                    'INSERT INTO Certifications (Account_id , Name) VALUES (?,?)', 
                    [Result.insertId,certifications[i]] , (tx,Result_cert)=>{
                      console.log('Certifcate inserted' + Result_cert.insertId)
                    } , (error) => {
                      console.log(error)
                    }
                  )
                }
                tx.executeSql(
                  'INSERT INTO Billing_info (Card_number,Name_on_card,CVC,Expiration_date,Account_id) VALUES (?,?,?,?,?)',
                  [...Billing_info,Result.insertId] , (tx , Result_Bills) => {
                    console.log('Billing info inserted at' , Result_Bills.insertId)
                  }
                )
              
             }
            console.log('Inserted successfully')
          }, (error) => {
            console.log(error)
            console.log('From statement')
          })
        }, (error) => {
          console.log(error.message)
        }, () => {
          console.log('Query Successful')
        })
        
      }

      updateTagState_Certifications = (state) => {
          this.setState({
            tags_Certs: state
          })
        };
        updateTagState_Preferences = (state) => {
            this.setState({
              tags_Pref: state
            })
          };
   render = () =>{
    return (
        <ScrollView contentContainerStyle = {{
          alignItems : 'center',
        }} style = {styles.container}>
            <View style = {{ top : 20 , alignItems : 'center' , height : ScreenHeight * 0.9 }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: this.props.fun.Layout_Settings.Icons_surroundings , elevation : 10 }} icon = {{ name : 'user-plus' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 6 OF 6</Text>
            </View>
            <View style = {styles.input_container} >
            <TagInput
                updateState={this.updateTagState_Certifications}
                tags={this.state.tags_Certs}
                placeholder="Add Certifications eg UCE , PLE..."                            
                label="Press comma & space to add a tag"
                labelStyle={{color: 'black', fontSize : 13,fontWeight : '700'}}
                leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={this.state.tagsText}/>}
                leftElementContainerStyle={{marginLeft: 3}}
                containerStyle={{width: (Dimensions.get('window').width - 20) }}
                inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
                inputStyle={{color: this.state.tagsText}}
                onFocus={() => this.setState({tagsColor: '#fff', tagsText: mainColor})}
                onBlur={() => this.setState({tagsColor: mainColor, tagsText: '#fff'})}
                autoCorrect={false}
                tagStyle={styles.tag}
                tagTextStyle={styles.tagText}
                keysForTag={', '}/>

            <TagInput
                updateState={this.updateTagState_Preferences}
                tags={this.state.tags_Pref}
                placeholder="Add Preferences eg design , ..."                            
                label="Press comma & space to add a tag"
                labelStyle={{color: 'black', fontSize : 13,fontWeight : '700'}}
                leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={this.state.tagsText}/>}
                leftElementContainerStyle={{marginLeft: 3}}
                containerStyle={{width: (Dimensions.get('window').width - 20) }}
                inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
                inputStyle={{color: this.state.tagsText}}
                onFocus={() => this.setState({tagsColor: '#fff', tagsText: mainColor})}
                onBlur={() => this.setState({tagsColor: mainColor, tagsText: '#fff'})}
                autoCorrect={false}
                tagStyle={styles.tag}
                tagTextStyle={styles.tagText}
                keysForTag={', '}/>
            
            
            
  </View>
  <Spinner
      visible={this.state.spin}
      textContent={'Signing up on Multix Business...'}
      textStyle={{
        color : 'white',
        fontSize : 16,
      }}
  />
  <View style = {{ position : 'relative' , bottom : -ScreenHeight*0.15  }}>
        <TouchableOpacity onPress = {
             () => {
               if (this.state.submitted){

               }else if (this.state.submitted == false){
                this.props.send_info_certs(this.state.tags_Certs.tagsArray)
                this.props.send_general_id(this.props.fun.Fun_profile['Server_id'])
                this.props.send_notification_token(this.props.fun.Fun_profile['Notifications_token'])
                this.props.send_info_prefs(this.state.tags_Pref.tagsArray)
                this.setState({submitted : true , spin : true})
                setTimeout(()=>{
                  try {
                    this.props.state.request_business_json({
                      method: 'post',
                      url: '/create_business_account',
                      data: {...this.props.state.Business_sign_up },
                    }).then(async (response) =>{
                      if (response.status == 201){
                        const server_data = response.data['Account']
                        const stored_pic = await this.storing_profile_pic_to_folder(this.props.state.processed_image?(this.props.state.processed_image) : (null))
                        const database_data_account = [server_data.Multix_general_account_id,server_data.Multix_token,server_data.Name,server_data.Password,server_data.Contact,server_data.Email,
                          server_data.Description, server_data.Place_of_residence,server_data.Date_of_birth,server_data.Rating, server_data.Date_of_creation,
                          server_data.Preference_1,server_data.Preference_2,server_data.Preference_3,server_data.Preference_4,stored_pic ]
                        const certs = response.data['Certifications']
                        const Bills_info = response.data['Billing information']
                        const database_billis_info = [Bills_info.Card_Number , Bills_info.Name_on_card , Bills_info.CVC , Bills_info.Expiration_date]
                        this.insert_profile_to_database(database_data_account,certs,database_billis_info)
                        //const business_db = new business_database()
                        //let profile = business_db.business_data()
                        const profile = {}
                        const account_info = response.data['Account']
                        account_info['Profile_pic'] = this.props.state.processed_image.uri
                        profile['Account'] = account_info
                        profile['Billing information'] = response.data['Billing information']
                        profile['Certifications'] = response.data['Certifications']
                        profile['Transactions'] = []
                        profile['Contracts'] = []
                        profile['Languages'] = []
                        profile['Gigs'] =[]
                        this.props.store_profile_redux(profile)
                        this.props.create_request_instances(response.data['Account']['Multix_token'])

                        if (this.props.state.processed_image){
                          const form_data = new FormData()
                          form_data.append('Pic' , this.props.state.processed_image)
                          this.props.state.request_business_form({
                            method : 'put',
                            url : response.data['id']+'/profile_pic' ,
                            data : form_data,
                          }).then((response) => {
                            if (response.status == 202){
                              this.setState({spin : false})
                              //setTimeout(() =>{
                                //this.setState({current_style : finished_sign_up})
                              //},1000)
                              this.props.state.navigation.navigation.navigate('Business Profile')
                            }
                          })  
                        }else {
                          //// No profile pic 
                          this.setState({spin : false})
                          this.props.state.navigation.navigation.navigate('Business Profile')
                        }
                       
                      }
                    })
                    
                  } catch (error) {
                    console.warn(error)
                  }
                },2000)
              }

               }
              
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : this.props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Sign Up</Text>
        </TouchableOpacity>


  </View>
  </View>
  {
          (this.state.Signing_up)? (
            <Animatable.View animation = {this.state.current_style} style = {{ 
              //elevation : 22,
               position : 'absolute' ,
                justifyContent : 'space-between', 
                alignItems : 'center' 
              //backgroundColor : 'rgba(0,0,0,0.8)' , 
             //position : 'absolute',
             //right : 0.05 * ScreenWidth,
             //height : 0.4 * ScreenHeight,
             //width : 0.9 * ScreenWidth,
             //flexDirection : 'column',
             //justifyContent : 'center',
              //alignItems : 'center' 
               }}>
                <View style = {{
                  height : 0.2*ScreenHeight,
                  width : 0.7 * ScreenWidth,
                  flexDirection : 'column',
                  justifyContent : 'center',
                  alignItems : 'center',
                }}>
                  { 
                    (this.state.created)? (
                      <Animatable.View animation = {'wobble'} iterationCount = {'infinite'} style = {{
                        height : 0.075 * ScreenHeight,
                        width : 0.6 * ScreenWidth,
                        backgroundColor : this.props.state.theme.icons_surrounding,
                        borderRadius : 0.5 * (0.2 * ScreenHeight) , 
                        justifyContent : 'center',
                        alignItems : 'center'
                      }} >
                        <Text style = {{ color : 'white' }}> You are welcome  </Text>

                      </Animatable.View>
                      
                    ) : (
                      <View style = {{
                        height : 0.2 * ScreenHeight,
                        width : 0.3 * ScreenWidth,
                        justifyContent : 'space-between',
                        alignItems : 'center',
                      }}>
                    <CirclesLoader />
                    <TextLoader text = {'Signing up'} textStyle = {{
                      color : 'white',
                      fontWeight : '700',
                      fontSize : 22,
                    }}/>
                    </View>
                      )
                      
                   }
                </View>

            </Animatable.View>

          ) : (<View/>)
        }
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
  send_info_certs : (Names) => dispatch({type : 'Certifications' , key : 'Certification_names' , value : Names }),
  send_notification_token : (token) => dispatch({type : 'Business account' , key : 'Notifications_token' , value : token}),
  send_general_id : (id) => dispatch({type : 'Business account' , key : 'Multix_general_account_id' , value : id}),
  create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token }),
  send_info_prefs : (Names) => {
    for (let i = 0 ; i <= Names.length-1 ; i++){
      dispatch({type : 'Business account' , key : 'Preference_'+ (i+1) , value : Names[i]})
    }
  },
  store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile})


})

export default connect(mapStateToProps,mapDispatchToProps)(Screen_6_Preferences)

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
        justifyContent : 'space-between',
        alignItems : 'center',
        height :0.45 * ScreenHeight,
        width : ScreenWidth ,

    },
    textInput: {
        height: 50,
        borderColor: 'white',
        borderWidth: 1,
        marginTop: 8,
        borderRadius: 25,
        padding: 3,
      },
      tag: {
          backgroundColor: '#fff',
         
          
        },
      tagText: {
          color: mainColor
        },

})
