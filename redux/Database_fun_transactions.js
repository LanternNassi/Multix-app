import * as SQLite from 'expo-sqlite'
import * as Contacts from 'expo-contacts';
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types'
import * as MediaLibrary from 'expo-media-library'
import {Buffer} from 'buffer'


export class fun_database {
   
    static get_random_color(letter){
       const colors =  {
            'A' : 'red',
            'B' :'blue',
            'C' :'green',
            'D' :'purple',
            'E' :'black',
            'F' :'violet',
            'G' :'gold',
            'H' :'orange',
            'I' :'brown',
            'J' :'green',

            'K' : 'red',
            'L' :'blue',
            'M' :'green',
            'N' :'purple',
            'O' :'black',
            'P' :'violet',
            'Q' :'gold',
            'R' :'orange',
            'S' :'brown',
            'T' :'green',

            'V' : 'red',
            'W' :'blue',
            'X' :'green',
            'Y' :'purple',
            'Z' :'black',
          
        }
        let color_index = Math.floor(Math.random()*10)
        if (colors[letter]){
            return colors[letter]

        } else {
            return 'purple'
        }
    }


   static async store_message_db(info){
       const final = [
            info['Contact'],
            info['Message'],
            info['Status'],
            info['Date'],
            info['Receiving'],
            info['Server_id'],
            info['forwarded'],
            info['Starred'],
            info['Replied'],
            info['Type'],
            info['Muk'],
       ]

       const db = SQLite.openDatabase('Fun_database.db')
       db.transaction((tx)=>{
           tx.executeSql('INSERT INTO Messages (Contact , Message , Status , Date , Receiving , Server_id , forwarded , Starred , Replied, Type, Muk) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
           [...final]
           ,(tx,Result)=>{
           },(error)=>{
               //console.log(error)
           })
       },(error)=>{
           //console.log(error)
       },()=>{})
   }

   static async delete_message_db(id){
       const db = SQLite.openDatabase('Fun_database.db')
       db.transaction((tx)=>{
           tx.executeSql('DELETE FROM Messages WHERE id = ?',[id],(error)=>{},()=>{})
       },(error)=>{},()=>{})
   }

   static async star_message_db(id){
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            tx.executeSql('UPDATE Messages SET Starred = 1 WHERE id = ?',[id],(error)=>{},()=>{})
        },(error)=>{},()=>{})
   }


   static verify_if_number_exists(Messages , Server_id){
       for(let i = 0; i<Messages.length; i++){
           if( Messages[i].Server_id === Server_id ){
               return i
           }
       }
       return false
       
   }
   
  static online_chats(online_chats,Chats_contacts){
    let matched_online_contacts = {}
    for(let i=0; i<online_chats.length; i++){
        for(let n = 0; n<Chats_contacts.length; n++){
            if (Chats_contacts[n].id === online_chats[i]){
                matched_online_contacts[Chats_contacts[n].Name] = online_chats[i]
            }
        }
    }
    return matched_online_contacts
  }


   static async get_contacts_list(){
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted'){
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });
          let official_numbers = []
        //   console.log(data.length , "From contact list 1")
          if (data.length>0){
              for(let i=0; i<data.length; i++){
                  try {
                    let number = [...(data[i].phoneNumbers[0].number)]
                    if (number[0] == '0'){
                        let country_code = ['+','2','5','6']
                        for( let i=0; i<=3; i++){
                            if (number[0] == '0'){
                                number.splice(i,1,country_code[i])
                            }else {
                                number.splice(i,0,country_code[i])
                            }
                        }
                    }
                    for(let i = 0; i < number.length; i++){
                        if ( number[i] === " " ){
                            number.splice(i,1)
                        }
                        
                    }
                    // console.log(number.join(''))
                    // let buffer = Buffer.from(number.join(''))
                    // let Base64String = buffer.toString('base64')
                    // official_numbers.push(Base64String)
                    official_numbers.push(number.join(''))
                   
                  } catch (error) {
                  }
              }
             
          }
        //   console.log(official_numbers)
     
          return official_numbers
    }
    }

    static async get_contacts_with_name(){
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted'){
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });
            let official_numbers = {}
            if (data.length>0){
                for(let i=0; i<data.length; i++){
                    try {
                        // console.log(data[i].phoneNumbers[0].number)
                        let number = [...(data[i].phoneNumbers[0].number)]
                        if (number[0] == '0'){
                            let country_code = ['+','2','5','6']
                            for( let i=0; i<=3; i++){
                                if (number[0] == '0'){
                                    number.splice(i,1,country_code[i])
                                }else {
                                    number.splice(i,0,country_code[i])
                                }
                            }
                        }
                        for(let i = 0; i < number.length; i++){
                            if ( number[i] === " " ){
                                number.splice(i,1)
                            }
                            
                        }
                        official_numbers[number.join('')] = data[i].firstName
                    } catch (error) {
                    }
                }
                
            }
            // console.log(official_numbers)
            return official_numbers

        }
    }

