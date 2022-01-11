import React, { Component } from 'react';
import {View , Text , StyleSheet , TouchableOpacity , ScrollView, FlatList } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import * as Animatable from 'react-native-animatable'
import Text_edit from '../../components/business_editers/Text_edit.js'
import Text_chips from '../../components/business_editers/Text_chips.js'
import * as SQLite from 'expo-sqlite'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import FormData, {getHeaders} from 'form-data';
import * as mime from 'react-native-mime-types'

export class Profile extends Component {
    state = {
        action : null,
        opened : '',
        value : '',
        type : '',
        icon : '',
        effect : 'business profile',
        name : '',
        mode : '',
        tags : [],
        db_table : '',
        chips : false,
        profile_info : {
            Account : this.props.state.Business_profile['Account'] , Billing : this.props.state.Business_profile['Billing information'] ,
            Certifications : this.props.state.Business_profile['Certifications'] , 
            Languages : this.props.state.Business_profile['Languages'] ,
            Transactions : [(this.props.state.Business_profile['Transactions']) ? (this.props.state.Business_profile['Transactions']) : ([])] ,
             Contracts : [(this.props.state.Business_profile['Contracts']) ? (this.props.state.Business_profile['Contracts']):([])],
            Gigs : [...this.props.state.Business_profile['Gigs']],
        },

    }

    update_profile_pic = (url) => {
        const newImageUri = "file:///" + url.split("file:/").join("")
        const processed_image = {
            uri : newImageUri,
            type : mime.lookup(newImageUri),
            name : newImageUri.split("/").pop()
        }
        const form = new FormData()
        form.append('Pic' , processed_image)
        this.props.state.request_business_form({
            method : 'PUT',
            url : 'update_profile_pic',
            data : form
        }).then((response) => {
            if (response.status === 202){
                const db = SQLite.openDatabase('Business_database.db')
                db.transaction((tx)=>{
                    tx.executeSql('UPDATE Business_account SET Profile_pic = ?',
                    [processed_image.uri],(tx,result) => {
                        console.log(result)
                        this.props.update_profile_account_redux('Profile_pic' , processed_image.uri)
                    },(error) => {})
                },(error) => {console.log(error)},()=>{})
            }
        })

    }
   
