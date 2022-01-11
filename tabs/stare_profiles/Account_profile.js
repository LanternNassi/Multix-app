import React, { Component } from 'react';
import {View , Text , StyleSheet , TouchableOpacity , ScrollView, FlatList } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import * as Animatable from 'react-native-animatable'
import * as SQLite from 'expo-sqlite'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import FormData, {getHeaders} from 'form-data';
import * as mime from 'react-native-mime-types'
import {PulseLoader} from 'react-native-indicator'
import * as Progress from 'react-native-progress'


export class Account_profile extends Component {
    state = {
        IsReady : false,
        profile_info : null
    }
    get_account = (id) => {
        if (id){
            this.props.state.request_business_json({
                method : 'GET',
                url : 'account-detail/?id=' + id,
    
            }).then((response)=>{
                if (response.status === 200){
                    this.setState({ profile_info : response.data , IsReady : true})
                }
            })
        } else {
            this.props.state.request_business_json({
                method : 'GET',
                url : 'account-detail/',
            }).then((response)=>{
                if (response.status === 200){
                    this.setState({ profile_info : response.data , IsReady : true})
                }
            })

        }
       
    }
    componentDidMount = () =>{
        const {id} = this.props.route.params
        this.get_account(id)
    }

   
    render() {
        if (!this.state.IsReady){
            return(
                <View style = {{
                    flex : 1,
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                        <Progress.CircleSnail  size = { 60 } progress = {0.7} color = {'black'} />
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
                            height : 0.3 * ScreenHeight,
                            width : 0.43 * ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',

                        }} >
                            
                            <Avatar source = {{ uri : this.state.profile_info.Profile_pic }} rounded size = {'large'}/>
                            <View style = {styles.on_encloser}>
                                <View style = {styles.on}/>
                            </View>
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
                            }}>{this.state.profile_info.Name}</Text>
                           
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
                            }}>{ this.state.profile_info.Place_of_residence }</Text>
                            
                        </View>
                       

                        </View>
                        <Text style = {{ 
                            fontWeight : '800'
                        }} >Date joined : {this.state.profile_info.Date_of_creation.slice(0,10)}</Text>
                        <View style = {{
                            flexDirection : 'row',
                            justifyContent : 'space-between',
                            alignItems : 'center',
                            height : 28,
                            width : 0.55 * ScreenWidth,
                        }} >
                        <View style = {styles.contacts }>
                            <Avatar icon = {{ name : 'phone' , type : 'font-awesome' , size : 17 , color : 'black' }} rounded />  
                            <Text>{this.state.profile_info.Contact}</Text>
                        </View>
                       

                        </View>
                        <View style = {styles.rating}> 
                        <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Rating >0)?('gold'):('black') }} rounded />  
                        <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Rating >=1)?('gold'):('black') }} rounded />  
                        <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Rating >=2)?('gold'):('black') }} rounded />  
                        <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Rating >=3)?('gold'):('black') }} rounded />  
                        <Avatar icon = {{ name : 'star' , type : 'font-awesome' , size : 17 , color : (this.state.profile_info.Rating >=4)?('gold'):('black') }} rounded />  
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
                           
                            </View>
                            <View style = {{
                                alignContent : 'center',
                                flexWrap : 'nowrap',
                                maxHeight : 0.9 * ScreenHeight,
                                maxWidth :  0.9 * ScreenWidth,
                                left : 10,
                            }}>     
                            <Text>
                                {this.state.profile_info.Description.slice(0,250)}
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
                                data = {this.state.profile_info.Gigs} 
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
                                    (item,index) => (
                                        <TouchableOpacity style = {styles.item} onPress = {
                                            () => {
                                                console.log(item.item)
                                                this.props.state.navigation.navigation.navigate('Gig Profile' , { gig : item.item , derived : true })
                                            }
                                        }>
                                            <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                                            <Avatar rounded containerStyle  = {{
                                                position : 'absolute',
                                                zIndex : 1,
                                                elevation : 9
                                            }} icon = {{ name : 'edit' , size : 17 , color : 'white'  }} />
                                            <Avatar rounded containerStyle = {{elevation : 5,}} source = {{uri : item.item.ShowCase_1}} size = {'medium'}/>
                                            </View>
                                                <Text style = {{fontWeight : '600', color : 'black'}}> { (item.item.Gig_name).length > 7 ? ((item.item.Gig_name).slice(0,7) + '...')
                                                :(item.item.Gig_name) } </Text>
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
                                               
                                        </View>
                                        <View style = {{...styles.tags }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator = {false}
                                            horizontal = {true}
                                            data = {this.state.profile_info.Certifications}
                                            contentContainerStyle = {{
                                                width : 0.99 * ScreenWidth,
                                                justifyContent : 'space-around',
                                                paddingBottom : 15,
                                            }}
                                            renderItem = {(item , index)=>(
                                                <View style = {styles.chips}>
                                                    <Text>{item.item.Certification_name}</Text>
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
                                              
                                        </View>
                                        <View style = {styles.tags}>
                                            {
                                                this.state.profile_info.Preference_1 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Preference_1}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Preference_2 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Preference_2}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Preference_3 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Preference_3}</Text>
                                                    </View>
                                                    ) : (<View/>)
                                            }{
                                                this.state.profile_info.Preference_4 ? (
                                                    <View style = {styles.chips}>
                                                        <Text>{this.state.profile_info.Preference_4}</Text>
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
                                              
                                        </View>
                                        <View style = {styles.tags}>
                                            
                                        <FlatList
                                            showsHorizontalScrollIndicator = {false}
                                            horizontal = {true}
                                            data = {this.state.profile_info.Languages}
                                            contentContainerStyle = {{
                                                width : 0.99 * ScreenWidth,
                                                justifyContent : 'space-around',
                                                paddingBottom : 15,
                                            }}
                                            renderItem = {(item , index)=>(
                                                <View style = {styles.chips}>
                                                    <Text>{item.item.Language}</Text>
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
                                data = {this.state.profile_info.Reviews} 
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
                                    (item,index) => (
                                        <TouchableOpacity style = {styles.review}>
                                            <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                                            <Avatar rounded containerStyle = {{elevation : 5,}} source = {require('../../assets/Notifications.png')} size = {'medium'}/>
                                            </View>
                                            
                                            <Text style = {{fontWeight : '600', color : 'black'}}>{item.item.Review}</Text>
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
                                                <TouchableOpacity style = {styles.edit}>
                                                    <Avatar icon = {{ name : 'plus' , type : 'font-awesome' , size : 17 , color : 'green' }} rounded/>
                                                </TouchableOpacity>
                                               
                                        </View>
                                        <View style = {styles.tags}>
                                            <View style = {styles.chips}>
                                                <Text style = {{
                                                    fontSize : 18
                                                }}>{this.state.profile_info.Billing_Info[0].Name_on_card}</Text>
                                            </View>
                                            
                                        </View>
                                </View>
                <View style = {styles.divider}/>

                    </View>  

                </ScrollView>
                </View>
            )
    }
    }
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Account_profile)

const styles = StyleSheet.create({
    credentials : {
        width : ScreenWidth,
        height : 0.35 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
        backgroundColor : 'white',
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
        top : 0.18 * ScreenHeight,
        left : 0.28 * ScreenWidth

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