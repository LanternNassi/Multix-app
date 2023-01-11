import React , {Component} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button , StyleSheet , TouchableOpacity,FlatList } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import {PulseLoader} from 'react-native-indicator'
import NumberFormat from 'react-number-format'
import * as Progress from 'react-native-progress'


export class Hiring extends Component {
    state = {
        IsReady : false,
        data : null, 
        open : false
    }
    get_resources = () =>{
        if (this.props.state.Business_profile.Account){
            this.props.state.request_business_json({
                method : 'GET',
                url : 'fill_gigs/?Gig_type=Hiring' ,
                data : {}
            }).then((response)=>{
                //if (this.state.interval){
                  //  this.state.interval.clearInterval(this.state.interval)
                    //this.setState({interval : null})
                //}
                //this.setState({open : true})
                if (response.status === 202){
                    this.setState({IsReady : true , data : response.data})
                }
            }, ()=>{
                //if (!this.state.interval){
                  //  this.setState({interval : setInterval(()=>{
                    //    this.get_resources()
                    //},2000)
                //})
                //} 
            })
        }
        
    }
    //persist = () => {
      //  if (!this.state.open){
        //    this.get_resources()
          //  setTimeout(()=>{this.persist()},2000)
        //}
    //}
    submit_hiring_proposal = (gig_id , account_id , gig_name , account_name) => {
        if (this.props.state.Business_profile.Account){
            this.props.state.request_business_json({
                method : 'POST',
                url : 'create_hiring_applicant' ,
                data : {
                    'gig_id' : gig_id,
                    'Approved' : 'false',
                }
            }).then((response)=>{
                if (response.status === 201){
                    let data = {
                        'type'  : 'Hiring',
                        'account_id' : account_id,
                        'gig' : gig_name,
                        'Name' : account_name,
                        notification : {
                            'notifier_id' : response.data['Account_id_of_customer'],
                            'Type' : 'Hiring',
                            'Date' : response.data['Date'],
                            'Type_id' : response.data['Hiring_id']
                        } ,
                        'contract_id' : response.data['contract_id']
                    }
                    this.props.state.ws_gig_notifications.sendMessage(data)
                }
            })
        }

    }
    query_resources = (name)=>{
        if (this.props.state.Business_profile.Account){
            this.props.state.request_business_json({
                method : 'GET',
                url : 'fill_gigs/?Gig_type=Hiring&Gig_name=' + name ,
                data : {}
            }).then((response)=>{
                if (response.status === 202){
                    this.setState({IsReady : true , data : response.data})
                }
            })
        }
       

    }
    componentDidMount(){
        if (this.props.state.Business_profile.Account){
            this.get_resources()
        }

    }
    