    render() {
        if (!this.state.profile_info.Account['Name']){
            return(
                <View>

                </View>    
            )
        } else {
            return (
                <View style = {{
                    flex : 1
                }}>
                <ScrollView style = {{            
                }}>
                    <View style = {styles.credentials}>
                        <View style = {{
                            height : 0.42 * ScreenHeight,
                            width : 0.38 * ScreenWidth,
                            justifyContent : 'flex-start',
                            alignItems : 'center',

                        }} >
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
                                                console.log('gotten')
                                                this.update_profile_pic(result.uri)
                                            }
                                        } catch (E) {
                                            console.log(E);
                                        }} else {
                                            console.log("No permissions")
                                        }

                                }
                            }
                             style = {{
                                backgroundColor : 'transparent',
                                borderColor : 'black',
                                top : 0.088 * ScreenHeight,
                                zIndex : 1,
                                left : -(0.005 * ScreenWidth)
                            }} >
                            <Avatar rounded size = {'small'} containerStyle = {{ 
                                
                            }} icon = {{ name : 'camera' , type : 'font-awesome', color : 'white' }} />
                            </TouchableOpacity>
                            <Avatar source = { this.state.profile_info.Account.Profile_pic? ({ uri : this.state.profile_info.Account.Profile_pic}) : (require('../../assets/Male_no_profile_pic.jpg'))} rounded size = {'large'}/>
                            {
                                this.props.fun.Connected ? (
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
                                fontSize : 20,
                                fontWeight : 'bold'
                            }}>{this.state.profile_info.Account.Name}</Text>
                            <TouchableOpacity style = {styles.edit} onPress = {
                                () =>{
                                    this.props.notifier()
                                    this.setState({type : 'Name' , 
                                    value : this.state.profile_info.Account.Name , name : 'Name',
                                    icon : 'user' , mode : 'Business info'})
                                    this.setState({action : 'come out' , chips : 'text' })
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
                                fontSize : 15,
                                fontWeight : '700'
                            }}>{ this.state.profile_info.Account.Place_of_residence }</Text>
                            
                        </View>
                        <TouchableOpacity style = {styles.edit} onPress = {
                            ()=>{
                                this.props.notifier()
                                this.setState({type : 'Location' , mode : 'Business info' , 
                                value : this.state.profile_info.Account.Place_of_residence , name : 'Place_of_residence',
                                icon : 'map-marker'})
                                this.setState({action : 'come out' , chips : 'text'})

                            }
                        }>
                                <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                            </TouchableOpacity>

                        </View>
                        <Text style = {{ 
                            fontWeight : '800'
                        }} >Date of creation : {this.state.profile_info.Account.Date_of_creation.slice(0,10)}</Text>
                        <View style = {{
                            flexDirection : 'row',
                            justifyContent : 'space-between',
                            alignItems : 'center',
                            height : 28,
                            width : 0.55 * ScreenWidth,
                        }} >
                        <View style = {styles.contacts }>
                            <Avatar icon = {{ name : 'phone' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded />  
                            <Text>{this.state.profile_info.Account.Contact}</Text>
                        </View>
                        <TouchableOpacity style = {styles.edit} onPress = {
                            ()=>{
                                this.props.notifier()
                                this.setState({type : 'Contact' ,
                                value : this.state.profile_info.Account.Contact , name : 'Contact',
                                icon : 'phone' , mode : 'Business info'})
                                this.setState({action : 'come out' , chips : 'text'})
                            }
                        }>
                                <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                            </TouchableOpacity>

                        </View>
                        <View style = {styles.rating}> 
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Account.Rating > 0 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Account.Rating >= 1 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Account.Rating >= 2 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Account.Rating >= 3 ? ('gold'):('black')) }} rounded />  
                            <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Account.Rating >= 4 ? ('gold'):('black')) }} rounded />  
                        </View>
                        <View style = {{ ...styles.contacts , borderWidth : 0  }}>
                            <Text style = {{ fontWeight : '700' }}> Contracts: </Text>
                            <Text>{ (this.state.profile_info.Contracts) ? this.state.profile_info.Contracts.length : 0 } </Text>
                        </View>

                        </View>


                        </View>
                    </View>
                    <View style = {styles.statistics}>
                    <View style = {{
                                width : 0.9 * ScreenWidth,
                                height : 28,
                                flexDirection : 'row',
                                justifyContent : 'space-between',
                                alignItems : 'center'
                                
                            }}>
                            <Text style = {{
                                fontSize : 20,
                                fontWeight : 'bold'
                            }}>DESCRIPTION</Text>
                            <TouchableOpacity style = {styles.edit} onPress = {
                                ()=>{
                                    this.props.notifier('text')
                                    this.setState({type : 'Description' ,
                                    mode : 'Business info', name : 'Description',
                                    value : this.state.profile_info.Account.Description , icon : 'user'})
                                    this.setState({action : 'come out' , chips : 'text'})
                                }
                            }>
                                <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                            </TouchableOpacity>
                            </View>
                            <View style = {{
                                alignContent : 'center',
                                flexWrap : 'nowrap',
                                maxHeight : 0.9 * ScreenHeight,
                                maxWidth :  0.9 * ScreenWidth,
                                left : 10,
                            }}>     
                            <Text>
                                {this.state.profile_info.Account.Description.slice(0,250)}
                            </Text>        
                            
                            </View>
                            <View style = {styles.divider}/>
                            <View style = {{
                                height : 0.22 * ScreenHeight,
                                width : ScreenWidth,
                                flexDirection : 'column',
                                justifyContent : 'space-between',
                                alignItems : "center",
                            }}>
                                <Text style = {{
                                    fontSize : 23,
                                    fontWeight : '700'
                                }}>Gigs</Text>
                            <FlatList
                                data = {this.props.state.Business_profile.Gigs} 
                                horizontal = {true}
                                ListEmptyComponent = {
                                    () => (
                                        <Text style = {{
                                            fontSize : 17
                                        }}>No Gigs added yet </Text>
                                    )
                                }
                                alwaysBounceHorizontal = {true}
                                showsHorizontalScrollIndicator = {false}
                                contentContainerStyle = {styles.list}
                                renderItem = {
                                    (item) => (
                                        <TouchableOpacity style = {styles.item} onPress = {
                                            () => {
                                                this.props.state.navigation.navigation.navigate('Gig',{Server_id : item.item.Gig_info.Server_id})
                                            }
                                        }>
                                            <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                                            <Avatar rounded containerStyle  = {{
                                                position : 'absolute',
                                                zIndex : 1,
                                                elevation : 9
                                            }} icon = {{ name : 'edit' , size : 17 , color : 'white'  }} />
                                            <Avatar rounded containerStyle = {{elevation : 5,}} source = {{uri : item.item.Gig_info.ShowCase_1}} size = {'medium'}/>
                                            </View>
                                                <Text style = {{fontWeight : '600', color : 'black'}}> { (item.item.Gig_info.Gig_name).length > 7 ? ((item.item.Gig_info.Gig_name).slice(0,7) + '...')
                                                :(item.item.Gig_info.Gig_name) } </Text>
                                        </TouchableOpacity>
                                    )
                                } 
                />

                </View>
                <View style = {styles.divider}/>
            <View style = {{
                height : 0.35 * ScreenHeight,
                width : ScreenWidth,
                justifyContent : 'space-between',
                alignItems : 'center',
                    }}>         
                        <View style = {styles.group}>       
                                        <View style = {{
                                            width : 0.9 * ScreenWidth,
                                            height : 28,
                                            flexDirection : 'row',
                                            justifyContent : 'space-between',
                                            alignItems : 'center'
                                            
                                        }}>
                                                <Text style = {{
                                                    fontSize : 20,
                                                    fontWeight : 'bold'
                                                }}>EDUCATION</Text>
                                                <TouchableOpacity style = {styles.edit} onPress = {
                                                    ()=>{
                                                        this.props.notifier()
                                                        this.setState({type : 'Education' , db_table : 'Certifications', mode : 'Certifications',tags : this.props.state.Business_profile.Certifications ,  icon : 'user'})
                                                        this.setState({action : 'come out' , chips : 'chips' })
                                                    }
                                                }>
                                                    <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                                                </TouchableOpacity>
                                        </View>
                                        <View style = {{...styles.tags }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator = {false}
                                            horizontal = {true}
                                            data = {this.props.state.Business_profile.Certifications}
                                            contentContainerStyle = {{
                                                width : 0.99 * ScreenWidth,
                                                justifyContent : 'space-around',
                                                paddingBottom : 15,
                                            }}
                                            renderItem = {(item , index)=>(
                                                <View style = {styles.chips}>
                                                    <Text>{item.item}</Text>
                                                </View>
                                            )}
                                        />
                                        </View>
                                        
                                </View>
                        <View style = {styles.group}>       
                                        <View style = {{
                                            width : 0.9 * ScreenWidth,
                                            height : 28,
                                            flexDirection : 'row',
                                            justifyContent : 'space-between',
                                            alignItems : 'center',      
                                        }}>
                                                <Text style = {{
                                                    fontSize : 20,
                                                    fontWeight : 'bold'
                                                }}>SKILLS</Text>
                                                <TouchableOpacity style = {styles.edit} onPress = {
                                                    ()=>{
                                                        function prefs_determine(prefs){
                                                            const tags = []
                                                            for(let i = 1; i<5; i++){
                                                                if (prefs['Preference_'+(i)]){
                                                                    tags.push(prefs['Preference_'+(i)])
                                                                }
                                                            }
                                                            return tags
                                                        }
                                                        this.props.notifier()
                                                        this.setState({type : 'Skills' , db_table : 'Business_account' , tags :[
                                                            ...prefs_determine(this.state.profile_info.Account)
                                                        ] , mode : 'Business info' , icon : 'user'})
                                                        this.setState({action : 'come out' , chips : 'chips' })
                                                    }
                                                }>
                                                    <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>
                                                </TouchableOpacity>
                                        </View>
                                        <View style = {styles.tags}>
                                            {
                                                this.state.profile_info.Account.Preference_1 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Account.Preference_1}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Account.Preference_2 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Account.Preference_2}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Account.Preference_3 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Account.Preference_3}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Account.Preference_4 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Account.Preference_4}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }
                                        </View>
                            </View>
                        <View style = {styles.group}>       
                                        <View style = {{
                                            width : 0.9 * ScreenWidth,
                                            height : 28,
                                            flexDirection : 'row',
                                            justifyContent : 'space-between',
                                            alignItems : 'center'
                                            
                                        }}>
                                                <Text style = {{
                                                    fontSize : 20,
                                                    fontWeight : 'bold'
                                                }}>LANGUAGES</Text>
                                                <TouchableOpacity style = {styles.edit} onPress = {
                                                    ()=>{
                                                        this.props.notifier()
                                                        this.setState({type : 'Languages' ,  db_table : 'Languages' , mode : 'Languages' , tags : this.props.state.Business_profile.Languages
                                                         , icon : 'user'})
                                                        this.setState({action : 'come out' , chips : 'chips' })
                                                    }
                                                }>
                                                    <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded/>

                                                </TouchableOpacity>
                                        </View>
                                        <View style = {styles.tags}>
                                            
                                        <FlatList
                                            showsHorizontalScrollIndicator = {false}
                                            horizontal = {true}
                                            data = {this.props.state.Business_profile.Languages}
                                            contentContainerStyle = {{
                                                width : 0.99 * ScreenWidth,
                                                justifyContent : 'space-around',
                                                paddingBottom : 15,
                                            }}
                                            renderItem = {(item , index)=>(
                                                <View style = {styles.chips}>
                                                    <Text>{item.item}</Text>
                                                </View>
                                            )}
                                        />

                                        </View>
                            </View>
                </View>
                <View style = {styles.divider}/>
                <View style = {{
                                height : 0.22 * ScreenHeight,
                                width : ScreenWidth,
                                flexDirection : 'column',
                                justifyContent : 'space-between',
                                alignItems : "center",
                            }}>
                                <Text style = {{
                                    fontSize : 23,
                                    fontWeight : '700'
                                }}>Reviews</Text>
                            <FlatList
                                data = {[]} 
                                horizontal = {true}
                                ListEmptyComponent = {
                                    () => (
                                        <Text style = {{
                                            fontSize : 17
                                        }}>No Reviews yet. </Text>
                                    )
                                }
                                alwaysBounceHorizontal = {true}
                                showsHorizontalScrollIndicator = {false}
                                contentContainerStyle = {styles.review_list}
                                renderItem = {
                                    (item) => (
                                        <TouchableOpacity style = {styles.review}>
                                            <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                                            <Avatar rounded containerStyle = {{elevation : 5,}} source = {require('../../assets/Notifications.png')} size = {'medium'}/>
                                            </View>
                                            
                                            <Text style = {{fontWeight : '600', color : 'black'}}>Very Nice Employee ...</Text>
                                        </TouchableOpacity>
                                    )
                                } 
                />

                </View>
                <View style = {styles.divider}/>

                <View style = {styles.group}>       
                            <View style = {{
                                width : 0.9 * ScreenWidth,
                                height : 0.1 * ScreenHeight,
                                flexDirection : 'row',
                                justifyContent : 'space-between',
                                alignItems : 'center'
                                
                            }}>
                                    <Text style = {{
                                        fontSize : 20,
                                        fontWeight : 'bold'
                                    }}>BILLING METHODS</Text>
                                    
                            </View>
                            <View style = {styles.tags}>
                                <View style = {styles.chips}>
                                    <Text style = {{
                                        fontSize : 18
                                    }}>{this.state.profile_info.Billing.Name_on_card}</Text>
                                </View>
                                
                            </View>
                                </View>
                <View style = {styles.divider}/>

                    </View>  

                </ScrollView>
                { this.state.chips === 'text' && !this.props.state.business_profile_edit_done   ? <Text_edit name = {this.state.name} effect = {this.state.effect} mode = {this.state.mode} action = {this.state.action} type = {this.state.type} value = {this.state.value} icon = {this.state.icon} effect = {this.state.effect} /> : <View/> }               
                { this.state.chips === 'chips' && !this.props.state.business_profile_edit_done  ? <Text_chips action = {this.state.action} effect = {this.state.effect} db_table = {this.state.db_table} type = {this.state.type} mode = {this.state.mode} tags = {this.state.tags} /> : <View/>  }
                </View>
            )
    }
    }
}

