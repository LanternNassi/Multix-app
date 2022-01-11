import React, { Component , useState , useEffect} from 'react'
import { View , Text , ScrollView , FlatList , TouchableOpacity , StyleSheet }  from 'react-native'
import { Avatar , Card , CheckBox} from 'react-native-elements' 
import { connect } from 'react-redux'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import Text_edit from '../components/business_editers/Text_edit.js'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import FormData, {getHeaders} from 'form-data';
import * as mime from 'react-native-mime-types'
import NumberFormat from 'react-number-format'




export function Gig_account (props) {
        const [ Type , setType ] = useState('')
        const [Dead_date , setDead_date] = new useState('')
        const [Mode , setMode] = useState('')
        //state for actions taken before and after setting images
        const [Action_1 , setAction_1] = useState(true)
        const [Action_2 , setAction_2] = useState(true)
        const [Action_3 , setAction_3] = useState(true)
        const [Action_4 , setAction_4] = useState(true)
        const match_gig = ()=>{
            const {Server_id} = props.route.params
            for(let i = 0; i<props.state.Business_profile.Gigs.length; i++){
                if(Server_id === props.state.Business_profile.Gigs[i].Gig_info.Server_id){
                    console.log(props.state.Business_profile.Gigs[i].Gig_info.Server_id)
                    return props.state.Business_profile.Gigs[i]
                }
            }
            return {}
        }
        const [info , setinfo] = useState(
            match_gig()
        )
        
        const get_proposals = () => {
            let final_list = []
            if (props.state.Contracts_proposals){
                for(let i =0; i<props.state.Contracts_proposals.length; i++){
                    if (props.state.Contracts_proposals[i].Gig_info.Name == info.Gig_info.Gig_name){
                        final_list.push(props.state.Contracts_proposals[i])
                    }
                }
            }
            return final_list
        }
       const [proposals , setproposals] = useState(get_proposals())
        // state for chosen images
        const [Chosen_image_1 , setChosen_image_1] = useState(info.Gig_info.ShowCase_1)
        const [Chosen_image_2 , setChosen_image_2] = useState(info.Gig_info.ShowCase_2)
        const [Chosen_image_3 , setChosen_image_3] = useState(info.Gig_info.ShowCase_3)
        const [Chosen_image_4 , setChosen_image_4] = useState(info.Gig_info.ShowCase_4)
        //State for editers
        const [Value , SetValue] = useState('')
        const [type , settype] = useState('')
        const [icon , seticon] = useState('')
        const [action , setaction] = useState({})
        const [name , setname] = useState('')
        const [negotiation , setnegotiation] = useState(info.Gig_info.Gig_negotiation)
        //State for information
        const push_image_to_database = async (url , official_name) =>{
            const db = SQLite.openDatabase('business_database.db')
            db.transaction((tx) => {
                tx.executeSql('UPDATE Gigs SET ? = ? WHERE Server_id = ?',
                [official_name,url,props.route.params['Server_id']],(tx) => {
                    console.log('update successfull')
                } , (error) =>{

                })
            } , (error) => {} , () => {})
        }

        const query_maker = (type) => {
            return 'UPDATE Gigs SET ' + type + ' = ? WHERE Server_id = ?'
        }

      
        
        const update_gig_case = (pic , official_name) => {
            let newImageUri = "file:///" + pic.split("file:/").join("")
            let final_pic = {
                uri : newImageUri,
                type : mime.lookup(newImageUri),
                name : newImageUri.split("/").pop()
            }
            const form_data = new FormData()
            form_data.append(official_name , final_pic)
            form_data.append('official_name' , official_name)
            props.state.request_business_form({
                data : form_data,
                method : 'PUT',
                url : props.route.params['Server_id']+'/gig_case_2'
            }).then(async (response) => {
                console.log(response.data)
                if (response.status == 202){
                    await push_image_to_database(newImageUri,official_name)
                    const gigs_directory = FileSystem.documentDirectory + 'Multix Gigs/' + info.Gig_info.Gig_name + '/ShowCase/'
                    await FileSystem.copyAsync({from : newImageUri , to : gigs_directory + final_pic.name})
                    const db = SQLite.openDatabase('Business_database.db')
                    db.transaction((tx)=>{
                        tx.executeSql(query_maker(official_name),[final_pic.uri,props.route.params['Server_id']],(tx,result)=>{
                            console.log(result)
                            props.update_redux(props.route.params['Server_id'],official_name,final_pic.uri)
                        },(error)=>{})
                    },(error)=>{},()=>{})
                }
            })
        }
        
        return (
            <ScrollView 
            contentContainerStyle = {{ 
                height : 1.84 * ScreenHeight,
                //flexGrow : 1
                

             }}
            style = {{flex : 1,
                //backgroundColor : 'red'

            }}
            >
                <View style = {styles.credentials}>
                    <View style = {{
                        height : 0.42 * ScreenHeight,
                        width : 0.38 * ScreenWidth,
                        justifyContent : 'flex-start',
                        alignItems : 'center',

                    }} >
                        
                        <Avatar rounded size = {'small'} containerStyle = {{ 
                            backgroundColor : 'transparent',
                            borderColor : 'black',
                            top : 0.088 * ScreenHeight,
                            zIndex : 1,
                            left : -(0.005 * ScreenWidth)
                        }} icon = {{ name : 'camera' , type : 'font-awesome', color : 'white' }} />
                        <Avatar source = {{uri : (Chosen_image_1) ? (Chosen_image_1):((Chosen_image_2)?(Chosen_image_2):((Chosen_image_3)?(Chosen_image_3):((Chosen_image_4)?(Chosen_image_4):(null))))}} rounded size = {'large'}/>
                        {
                            props.fun.Connected ? (
                            <View style = {styles.on_encloser}>
                                <View style = {styles.on}/>
                            </View>
                            ) : (<View/>)
                        }
                        
                    </View>
                    <View>
                        
                    <View style = {styles.word_credentials}>
                        <View style = {{
                            width : 0.6 * ScreenWidth,
                            height : 28,
                            flexDirection : 'row',
                            justifyContent : 'space-between',
                            alignItems : 'center'
                            
                        }}>
                        <Text style = {{
                            fontSize : 19,
                            fontWeight : 'bold'
                        }}>{ info.Gig_info.Gig_name }</Text>
                        <TouchableOpacity style = {styles.edit} onPress = {
                            () =>{
                                setaction('come out')
                                settype('Name of the gig')
                                SetValue(info.Gig_info.Gig_name)
                                setMode('General_info')
                                seticon('user')
                                setname('Gig_name')
                                props.notifier()

                            }
                        }>
                            <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>
                        </TouchableOpacity>
                        </View>
                        <View style = {{
                            flexDirection : 'row',
                            justifyContent : 'space-between',
                            alignItems : 'center',
                            width : 0.55 * ScreenWidth,
                            height : 28,
                            
                        }} >
                        <View style = {{

                            width : 0.4 * ScreenWidth,
                            height : 0.05 * ScreenHeight,
                            justifyContent : 'flex-start',
                            alignItems : 'center',
                            flexDirection : 'row',

                            
                        }}>
                            <Avatar icon = {{ name : 'map-marker' , type : "font-awesome" , color : 'black' }} rounded size = {'small'} />
                        <Text style = {{
                            fontSize : 12,
                            fontWeight : '700'
                        }}>{info.Gig_info.Gig_location}</Text>
                        
                    </View>
                    <TouchableOpacity style = {styles.edit} onPress = {
                        ()=>{
                                setaction('come out')
                                settype('Location')
                                SetValue(info.Gig_info.Gig_location)
                                setMode('General_info')
                                seticon('map-marker')
                                setname('Gig_location')
                                props.notifier()

                        }
                    }>
                            <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                        </TouchableOpacity>

                    </View>
                    <Text style = {{ 
                        fontWeight : '700'
                    }} >  Date of creation : {(info.Gig_info.Gig_date_of_creation).slice(0,10)}</Text>
                    <View style = {{
                        flexDirection : 'row',
                        justifyContent : 'space-between',
                        alignItems : 'center',
                        height : 28,
                        width : 0.55 * ScreenWidth,
                    }} >
                    <View style = {styles.contacts }>
                        <Avatar icon = {{ name : 'phone' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded />  
                    <Text>{props.state.Business_profile.Account.Contact}</Text>
                    </View>
                    <TouchableOpacity style = {styles.edit} onPress = {
                        ()=>{
                                setaction('come out')
                                settype('Contact')
                                setMode('General_info')
                                SetValue(props.state.Business_profile.Account.Contact)
                                seticon('phone')
                                props.notifier()

                        }
                    }>
                            <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                        </TouchableOpacity>

                    </View>
                     <View style = {styles.rating}> 
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (props.state.Business_profile['Account'].Rating > 0 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (props.state.Business_profile['Account'].Rating >= 1 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (props.state.Business_profile['Account'].Rating >= 2 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (props.state.Business_profile['Account'].Rating >= 3 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (props.state.Business_profile['Account'].Rating >= 4 ? ('gold'):('black')) }} rounded />  
                     </View>
                     <View style = {{
                         flexDirection : 'row',
                         justifyContent : 'space-between',
                         alignItems : 'center',
                         height : 28,
                         width : 0.55 * ScreenWidth,
                     }}>
                     <View style = {{ ...styles.contacts , borderWidth : 0  }}>
                         <Text style = {{ fontWeight : '700' }}> Salary: </Text>
                        <NumberFormat value = { info.Gig_info.Gig_salary } displayType = {'text'}
                         thousandSeparator = {true}
                         prefix = {'shs.'}
                            renderText = {(value , props) => (
                                <Text style = {{left : 20}}> {value} </Text>
                            )}
                            />
                     </View>
                     <TouchableOpacity style = {styles.edit} onPress = {
                         ()=>{
                            setaction('come out')
                            settype('Salary')
                            SetValue(info.Gig_info.Gig_salary)
                            setMode('General_info')
                            seticon('user')
                            setname('Gig_salary')
                            props.notifier()

                        }
                     }>
                        <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>
                    </TouchableOpacity>
                     </View>
                     <View style = {{
                         width : 0.43 * ScreenWidth,
                         height : 20,
                         flexDirection : 'row',
                         justifyContent : 'space-between',
                         alignItems : 'center',

                     }}>
                         
                         <Text style = {{
                             fontSize : 15,
                             fontWeight : 'bold',
                         }}>  Payments : </Text>
                         <Text>{info.Gig_info.Gig_payment_mode}</Text>
                     </View>

                    </View>


                    </View>
                </View>

                <View style = {styles.part_2}>
                    <View style = {{
                        flexDirection : 'column',
                        justifyContent : 'space-around',
                        alignItems : 'center',
                        maxHeight : 0.4 * ScreenHeight,
                        width : ScreenWidth,
                    }}>
                        <View style = {{
                            
                            width : 0.6 * ScreenWidth,
                            height : 28,
                            flexDirection : 'row',
                            justifyContent : 'space-around',
                            alignItems : 'center',
                        }}>
                        <Text style = {{
                            fontWeight : 'bold',
                            fontSize : 18
                        }}>DESCRIPTION</Text>
                        <TouchableOpacity style = {styles.edit} onPress = {
                            ()=>{
                                setaction('come out')
                                settype('Description')
                                SetValue(info.Gig_info.Gig_description)
                                seticon('map-marker')
                                setMode('General_info')
                                setname('Gig_description')
                                props.notifier()

                            }
                        }>
                            <Avatar icon = {{ name : 'pencil' , size : 17 , color : 'black' , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        </View>
                        <View style = {{
                        
                            flexWrap : 'nowrap',
                            //flexGrow : 1,
                            maxWidth : ScreenWidth,
                            

                        }}>
                            <Text style = {{
                                left : 0.04 * ScreenWidth
                            }}>
                               {info.Gig_info.Gig_description.length > 210 ? info.Gig_info.Gig_description.slice(0,210) : info.Gig_info.Gig_description }
                            </Text>
                        </View>

                    </View>
                    <View style = {styles.Portfolio}>
            <Text style = {{
                fontSize : 18,
                fontWeight : 'bold',
                paddingBottom : 15,
            }}> ShowCase </Text>
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
                                            update_gig_case(result.uri,'ShowCase_1')
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
                                            update_gig_case(result.uri,'ShowCase_2')
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
                                            update_gig_case(result.uri,'ShowCase_3')
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
                                            update_gig_case(result.uri , 'ShowCase_4')
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
                <View style = { styles.extra_info }>
                        <View style = {{
                            width : 0.98 * ScreenWidth,
                            maxHeight : 0.3 * ScreenHeight,
                            flexDirection : 'row',
                            justifyContent : 'space-between',
                            alignItems : 'center',
                        }}>
                            <View style = {styles.categories}>
                                <Text style = {{
                                    fontWeight : 'bold',
                                }}> Deadline </Text>
                                <View style = {{
                                   width : 0.3 * ScreenWidth,
                                   height : 24,
                                   justifyContent : 'center',
                                   alignItems : 'center'
                                }}>
                                    <TouchableOpacity style = { styles.chips }>
                                        <Text>{info.Gig_info.Gig_deadline}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style = {styles.categories}>
                                <Text style = {{ fontWeight : 'bold' }}> Expiration Date </Text>
                                <View style = {{
                                   width : 0.3 * ScreenWidth,
                                   height : 24,
                                   justifyContent : 'center',
                                   alignItems : 'center'
                                }}>
                                    <TouchableOpacity style = { styles.chips }>
                                        <Text>{ info.Gig_info.Gig_date_of_expiration ? info.Gig_info.Gig_date_of_expiration.slice(0,10) : info.Gig_info.Gig_expiration_date.slice(0,10) }</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style = {styles.categories}>
                                <Text style = {{ fontWeight : 'bold' }}> Category </Text>
                                <View style = {{
                                   width : 0.3 * ScreenWidth,
                                   height : 24,
                                   justifyContent : 'center',
                                   alignItems : 'center'
                                }}>
                                    <TouchableOpacity style = { styles.chips }>
                                        <Text>{info.Gig_info.Gig_genre}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </View>
                        <View style = {{
                            flexDirection : 'column',
                            maxHeight :  ScreenHeight,
                            width : ScreenWidth,
                            flexWrap : 'nowrap',
                            top : 0.15 * ScreenWidth,

                        }}>
                        <Text style = {{
                            fontSize : 18,
                            fontWeight : '700',
                        }}>
                            Additional information
                            </Text>  
                            <View style = {{
                                flexDirection : 'row',
                                justifyContent : 'space-around',
                                alignItems : 'center',
                                flexWrap : 'nowrap',
                                width :ScreenWidth,
                                maxHeight : ScreenHeight,
                            }}>
                                <FlatList 
                                    data = {info.Gig_adds}
                                    horizontal = {true}
                                    contentContainerStyle = {{ maxHeight : ScreenHeight, paddingBottom : 0.05 * ScreenWidth }}
                                    ListEmptyComponent = {()=>(
                                        <View style = {{
                                            height : 0.1 * ScreenHeight,
                                            justifyContent : 'center',
                                        }}>
                                        <Text> No additional information added </Text>
                                        </View>
                                    )}
                                    renderItem = {(item , index) =>(
                                        <TouchableOpacity style = {styles.chips}>
                                            <Text>{item.item.Name}</Text>
                                        </TouchableOpacity>
                                    )}
                                 />
                                 
                            </View>  

                        </View>
                        <View style = {{
                            width :  ScreenWidth,
                            top : 0.2 * ScreenWidth,
                        }}>
                                <CheckBox title = {
                                        <View style = { styles.title }>
                                            <Avatar containerStyle = {{ elevation : 5 }} rounded source = {require('../assets/Notifications.png')} size = {'small'} />
                                            <Text style = {{ left : 20 , fontWeight : 'bold'  }}>Negotiable</Text>
                                        </View>
                                    }
                                onPress = {
                                    ()=>{
                                        
                                    }
                                }
                                checked = {info.Gig_info.Gig_negotiation}/>
                        </View>
                        <View style = {{
                            flexDirection : 'column',
                            maxHeight : ScreenHeight,
                            width : ScreenWidth,
                            flexWrap : 'nowrap',
                            top : 0.3 * ScreenWidth,
                        }}>
                        <Text style = {{
                            fontSize : 18,
                            fontWeight : '700',
                        }}>
                            Projects Proposals
                            </Text>  
                            <View style = {{
                                maxHeight : ScreenHeight,
                                flexDirection : 'row',
                                justifyContent : 'space-around',
                                alignItems : 'center',
                                flexWrap : 'nowrap',
                                width :ScreenWidth,
                            }}>
                                
                                <FlatList 
                                    data = {proposals}
                                    ListEmptyComponent = {
                                        ()=>(
                                            <View style = {{
                                                height : 0.2 * ScreenHeight,
                                                justifyContent : 'center',
                                            }}>
                                            <Text> No proposed projects yet for this gig </Text>
                                            </View>
                                        )
                                    }
                                    renderItem = {
                                        (item,index) => (
                                            <CheckBox  title = {
                                                <View style = { styles.title }>
                                                    <Avatar containerStyle = {{ elevation : 5 }} rounded source = {{ uri : item.item.Applicant_info.Profile_pic  }} size = {'small'} />
                                                    <Text style = {{ left : 20 , fontWeight : 'bold'  }}>{ (item.item.notification.Message).length > 30 ? item.item.notification.Message.slice(0,30) + '...' : item.item.notification.Message  }</Text>
                                                </View>
                                            }
                                        onPress = {
                                            ()=>{
                                                
                                            }
                                        }
                                        checked = {item.item.Deal_info.Approved}/>
                                        )
                                    }
                                />
                                
                            </View>  
                        </View>
                        <View style = {{
                            flexDirection : 'column',
                            maxHeight : ScreenHeight,
                            width : ScreenWidth,
                            flexWrap : 'nowrap',
                            top : 0.3 * ScreenWidth,
                            //backgroundColor : 'green'
                        }}>
                        <Text style = {{
                            fontSize : 18,
                            fontWeight : '700',
                        }}>
                            Transactions
                            </Text>  
                            <View style = {{
                                //height : 0.125 * ScreenHeight,
                                flexDirection : 'row',
                                justifyContent : 'space-around',
                                alignItems : 'center',
                                flexWrap : 'nowrap',
                                width :ScreenWidth,
                                maxHeight : ScreenHeight,
                            }}>
                                
                                {
                                    (info.Gig_transactions.length > 0)?(
                                        
                                        info.Gig_transactions.map((item,index)=>(
                                            <CheckBox  title = {
                                                <View style = { styles.title }>
                                                    <Avatar containerStyle = {{ elevation : 5 }} rounded source = {require('../assets/Notifications.png')} size = {'small'} />
                                                    <Text style = {{ left : 20 , fontWeight : 'bold'  }}>{ item.Date_of_transaction.slice(0,10) }</Text>
                                                </View>
                                            }
                                        onPress = {
                                            ()=>{
                                                
                                            }
                                        }
                                        checked = {true}/>
                                        ))
                                    ):(
                                        <View style = {{
                                            height : 0.2 * ScreenHeight,
                                            justifyContent : 'center',
                                        }}> 
                                        <Text> No Transactions commited yet for this gig </Text>
                                        </View>
                                    )
                                
                                }
                                
                            </View>  

                        </View>
                     </View>

                { !props.state.business_profile_edit_done   ? <Text_edit effect = {'Gig'} mode = {Mode} name  = {name} id = {props.route.params['Server_id']} action = {action} type = {type} value = {Value} icon = {icon} /> : <View/> }               
                
            </ScrollView>
        )
    }

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state , fun}
}

const mapDispatchToProps = (dispatch) => ({
    notifier : () => dispatch({type : 'done' , decide : false }),
    update_redux : (Server_id,name,value)=>dispatch({type : 'update_business_profile_gig' , Server_id : Server_id, name : name , value : value})

    
})

export default connect(mapStateToProps, mapDispatchToProps)(Gig_account)

const styles = StyleSheet.create({
    credentials : {
        width : ScreenWidth,
        height : 0.38 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
        backgroundColor : 'white',
        //elevation : 15,
        //top : 0.05 * ScreenHeight
    },
    on : {
        height : 8,
        width : 8 , 
        borderRadius : 4,
        backgroundColor : 'green',
    },
    title : {
        left : 20,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    
        
    },
    on_encloser : {
        position : 'absolute',
        height : 12,
        width : 12,
        borderRadius : 6,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        top : 0.16 * ScreenHeight,
        left : 0.22 * ScreenWidth

    },
    word_credentials : {
        width : 0.6 * ScreenWidth,
        height : 0.32 * ScreenHeight,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'flex-start',
    },
    contacts : {
        width : 0.35 * ScreenWidth,
        height : 20,
        borderRadius : 9,
        borderWidth : 0.5,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center'
    },
    rating : {
        height : 25 ,
        width : 0.35 * ScreenWidth,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    edit : {
        height : 28,
        width : 28,
        borderRadius : 14,
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 0.5,
    },
    part_2  : {
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        backgroundColor : 'white',
        maxHeight : 7 * ScreenHeight,
    
    },
    Portfolio : {
        top : 0.2 * ScreenWidth,
        width : ScreenWidth,
        height : 0.3 * ScreenHeight,
        justifyContent : 'space-between',
        alignItems : 'center',
        
        
    },
    extra_info : {
        top : 0.3 * ScreenWidth,
        //height : 0.8 * ScreenHeight,
        //width : 0.95 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'flex-start',
        maxHeight : 1.2 *  ScreenHeight,
        //position : 'relative',
        //top : 0.15 * ScreenWidth,
        //bottom : 0.1 * ScreenWidth,
       //backgroundColor : 'white',
    
    },
    chips : {
        //flexGrow : 1,
        paddingBottom : 6,
        paddingLeft : 10,
        paddingRight : 10,
        paddingTop : 6,
        backgroundColor : 'rgba(0,40,0,0.1)',
        borderRadius : 20,
        top : 0.038 * ScreenWidth,
        

    },
    categories : {
        flexDirection : 'column',
        maxHeight : 0.2 * ScreenHeight,
        maxWidth : 0.48 * ScreenWidth,

    },
    info : {
        width : ScreenWidth,
        height : 0.
    }

    
})