static validate_numbers(official_numbers , token , Debug){
    let matched_data = []
    axios({
        method : 'POST',
        url : Debug ? ('http://192.168.43.232:8040/Check_contact_list') : ('https://multix-fun.herokuapp.com/Check_contact_list'),
        data : {'Contacts' : official_numbers},
        headers : { 
          'content-type' : 'application/json',
          'Authorization': 'Token ' + token ,
      }
    }).then((response) => {
        if (response.status === 200){
            //console.log(response.data)
            matched_data = response.data
            
        }
    } , ()=>{
        matched_data = false
    } 
     )
     return matched_data
}

static generate_thumbnail_chat(contacts_list  , Server_id ){
    if (contacts_list[0].Server_id){
        return false
    }else {
        for(let i = 0; i<contacts_list.length; i++){
            if(Server_id == contacts_list[i].id){
                return contacts_list[i].Profile_photo
            }
        }
    }
   
}
static async get_chats_database(server_list){
    const db = SQLite.openDatabase('Fun_database.db')
    let chats_database = []
    db.transaction((tx)=>{
        tx.executeSql('SELECT * FROM Chats_contacts',[],(tx , Result_set)=>{
         chats_database =  Result_set.rows._array
         if (server_list.length > 0){
            return Result_set.rows._array
         } else {
            //console.log(chats_database)
            return chats_database
         }
        },(error)=>{})
    },(error)=>{},()=>{})
}


static update_db_connes(server_list , database_list){
    let remainders = server_list
    let database_remainders = database_list
    for(let i=0; i<=database_list.length; i++){
         if (i == database_list.length){
             const db = SQLite.openDatabase('Fun_database.db')
             db.transaction((tx)=>{
                 for(let f=0; f<remainders.length; f++){
                     if (remainders[f]){
                         tx.executeSql('INSERT INTO Chats_contacts (Name , Contact , Server_id) VALUES (?,?,?)',
                         [remainders[f].Name , remainders[f].Contact , remainders[f].id],(tx , Result_set)=>{},(error)=>{})
                     }
                 }
                 for(let g=0; g<database_remainders.length; g++){
                     if(database_remainders[g]){
                         tx.executeSql('DELETE FROM Chats_contacts WHERE Server_id = ?' , [database_remainders[g].Server_id] , (tx,result)=>{},(error)=>{})
                     }
                 }
             },(error)=>{},()=>{})
             
         } else {
             let item = database_list[i]
             const db = SQLite.openDatabase('Fun_database.db')
             db.transaction((tx)=>{
                 for(let n=0; n<server_list.length; n++){
                     // Checkin whether the contact already exists in the database
                     if (item['Server_id'] == server_list[n].id){
                          remainders.splice(n,1,false)
                          database_remainders.splice(i,1,false)
                         // Checking whether the Name is still valid for that particular user else we also update 
                          if( item['Name'] !== server_list[n].Name){
                                  for(let i=0; i<server_list.length; i++){
                                      if (server_list[i] !== false ){
                                          tx.executeSql('UPDATE Chats_contacts SET Name = ? WHERE Server_id = ?',
                                          [ server_list[n].Name , item['Server_id'] ],(tx , Result)=>{},(error)=>{})
                                      }
                                  }
                                   
                         }
                         // Checking whether the Contact is still valid for thst user else it is also changed 
                         if( item['Contact'] !== server_list[n].Contact){
                                  for(let i=0; i<server_list.length; i++){
                                      if (server_list[i] !== false ){
                                          tx.executeSql('UPDATE Chats_contacts SET Contact = ? WHERE Server_id = ?',
                                          [ server_list[n].Contact , item['Server_id'] ],(tx , Result)=>{},(error)=>{})
                                      }
                                  }
                          }
                         
                       
                     }
                 }
             })
            
         }
     
    }
}

static async insert_chats_connes(chat){
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('INSERT INTO Chats_contacts (Name , Contact , Server_id) VALUES (?,?,?)' , [chat.Name , chat.Contact , chat.Server_id],(tx , Result_set)=>{

        },(error)=>{})
    },(error)=>{},()=>{})
}

