import * as SQLite from 'expo-sqlite'
import {Alert} from 'react-native'
import axios from 'axios'
import * as Contacts from 'expo-contacts';
import FormData, {getHeaders} from 'form-data'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {  Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { documentDirectory } from 'expo-file-system'
import OneSignal from 'react-native-onesignal';
import fun_database from '../redux/Database_fun_transactions.js'
import * as MediaLibrary from 'expo-media-library'



export class fun_sign_up {
    constructor(info , profile_picture,Debug){
        this.info = info
        this.network_pic = profile_picture
        this.profile_picture = profile_picture
        this.Debug = Debug 
    }
  

    storing_profile_pic_to_folder = async (pic) => {
        if (pic){ 
          const profile_pic_directory = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/')
          if (!profile_pic_directory){
            await FileSystem.makeDirectoryAsync(profile_pic_directory, {intermediates : true})
          }
          const new_uri = FileSystem.documentDirectory + 'Multix Photos/Profile Pictures/' + pic.name
          let pic_c = await FileSystem.copyAsync({from : pic , to : new_uri })
        //   await MediaLibrary.createAssetAsync(new_uri)
          return new_uri
        }else {
          return null
        }
       
    }

    async insert_to_db(db_info){
      // let new_profile_pic_uri = await this.storing_profile_pic_to_folder(this.profile_picture)
        let data = [
            db_info.Name , db_info.Password , db_info.Contact , db_info.Email , 
            db_info.Birth_date , db_info.Sign_up_date , db_info.Nickname , this.profile_picture.uri,
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
        },(error) =>{console.log(error)} , () => {})
    }

  

    async insert_contacts_to_db(Contacts){
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

   


    async update_contacts(token , navigator , profile){
      Alert.alert('Demo Version',
      'This is the first release of the Multix app . The Multix engineering team would like to welcome you and hope to help them make Multix a better app through providing feedback in the settings section about some of the glitches found in the app , the new features you would like them to include ...etc',
      [
          {text : 'Allow' , onPress : async ()=>{
              let official_numbers =  await fun_database.get_contacts_list()
              axios({
                  method : 'GET',
                  url : this.Debug ? ('http://192.168.43.232:8040/Scan_chats/') : ('http://multix-fun.herokuapp.com/Scan_chats/'),
                  data : {},
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

    async registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const result = (await Notifications.getExpoPushTokenAsync({experienceId : '@lantern/Multix'})).data;
          if (result){
              token = result
          } else {
              token = 'E000'
          }
          //console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }

     async initialize_onesignal(){
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
  
    async sign_up(navigator){
        let notification_token = 'E0001'
        console.log(this.Debug)
        axios({
            method : 'POST',
            url : this.Debug ? ('http://192.168.43.232:8040/SignUp') : ('http://multix-fun.herokuapp.com/SignUp') ,
            data : { 'info' : {...this.info, Notifications_token : notification_token}}
        }).then(async (response_1)=>{
            if (response_1.status === 201){
                console.log(response_1.data)
                if (this.network_pic) {
                    const form_data = new FormData()
                    form_data.append('Profile_pic' , this.network_pic)
                    axios({
                        method : 'PUT',
                        url : this.Debug ? ('http://192.168.43.232:8040/SignUp_profilePic') : ('http://multix-fun.herokuapp.com/SignUp_profilePic'),
                        data : form_data,
                        headers : { 
                            'content-type' : 'multipart/form-data',
                            'Authorization': 'Token ' + response_1.data['Multix_token'] ,
                        }
                    }).then(async (response) => {
                        if (response.status === 202){
                            this.insert_to_db(response_1.data)
                            await this.initialize_onesignal()
                            await this.update_contacts(response_1.data['Multix_token'] , navigator , {
                                'Profile' : {...response_1.data , 'Profile_photo' : this.profile_picture.uri},
                            })
                        }
                    })
                } else {
                    this.insert_to_db(response_1.data)
                    await this.initialize_onesignal()
                    await this.update_contacts(response_1.data['Multix_token'] , navigator , {
                        'Profile' : {...response_1.data , 'Profile_photo' : null},
                    })
                }
               
            }
        })

    }



}


export default fun_sign_up