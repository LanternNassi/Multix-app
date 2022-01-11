
import React , {Component , useEffect , useState} from 'react'
import {Avatar , Card } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import {View , Text  , Image , Button , StyleSheet , FlatList , TouchableOpacity , TextInput} from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import {PulseLoader} from 'react-native-indicator'
import Hot from '../../components/Front_actions/Hot.js'
import * as Progress from 'react-native-progress'



export  function Hot_deals(props) {
    const [IsReady , SetIsReady] = useState(false)
    const [data , Setdata] = useState(null)
    const [hotprops , Sethotprops] = useState(null)
    const [open , setopen] = useState(0)

    const get_resources = () =>{
        if (props.state.Business_profile.Account){
            props.state.request_business_json({
                method : 'GET',
                url : 'fill_gigs/?Gig_type=Hot deals' ,
                data : {},
    
            }).then((response)=>{
                
                if (response.status === 202){
                    Setdata(response.data)
                    SetIsReady(true)
                }
            },()=>{
                //if (!interval){
                  //  setinterval(setInterval(()=>{
                    //    setcount(count + 1)
                      //},2000))
                //} 
            })
        }
        
    }
    //const persist = () => {
      //  if (!open){
        //    get_resources()
          //  setTimeout(()=>{persist()},2000)
      //  }
    //}

    const close_stream = () => {
        Sethotprops(null)
    }
    useEffect(()=>{
        if (props.state.Business_profile.Account){
            //persist()
            get_resources()
        }
    },[])
   
    const query_resources = (name)=>{
        if (props.state.Business_profile.Account){
            props.state.request_business_json({
                method : 'GET',
                url : 'fill_gigs/?Gig_type=Hot deals&Gig_name=' + name ,
                data : {}
            }).then((response)=>{
                setopen(true)
                if (response.status === 202){
                    Setdata(response.data)
                    SetIsReady(true)
                }
            })
        }
        

    }

    if (!props.state.Business_profile.Account && props.fun.Fun_profile['Name'] != 'admin') {
        return (
        
            <View style = {styles.container} >
            <Image source = {require('.././../assets/giphy.gif')} style = {styles.bg} /> 
            <View style = {{ position : 'absolute', paddingTop : ScreenHeight-800 }}>
                <Animatable.Text  style = {styles.welcoming_text}> We have what you are looking for.</Animatable.Text>
                <Animatable.Text style = {styles.welcoming_text} >Just accept and register with us</Animatable.Text>
                <Animatable.Text  style = {styles.welcoming_text}>You wont regret.</Animatable.Text>  
            </View>
            <View style = {{ paddingTop : ScreenHeight-500 , position : 'absolute' }}>
            <Button title = {'Continue with us'} onPress = {
                ()=>{
                    props.state.navigation.navigation.navigate("Welcome Information")
                }
            }/>   
            </View>      
            </View>
        )

    } else if (props.fun.Fun_profile['Name'] == 'admin' && !props.state.Business_profile.Account){
        return (
            <View style = {{
                flex :1 ,
            }}>
                <View style = {styles.categorizer}>
                  
                    <View>
                        <TextInput style = {{
                            width : 0.8 * ScreenWidth,
                            height : 30,
                            borderRadius : 20,
                            borderBottomWidth : 1,
                        }}
                        onChangeText = {
                            (text) =>{
                                
                                
                            }
                        }
                         placeholder = {'       Search Gig by Name'} />
    
                    </View>
    
                </View>
                <View style = {{
                        flex : 1,
                        alignItems : 'center',
                        justifyContent : 'center',
                    }}>
                            <Text style = {{ fontWeight : 'bold' }}> No gigs added yet </Text>
                    </View>
                </View>
        )

    } else {
        return (
            <View style = {{
                flex :1 ,
            }}>
                <View style = {styles.categorizer}>
                 
                    <View>
                        <TextInput style = {{
                            width : 0.8 * ScreenWidth,
                            height : 30,
                            borderRadius : 20,
                            borderBottomWidth : 1,
                        }}
                        onChangeText = {
                            (text) =>{
                                if (text){
                                    SetIsReady(false)
                                    var info = text.split('')
                                    if ((info.length) >= 3) {
                                        query_resources(text)
                                    }
                                } else{
                                    SetIsReady(false)
                                    get_resources()
                                }
                                
                            }
                        }
                         placeholder = {'       Search Gig by Name'} />
    
                    </View>
    
                </View>
                {IsReady?(
                       <FlatList
                       style = {styles.list}
                       data = {data}
                       ItemSeparatorComponent = {
                           ()=>(
                               <View style = {styles.divider}/>
                           )
                       }
                       renderItem = {
                           (item,index)=>(
                               <TouchableOpacity style = {styles.item} onPress = {
                                   () => {
                                       props.state.navigation.navigation.navigate('Gig Profile',{id : item.item.Gig_id , derived : false})
                                   }
                               }>
                                   <View style = {styles.images}>
                                       <TouchableOpacity>
                                           <TouchableOpacity style = {{
                                           position : 'absolute',
                                           top : 0.065 * ScreenHeight,
                                           right : (0.28 * ScreenWidth)/2,
                                           elevation : 10,
       
                                           }}>
                                       <Avatar icon = {{ name : 'save' , type : 'font-awesome' , color : 'white', size : 18 }} rounded containerStyle = {{
                                           backgroundColor : 'transparent',
       
                                       }} />
                                       </TouchableOpacity>
                                       <Image source = {{uri : item.item.ShowCase_1}} style = {{
                                           height : 0.2 * ScreenHeight ,
                                           width : 0.35 * ScreenWidth,
                                           borderRadius : 10,
       
                                       }} />
                                       </TouchableOpacity>
                                       <TouchableOpacity style = {styles.image_info} onPress = {
                                           () =>{
                                               props.state.navigation.navigation.navigate('Account Profile' , { id : item.item.Account_id })
                                           }
                                       }>
                                           <Image source = {{uri : item.item.Profile_pic}} style = {{
                                               height : 40,
                                               width : 40,
                                               borderRadius : 20,
                                           }} />
                                           <View style = {{
                                               height : 0.08 * ScreenHeight,
                                               width : 0.28 * ScreenWidth,
                                               flexDirection : 'column',
                                               justifyContent : 'space-between',
                                               alignItems : 'center',
                                           }}>
                                               <Text style = {{
                                                   fontSize : 16.5,
                                                   fontWeight : '600'
                                               }}>{item.item.Name}</Text>
                                               <Text>{item.item.Place_of_residence}</Text>
                                           </View>
       
                                       </TouchableOpacity>
       
                                   </View>
                                   <View style = {styles.info}>
                                       <View style = {{
                                           flexWrap : 'nowrap',
                                           maxHeight : 0.19 * ScreenHeight,
                                           maxWidth : 0.45 * ScreenWidth,
                                       }}>
                                           <Text style = {{
                                               fontSize  : 17,
                                               fontWeight : 'bold'
                                           }}>
                                           {item.item.Gig_name}
                                           </Text>
                                       </View>
                                       <View style = {styles.rating}> 
                                           <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (item.item.Rating > 0 ? ('gold'):('black')) }} rounded />  
                                           <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (item.item.Rating >= 1 ? ('gold'):('black')) }} rounded />  
                                           <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (item.item.Rating >= 2 ? ('gold'):('black')) }} rounded />  
                                           <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (item.item.Rating >= 3 ? ('gold'):('black')) }} rounded />  
                                           <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (item.item.Rating >= 4 ? ('gold'):('black')) }} rounded />  
                                       </View>
                                       <Text>
                                           Date : {item.item.Gig_date_of_creation.slice(0,10)}
                                       </Text>
                                       <NumberFormat value = { item.item.Gig_salary } displayType = {'text'}
                                        thousandSeparator = {true}
                                        prefix = {'shs.'}
                                            renderText = {(value , props) => (
                                                <Text > Price :  {value} </Text>
                                            )}
                                            />
                                            {
                                                item.item.Account_id == props.state.Business_profile.Account.user_id ? (
                                                    (null)
                                                ) : (
                                                    <TouchableOpacity onPress = {
                                                        ()=>{
                                                            //console.log(item.item)
                                                         //props.open_bidders(true)
                                                         Sethotprops(item.item)
                                                        }
                                                    } style = {{...styles.propose , backgroundColor : props.fun.Layout_Settings.Icons_Color}}>
                                                        <Text style = {{
                                                            color : 'white',
                                                        }}>
                                                            Bid
                                                        </Text>
                    
                                                    </TouchableOpacity>
                                                )
                                            }
                                      
       
                                   </View>
                               </TouchableOpacity>
                           )
                       }
                   />
                ):(
                       <View style = {{
                        flex : 1,
                        alignItems : 'center',
                        justifyContent : 'center',
                    }}>
                        <Progress.CircleSnail  size = { 60 } progress = {0.7} color = {'black'} />
                    </View>
                )}
             
                <TouchableOpacity style = {styles.fab} onPress = {
                    () =>{
                        props.state.navigation.navigation.navigate('Credentials' , {type : 'Hot deals'})
                    }
                }>
                    <Avatar containerStyle = {{
                        backgroundColor : props.fun.Layout_Settings.Icons_Color,
                    }} icon = {{ name : 'add' , type : 'MaterialCommunityIcons', color : 'white' , size : 18 }} size = {'medium'} rounded/>
                </TouchableOpacity>
    
                { hotprops ? ( <Hot status = {hotprops} closer = {close_stream}/>  ) : (<View/>) }
            </View>
        )
        

    }
    
  
   
}
let mapStateToProps = (state_redux) =>{
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}
let mapDispatchToProps = (dispatch) => ({
    open_bidders : (value) => dispatch({ type : 'close_open_bidders' , value : value })


})


