import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';
import axios from 'axios'
import * as SQLite from 'expo-sqlite'



export class notify{
    static async  init(){
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus !== 'granted') {
              alert('Failed to get push token for push notification!');
              return false;
            }else {
                return true
            }
          } else {
            alert('Must use physical device for Push Notifications');
          }

    }
    static async update_push_notification_token_to_business(token){
        let db = SQLite.openDatabase(name = 'Business_database.db')
        db.transaction((tx)=>{
            tx.executeSql(
                'SELECT Multix_token from Business_account WHERE id = 1',
                [],
                (tx ,Result) => {
                    if (Result.rows.length >0 ){
                        console.log('update tokens')
                        axios({
                            method : 'PUT',
                            url : 'https://multix-business.herokuapp.com/update_push_notification_token',
                            data : {'token' : token},
                            headers : {
                                'content-type' : 'application/json',
                                'Authorization': 'Token ' + Result.rows.item(0)['Multix_token'] ,
                            }
                        }).then((response)=>{
                            if (response.status === 202){
                                tx.executeSql(
                                    'UPDATE Business_account SET Multix_token = ? WHERE id = 1',
                                    [token],
                                    (tx , Result_set) => {
                                        if (Result_set.rowsAffected > 0){
                                            console.log('done updating')
                                        }
                                    }
                                )
                            }
                        })
            

                    }
                   
                },
                (error) =>{console.log(error)}
            )
        },(error)=>{console.log(error)},()=>{})

          
        
    }
    static async get_push_notification_token(){
        let token;
       
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token)
        if (Platform.OS === 'android') {
            console.log('here channels')
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        console.log(token)
        return token;
    }
}

export default notify