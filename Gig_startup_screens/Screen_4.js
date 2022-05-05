import React, { Component , useEffect , useState } from 'react'
import { View , TextInput , Text , ScrollView , StyleSheet , TouchableOpacity, Picker, Dimensions , BackHandler } from 'react-native'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Avatar , Card , Icon } from 'react-native-elements'
import { Sae , Fumi } from 'react-native-textinput-effects';
import { connect } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import TagInput from 'react-native-tags-input'
import FormData, {getHeaders} from 'form-data';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import Spinner from 'react-native-loading-spinner-overlay'
import business_database from '../redux/Database_transactions.js'
import * as MediaLibrary from 'expo-media-library';


export const Category = (props) => {
    const [open, setOpen] = useState(false);
    const [spin , setspin] = useState(false)
    const [value, setValue] = useState(null);
    const [Description , setDescription] = useState('')
    const [pressed , setpressed] = useState(false)
    const [items, setItems] = useState([
        {label: 'Agriculture related gig', value: 'Agriculture'},
        {label: 'Constructions such as Architecture', value: 'Constructions'},
        {label: 'Education related', value: 'Education'},
        {label: 'Business Management', value: 'Business'},
        {label: 'Arts related', value: 'Arts'},
        {label: 'Health', value: 'Health'},
        {label: 'Technology (Tech such as Robotics etc)', value: 'Tech'}
    ]);
    const [ Type , setType ] = useState('')
    const [tags_Pref , settags_Pref] = useState({
        tag : '',
        tagsArray : []
    })
    const [tagsColor , settagsColor] = useState('#3ca897')
    const [tagsText , settagsText] = useState('#fff')

    const updateTagState_Preferences = (state) => {
        settags_Pref(state)
    };

    const store_gig_to_database = (profile , Additional_info , account_id) => {
        const db = SQLite.openDatabase('Business_database.db')
        let Server_id = null
        db.transaction((tx)=>{
            tx.executeSql(
                'INSERT INTO Gigs (Account_id,Server_id,Gig_type,Gig_name,Gig_genre,Gig_description,Gig_date_of_creation,Gig_deadline,Gig_date_of_expiration,Gig_payment_mode,Gig_salary,Gig_location,Gig_negotiation,ShowCase_1,ShowCase_2,ShowCase_3,ShowCase_4) '   
                 +'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [account_id , ...profile],(tx,Result_gig) => {
                console.log('Gig inserted successfully at ' + Result_gig.insertId )
                Server_id = profile[0]
                if (profile[1] === 'Hiring' || profile[1] === 'Selling deals'){
                    for(let i = 0; i<Additional_info.length; i++){
                        tx.executeSql(
                            'INSERT INTO Gig_additional_info (Gig_id , Name ) VALUES (?,?)', 
                            [Result_gig.insertId , Additional_info[i]], (tx , Result) => {
                                console.log('Additional_info inserted successfully')
                            },(error) => {console.log(error)})
                    }
                    
                }

            }, error => {
                console.log(error)
            })
        },
        (error)=>{

        },
        ()=>{
            console.log('Success')
        })
        return Server_id
    }


    const push_gig_images_to_folder = async (pics , name) => {
        const gigs_directory = FileSystem.documentDirectory + 'Multix Gigs/' + name + '/ShowCase/'
        const gig_pic_directory = await FileSystem.getInfoAsync(gigs_directory)
        const saved_pics = []
        if (!gig_pic_directory.exists){
            await FileSystem.makeDirectoryAsync(gigs_directory , {intermediates : true})
            for(let i = 0; i<pics.length; i++){
                await FileSystem.copyAsync({from : pics[i].uri , to : gigs_directory + pics[i].name})
                // await MediaLibrary.createAssetAsync(gigs_directory + pics[i].name)
                saved_pics.push(gigs_directory + pics[i].name)
            }
        }
        return saved_pics
    }

    useEffect(()=>{
        const {type} = props.route.params
        setType(type)
    } , [  ])
    return (
        <ScrollView>
            <ScrollView contentContainerStyle = {{
                
            }} style = {styles.container}>
             <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ width : 0.9 * ScreenWidth, justifyContent : 'space-between' , alignItems : 'center' , height : 0.14 * ScreenHeight }}>
                <Avatar rounded icon = {{ name : 'check' , size : 18 , type : 'font-awesome' }} containerStyle = {{
                    backgroundColor : 'green'
                }} />
                <Text style = {styles.disclaimer}>Please take a step to make your gig stand out by carefully filling the steps</Text>
            </View>
            <View style = {styles.input_container} >
            <Fumi
                style = {{ width : ScreenWidth-10 , backgroundColor : 'white'}}
                label={'Briefly give a description of the gig'}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                height = {0.28 * ScreenHeight}
                iconColor={'black'}
                inputPadding={17}
                labelHeight={24}
                // active border height
                // TextInput props
                autoCapitalize={'none'}
                autoCorrect={true}
                inputStyle = {{ color : 'black',fontSize:15 }}
                multiline = {true}
                onChangeText = {
                    (text) =>{
                        setDescription(text)
                    }
                }
            />
             <Spinner
                visible={spin}
                textContent={'Creating Gig ...'}
                textStyle={{
                    color : 'white',
                    fontSize : 16,
                }}
            />
            <View style = {{
                height : 0.11 * ScreenHeight,
                justifyContent : 'space-between',
                alignItems : 'flex-start'
            }}>
                <Text style = {{
                    fontSize : 13,
                    fontWeight : 'bold'
                }}>Select a category in which the gig falls</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style = {{ width : 0.9 * ScreenWidth }}
                />
            </View>
            
            

  </View>
  <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        <TouchableOpacity onPress = {
            () => {
                if (!pressed){
                    setpressed(true)
                    props.send_description(Description)
                    props.send_genre(value)
                    setspin(true)
                    setTimeout(()=>{
                        try{
                            const form_data = new FormData()
                            const pics = []
                            if (props.state.Gig_sign_up.images){
                                for(let i = 0 ; i <= 3 ; i++){
                                    if (props.state.Gig_sign_up.images['ShowCase_'+(i+1)]){
                                        form_data.append('ShowCase_'+(i+1) , props.state.Gig_sign_up.images['ShowCase_'+(i+1)])
                                        pics.push(props.state.Gig_sign_up.images['ShowCase_'+(i+1)])
                                    }
                                }
                            }
                           
                            const Data = {}
                            Data['word_info'] = {...props.state.Gig_sign_up.word_info}
                            Data['Additional_info'] = props.state.Gig_sign_up.Additional_info?([...props.state.Gig_sign_up.Additional_info]) : ([])
                           
                            props.state.request_business_json({
                                method : 'POST',
                                url : '/create_gig',
                                data : Data
                            }).then(async (response) =>{
                                if (response.status === 201){
                                    console.log(response.data)
                                    const saved_pictures = await push_gig_images_to_folder(pics,props.state.Gig_sign_up.word_info.Gig_name)
                                    const d = response.data['Gig_account']
                                    const profile = [
                                        response.data['Gig_id'] , d.Gig_type, d.Gig_name,d.Gig_genre,d.Gig_description,d.Gig_date_of_creation,d.Gig_deadline,d.Gig_expiration_date,d.Gig_payment_mode, d.Gig_salary,d.Gig_location,d.Gig_negotiation,
                                        (pics[0]) ? saved_pictures[0] : null ,
                                        (pics[1]) ? saved_pictures[1] : null ,
                                        (pics[2]) ? saved_pictures[2] : null ,
                                        (pics[3]) ? saved_pictures[3] : null ,
                                    ]
                                    const add_info = props.state.Gig_sign_up.Additional_info ? props.state.Gig_sign_up.Additional_info : []
                                    const gig = {}
                                    const info = response.data['Gig_account']
                                    info['Server_id'] = response.data['Gig_id']
                                    if (props.state.Gig_sign_up.images){
                                        info['ShowCase_1'] = props.state.Gig_sign_up.images['ShowCase_1'] ? (props.state.Gig_sign_up.images['ShowCase_1'].uri) : (null)
                                        info['ShowCase_2'] = props.state.Gig_sign_up.images['ShowCase_2'] ? (props.state.Gig_sign_up.images['ShowCase_2'].uri) : (null)
                                        info['ShowCase_3'] = props.state.Gig_sign_up.images['ShowCase_3'] ? (props.state.Gig_sign_up.images['ShowCase_3'].uri) : (null)
                                        info['ShowCase_4'] = props.state.Gig_sign_up.images['ShowCase_4'] ? (props.state.Gig_sign_up.images['ShowCase_4'].uri) : (null)
                                    } else {
                                        info['ShowCase_1'] = null
                                        info['ShowCase_2'] = null
                                        info['ShowCase_3'] = null
                                        info['ShowCase_4'] = null
                                    }
                                   
                                    gig['Gig_info'] = info
                                    const adds_info = []
                                    if (props.state.Gig_sign_up.Additional_info){
                                        for(let i = 0; i<add_info.length; i++){
                                            adds_info.push({'Name' : add_info[i]})
                                        }
                                    }
                                    gig['Gig_adds'] = adds_info
                                    gig['Gig_applicants'] = []
                                    gig['Gig_projects'] = []
                                    gig['Gig_transactions'] = []
                                    props.store_created_gig(gig)
                                    if (props.state.Gig_sign_up.images){
                                        props.state.request_business_form({
                                            method : 'PUT',
                                            url : response.data['Gig_id'] + '/gig_case',
                                            data : form_data,
                                        }).then((response)=>{ 
                                            let id = store_gig_to_database(profile,add_info,1)
                                            setTimeout(()=>{
                                                setspin(false)
                                                props.state.navigation.navigation.navigate('Gig',{Server_id : info.Server_id})
                                            },1000)
                                        })
                                    } else {
                                        setspin(false)
                                        props.state.navigation.navigation.navigate('Gig',{Server_id : info.Server_id})

                                    }
                                  
                                }
                            })

                        } catch(ex) {
                            console.log(ex)
                        }
                        
                    } , 1000)
                    
                }


            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Finalize</Text>
        </TouchableOpacity>

  </View>
  </View>
            
        </ScrollView>
            
        </ScrollView>
    )
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
    
}

const mapDispatchToProps = (dispatch) => ({
    send_description : (Description) => dispatch({type : 'gig_word_info' , key : 'Gig_description' , value : Description}),
    send_genre : (Genre) => dispatch({type : 'gig_word_info' , key : 'Gig_genre' , value : Genre}),
    store_created_gig : (gig) => dispatch({type : 'after_creating_gig' , gig : gig}),

    
})

export default connect(mapStateToProps, mapDispatchToProps)(Category)


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
  

    },
    


})