    render = () => {
        if (!this.props.state.Business_profile.Account && this.props.fun.Fun_profile['Name'] != 'admin'){
            return (
                <View style = {styles.container} >
                <Image source = {require('.././../assets/giphy.gif')} style = {styles.bg} /> 
                <View style = {{ position : 'absolute', Top : 0.01 * ScreenHeight }}>
                    <Animatable.Text  style = {styles.welcoming_text}> We have what you are looking for.</Animatable.Text>
                    <Animatable.Text style = {styles.welcoming_text} >Just accept and register with us</Animatable.Text>
                    <Animatable.Text  style = {styles.welcoming_text}>You wont regret.</Animatable.Text>  
                </View>
                <View style = {{ paddingTop : 0.2 * ScreenHeight , position : 'absolute' }}>
                <Button title = {'Continue with us'} onPress = {
                    ()=>{
                        this.props.state.navigation.navigation.navigate("Welcome Information")
                    }
                }/>   
                </View>      
                </View>
            )
        } else if (this.props.fun.Fun_profile['Name'] == 'admin' && !this.props.state.Business_profile.Account){
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
    
        } 
        else {
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
                                        this.setState({IsReady:false})
                                        var info = text.split('')
                                        if ((info.length) >= 3) {
                                            this.query_resources(text)
                                        }
                                    } else{
                                        this.setState({IsReady:false})
                                        this.get_resources()
                                    }
                                    
                                }
                            }
                             placeholder = {'       Search Gig by Name'} />
        
                        </View>
        
                    </View>
                    {this.state.IsReady?(
                         <FlatList
                         style = {styles.list}
                         data = {this.state.data}
                         
                         ItemSeparatorComponent = {
                             ()=>(
                                 <View style = {styles.divider}/>
                             )
                         }
                         alwaysBounceVertical = {true}
                         renderItem = {
                             (item,index)=>(
                                 <TouchableOpacity style = {styles.item} onPress = {
                                     () => {
                                         this.props.state.navigation.navigation.navigate('Gig Profile' , {id : item.item.Gig_id})
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
                                             () => {
                                                 this.props.state.navigation.navigation.navigate('Account Profile',{id : item.item.Account_id})
                                             }
                                         }>
                                             <Image source = {{uri : item.item.Profile_pic}} style = {{
                                                 height : 40,
                                                 width : 40,
                                                 borderRadius : 20
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
                                                     fontWeight : 'bold'
                                                 }}>{item.item.Name}</Text>
                                                 <Text style = {{
                                                     fontWeight : 'bold'
                                                 }}>{item.item.Place_of_residence}</Text>
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
                                         <MaterialCommunityIcons name = "account-switch" color = {this.props.fun.Layout_Settings.Icons_Color} size={26}/>
                                         <Text style = {{
                                             fontSize :20,
                                             fontWeight : 'bold',
                                         }}> { item.item.Count } </Text>
                                         </View>
                                         <Text >
                                             Date : {item.item.Gig_date_of_creation.slice(0,10)}
                                         </Text>
                                             <NumberFormat value = { item.item.Gig_salary } displayType = {'text'}
                                                 thousandSeparator = {true}
                                                 prefix = {'shs.'}
                                                     renderText = {(value , props) => (
                                                         <Text > Salary :  {value} </Text>
                                                     )}
                                                     />
                                            {
                                                item.item.Account_id == this.props.state.Business_profile.Account.user_id ? (
                                                    (null)
                                                ) : (
                                                    <TouchableOpacity onPress = {()=>{
                                                        this.submit_hiring_proposal(item.item.Gig_id,item.item.Account_id,item.item.Gig_name,item.item.Name)
                                                    }} style = {{...styles.propose , backgroundColor : this.props.fun.Layout_Settings.Icons_Color}}>
                                                        <Text style = {{
                                                            color : 'white',
                                                        }}>
                                                            Apply
                                                        </Text>
                                                    </TouchableOpacity>    
                                                )
                                            }
                                        
                                     </View>
                                 </TouchableOpacity>
                             )
                         }
                     />

                    ):
                    (     
                        <View style = {{
                            flex : 1,
                            alignItems : 'center',
                            justifyContent : 'center',
                        }}>
                            <Progress.CircleSnail  size = { 60 } progress = {0.7} color = {'black'} />
                        </View>
                        )}
                   
                    <TouchableOpacity style = {styles.fab} onPress = {
                        () => {
                            this.props.state.navigation.navigation.navigate('Credentials', { type : 'Hiring' })
                        }
                    }>
                        <Avatar containerStyle = {{
                            backgroundColor : this.props.fun.Layout_Settings.Icons_Color,
                        }} icon = {{ name : 'add' , type : 'MaterialCommunityIcons', color : 'white' , size : 18 }} size = {'medium'} rounded/>
                    </TouchableOpacity>
        
                    
                </View>
            )
        }
            

        }
       

    }
    
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}

}

let mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps , mapDispatchToProps)(Hiring)

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
        opacity : 0.5,
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
        justifyContent : 'space-between',
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
        height : 30 ,
        width : 0.2 * ScreenWidth,
        maxWidth : 0.45 * ScreenWidth,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-around',
        borderRadius : 15,

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
        elevation : 18
        

    }
})