let mapDispatchToProps = (dispatch) => ({
    notifier : () => dispatch({type : 'done' , decide : false }),
    update_profile_account_redux : (name , value) => dispatch({ type : 'update_business_profile_account' , name : name , value : value }),

})
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}

}

export default connect( mapStateToProps , mapDispatchToProps )(Profile)

const styles = StyleSheet.create({
    credentials : {
        width : ScreenWidth,
        height : 0.35 * ScreenHeight,
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
        height : 0.3 * ScreenHeight,
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
    statistics : {
        width : ScreenWidth,
        height :1.5* ScreenHeight,
        maxHeight : 3 * ScreenHeight,
        backgroundColor : 'white',
        alignItems : 'center',
        justifyContent : 'space-around',
        
    },
    divider : {
        height : 1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.15,
    },
    Gigs : {
        height : 40,
        width : ScreenWidth,
        backgroundColor : 'red'

    },
    item : {
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingLeft: 14,
        paddingRight : 14,
        
    },
    list : {
        height : 0.13 * ScreenHeight,
        top : 10,
    },
    tags : {
        //flexGrow : 1,
        height : 0.09 * ScreenHeight,
        maxWidth : ScreenWidth * 0.9,
        flexWrap : 'wrap',
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        //paddingTop : 50,
    },
    tag : {
        maxWidth : 0.3 * ScreenWidth ,
        maxHeight : 0.1 * ScreenHeight,
        borderRadius : 0.5 * ScreenHeight,
        flexWrap : 'nowrap',

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
    group : {
        justifyContent : 'space-evenly',
        maxHeight : 0.2 * ScreenHeight,
        maxWidth : ScreenWidth,
        flexWrap : 'nowrap',
    },
    review : {
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingLeft: 25,
        paddingRight : 25,

    },
    review_list : {
        height : 0.13 * ScreenHeight,
        top : 10,
    },
    review_rating : {
        height : 25 ,
        width : 80,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'

    }

})