export default connect(mapStateToProps , mapDispatchToProps)(Hot_deals)


const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'


    },
    welcoming_text : {
        fontSize : 18,
        fontWeight : '700',
        color : 'black',

    },
    bg : {
        opacity : 0.3,
        flex : 1
    },
    categorizer : {
        width : ScreenWidth,
        height : 0.15 * ScreenWidth,
        elevation : 10,
        backgroundColor : 'white',
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'space-evenly',
    },
    list : {
        flexGrow : 1,
        width : ScreenWidth,
    },
    item : {
        height : 0.32 * ScreenHeight,
        width : ScreenWidth,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    images : {
        height : 0.3 * ScreenHeight,
        width : 0.47 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',

    },
    image_info : {
        flexDirection : 'row',
        width : 0.44 * ScreenWidth,
        height : 0.1 * ScreenHeight,
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    info : {
        height : 0.34 * ScreenHeight,
        width : 0.47 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'flex-start',

    },
    rating : {
        height : 25 ,
        width : 0.35 * ScreenWidth,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    divider : {
        height : 1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.4,
    },
    propose : {
        height : 30,
        width : 0.4 * ScreenWidth,
        borderRadius : 15,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center', 
    },
    chips : {
        height : 20,
        width : 80,
        borderRadius : 10,
        backgroundColor : 'rgba(10,200,0,0.5)',
        justifyContent : 'center',
        alignItems : 'center',
    },
    fab : {
        position : 'absolute',
        bottom : 0.05 * ScreenHeight,
        right : 0.1 * ScreenWidth,
        

    }
})