static async store_received_media(url , type){ 
    const fun_media = FileSystem.documentDirectory + 'Multix fun/Received/' + ('Multix '+type) + ' /'
    const fun_media_info = await FileSystem.getInfoAsync(fun_media)
    if (fun_media_info.exists){
        let file_uri = await FileSystem.downloadAsync(url , fun_media + url.split('/').pop() )
        // await MediaLibrary.createAssetAsync(file_uri)
    } else {
        await FileSystem.makeDirectoryAsync(fun_media , { intermediates : true })
        let file_uri = await FileSystem.downloadAsync(url , fun_media + url.split('/').pop() )
        // await MediaLibrary.createAssetAsync(file_uri)
    }
    return fun_media + url.split('/').pop()
}

static async replace_url_database(Muk , url){
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('UPDATE Messages SET Message=? WHERE Muk=?',
        [url , Muk],(tx , result)=>{},(error)=>{})
    },(error)=>{},()=>{})
}



static async update_message_progress(Muk , progress){
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('UPDATE Messages SET Status=? WHERE Muk=?',
        [progress , Muk],(tx,result)=>{},(error)=>{})
    },(error)=>{},()=>{})
}

static async update_seen_status_message(Muk){
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('UPDATE Messages SET Seen=? WHERE Muk=?' , [true , Muk])
    },(error)=>{},()=>{})
}

static async update_status_message(Muk , Status){
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('UPDATE Messages SET Status=? WHERE Muk=?' , [Status , Muk])
    },(error)=>{},()=>{})
}

static async store_sent_message(file){
    let type = mime.lookup(file)
    const media_url = FileSystem.documentDirectory + 'Multix fun/Sent/' + ('Multix '+type.split('/')[0]) + '/'
    const info = await FileSystem.getInfoAsync(media_url)
    if (info.exists){
        await FileSystem.copyAsync({ from : file , to : media_url + file.split('/').pop() })
        // await MediaLibrary.createAssetAsync( media_url + file.split('/').pop())
    } else {
        await FileSystem.makeDirectoryAsync(media_url , { intermediates : true })
        await FileSystem.copyAsync({ from : file , to : media_url + file.split('/').pop() })
        // await MediaLibrary.createAssetAsync( media_url + file.split('/').pop())
    }
    return media_url + file.split('/').pop()
}   

static async default_setup_layout(){
    const defaults = {
        Icons_Color : '#ECCF42',
        Icons_surroundings : 'black',
        Top_navigation : '#121212',
        Bottom_navigation : '#121212',
        Message_component : 'blue',
        Sender_component : 'white',
        Online_color : 'green',
        Sender_text_color : 'black',
        Message_text_color : 'white',
        Bottom_navigation_icons_color : '#FFD700',
        Header_color : '#121212',
    }
    let values = []
    for(const [key,value] of Object.entries(defaults)){
        values.push(value)
    }
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('INSERT INTO Layout_settings (Icons_Color,Icons_surroundings,Top_navigation,Bottom_navigation,Message_component,Sender_component,Online_color,Sender_text_color,Message_text_color,Bottom_navigation_icons_color,Header_color) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [...values],(tx,result)=>{},(error)=>{})
    },(error)=>{},()=>{})
    return defaults
}

static async reset_theme_default(){
    const defaults = {
        Icons_Color : '#ECCF42',
        Icons_surroundings : 'black',
        Top_navigation : '#121212',
        Bottom_navigation : '#121212',
        Message_component : 'blue',
        Sender_component : 'white',
        Online_color : 'green',
        Sender_text_color : 'black',
        Message_text_color : 'white',
        Bottom_navigation_icons_color : '#FFD700',
        Header_color : '#121212',
    }
    let values = []
    for(const [key,value] of Object.entries(defaults)){
        values.push(value)
    }
    const db = SQLite.openDatabase('Fun_database.db')
    db.transaction((tx)=>{
        tx.executeSql('UPDATE Layout_settings SET Icons_Color=?,Icons_surroundings=?,Top_navigation=?,Bottom_navigation=?,Message_component=?,Sender_component=?,Online_color=?,Sender_text_color=?,Message_text_color=?,Bottom_navigation_icons_color=?,Header_color=? WHERE id = 1',
        [...values],(tx,result)=>{},(error)=>{})
    },(error)=>{},()=>{})
    return defaults

}

}



export default fun_database