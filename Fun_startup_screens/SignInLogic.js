import * as SQLite from 'expo-sqlite'
import {Alert} from 'react-native'
import axios from 'axios'
import * as Contacts from 'expo-contacts';
import FormData, {getHeaders} from 'form-data'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { documentDirectory } from 'expo-file-system'
import OneSignal from 'react-native-onesignal';
import fun_database from '../redux/Database_fun_transactions.js'
import * as MediaLibrary from 'expo-media-library';


export default class SignInLogic {
    static async init(username , password , Debug , navigator,invalid , are_contacts_allowed){
        this.Debug = Debug 
        axios({
            method : 'POST',
            url : Debug ? ('http://192.168.43.232:8040/Sign_in') : ('http://multix-fun.herokuapp.com/Sign_in'),
            data : {
                username : username,
                password : password,
            }
        }).then((response)=>{
            console.log(response.status)
            if (response.status == 202){
                
                this.insert_to_db(response.data)
                this.initialize_onesignal()
                this.update_contacts(response.data['Multix_token'] , navigator , response.data , are_contacts_allowed)
            } else if (response.status == 204){
                console.log('something went wrong')
                //invalid()
            }
        }).catch(()=>{
            invalid()
        })
    } 
    static async update_contacts(token , navigator , profile , are_contacts_allowed){
        Alert.alert('Demo Version',
        'This is the first release of the Multix app . The Multix engineering team would like to welcome you and hope to help them make Multix a better app through providing feedback in the settings section about some of the glitches found in the app , the new features you would like them to include ...etc',
        [
                {text : 'Allow' , onPress : async ()=>{
                    let official_numbers =  await fun_database.get_contacts_list()
                    axios({
                        method : 'GET',
                        url : this.Debug ? ('http://192.168.43.232:8040/Scan_chats/') : ('http://multix-fun.herokuapp.com/Scan_chats/'),
                        data : {'Contacts' : official_numbers},
                        headers : { 
                          'content-type' : 'application/json',
                          'Authorization': 'Token ' + token ,
                      }
                    }).then(async (response) => {
                        if (response.status === 200){
                            // console.log(response.data)
                            let resp = response.data
                            let friends = []
                            for(let i = 0; i<official_numbers.length; i++){
                              for(let p = 0; p<resp.length; p++){
                                if(official_numbers[i] == resp[p].Contact){
                                  // this.props.update_contacts(resp[p])
                                  if(resp[p]){
                                    friends.push(resp[p])
                                  }
                                }
                              }
                            }
                            axios({
                              method : 'POST',
                              url : (this.Debug) ? ('http://192.168.43.232:8040/Update_friends') : ('https://multix-fun.herokuapp.com/Update_friends'),
                              data : {'friends' : friends},
                              // timeout : 100000,
                              headers : { 
                                'content-type' : 'application/json',
                                'Authorization': 'Token ' +  token ,
                            }
                            }).then(async(response_online)=>{
                              if (response_online.status == 202){
                                  console.log('contacts matched correctly')
                                // let matched_data = fun_database.online_chats(response_online.data , response.data)
                                // this.props.store_online_chats(matched_data)
                              }
                            },()=>{
                  
                            })
                            await this.insert_contacts_to_db(friends)
                            navigator(
                              {
                                  'Profile' : {...profile},
                                  'Contacts' : friends,
                              }
                            )
                        }
                    })
                }},
                {text : 'Disagree' , onPress : async ()=>{
                    await this.insert_contacts_to_db([])
                    navigator(
                      {
                          'Profile' : {...profile},
                          'Contacts' : [],
                      }
                    )
        
                }}
            ] , {
                cancelable : false
            })
           
           
       
      
    }

    static storing_profile_pic_to_folder = async (pic) => {
        if (pic){ 
            const original_uri = FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/'
          const profile_pic_directory = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/')
          if (!profile_pic_directory.exists){
            await FileSystem.makeDirectoryAsync(original_uri, {intermediates : true})
          }
          const new_uri = FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/Fun'
          let local_uri = await FileSystem.downloadAsync(pic , new_uri)
        //   await MediaLibrary.createAssetAsync(local_uri)
          return new_uri
        }else {
          return null
        }
       
    }

    static async insert_to_db(db_info){
        let new_profile_pic_uri = await this.storing_profile_pic_to_folder(db_info.Profile_photo)
        let data = [
            db_info.Name , db_info.Password , db_info.Contact , db_info.Email , 
            db_info.Birth_date , db_info.Sign_up_date , db_info.Nickname , new_profile_pic_uri,
            db_info.Hobby , db_info.Residence , db_info.Notifications_token , db_info.Multix_token , db_info.id
        ]
        console.log(data)
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            tx.executeSql('INSERT INTO Account (Name , Password , Contact , Email , Birth_date , Sign_up_date , Nickname , Profile_photo , Hobby  , Residence , Notifications_token , Multix_token , Server_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)' ,
             [...data],(tx , Result_set) => {
                 console.log("Inserted")
                if (Result_set.rowsAffected > 0) {
                   console.log('Inserted successfully')
                }
            } , (error) => {
                console.log('Error about inserting into profile')
            })
        },(error) =>{} , () => {})
    }

    static async insert_contacts_to_db(Contacts){
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            for( let i=0; i < Contacts.length; i++){
                let name = Contacts[i].Name
                let contact = Contacts[i].Contact
                let Server_id = Contacts[i].id
                tx.executeSql('INSERT INTO Chats_contacts(Name , Contact , Server_id) VALUES (?,?,?)',
                [name , contact , Server_id],(tx,Result_set)=>{
                    console.log('done')
                },(error)=>{})
            }
        },(error)=>{},()=>{})
    }

    static async send_otp(username , Debug , finisher){
      
        axios({
          method : 'POST',
          url : (Debug) ? ('http://192.168.43.232:8040/Give_otp/') : ('https://multix-fun.herokuapp.com/Give_otp'),
          data : {'username' : username},
          // timeout : 100000,
          headers : { 
            'content-type' : 'application/json',
        }
        }).then(async(response)=>{
          console.log(response)
          if (response.status == 200){
              finisher(response.data['OTP'])
              console.log(response.data['OTP'])
            // let matched_data = fun_database.online_chats(response_online.data , response.data)
            // this.props.store_online_chats(matched_data)
          }
        },()=>{

        })
    }

    static async verify_otp(username , otp , Debug , finisher){
        axios({
          method : 'POST',
          url : (Debug) ? ('http://192.168.43.232:8040/Validate_otp/') : ('https://multix-fun.herokuapp.com/Validate_otp'),
          data : {'username' : username , 'otp' : otp },
          // timeout : 100000,
          headers : { 
            'content-type' : 'application/json',
        }
        }).then(async(response)=>{
          console.log(response)
          if (response.status == 200){
              finisher()
              // console.log(response.data['OTP'])
            // let matched_data = fun_database.online_chats(response_online.data , response.data)
            // this.props.store_online_chats(matched_data)
          }
        },()=>{

        })

    }

    

    static async initialize_onesignal(){
    //OneSignal Init Code
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId("d63de83f-34c6-4a3e-bd45-b13b1005a821");
      //END OneSignal Init Code

      //Prompt for push on iOS
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log("Prompt response:", response);
      });

      //Method for handling notifications received while app in foreground
      OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
        console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
        let notification = notificationReceivedEvent.getNotification();
        console.log("notification: ", notification);
        const data = notification.additionalData
        console.log("additionalData: ", data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      });

      //Method for handling notifications opened
      OneSignal.setNotificationOpenedHandler(notification => {
        console.log("OneSignal: notification opened:", notification);
      });

    }

}