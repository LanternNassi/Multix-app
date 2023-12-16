import React, { Component , useState , useEffect} from 'react'
import { View , Text , ScrollView , FlatList , TouchableOpacity , StyleSheet }  from 'react-native'
import { Avatar , Card , CheckBox} from 'react-native-elements' 
import { connect } from 'react-redux'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite'
import FormData, {getHeaders} from 'form-data';
import * as mime from 'react-native-mime-types'
import NumberFormat from 'react-number-format'
import {PulseLoader} from 'react-native-indicator'
import * as Progress from 'react-native-progress'




export class GigProfile extends Component{
    state = {
        gig : null,
        IsReady : false,
    }
       
        get_resources = (id) =>{
            this.props.state.request_business_json({
                method : 'GET',
                url : '/gig_detail/?id='+id,
                data : {}
            }).then((response)=>{
                if (response.status === 200){
                    this.setState({gig : response.data , IsReady : true})
                }
            })
        }
        componentDidMount=()=>{
            if (!this.props.route.params['derived']){
                const {id} = this.props.route.params
                console.log(id)
                this.get_resources(id)
            } else {
                this.setState({gig : this.props.route.params['gig'] , IsReady : true})

            }
            
        }
        render = () => {
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
                  

               } else if (this.state.IsReady){
                   return(
                    <ScrollView 
                    contentContainerStyle = {{ 
                        //height : 1.84 * ScreenHeight,
                        }}
                    style = {{flex : 1,    
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
                                <Avatar source = {{uri : this.state.gig.ShowCase_1}} rounded size = {'large'}/>
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
                                    fontSize : 19,
                                    fontWeight : 'bold'
                                }}>{ this.state.gig.Gig_name }</Text>
                                
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
                                }}>{this.state.gig.Gig_location}</Text>
                                
                            </View>
                            
                            </View>
                            <Text style = {{ 
                                fontWeight : '700'
                            }} >  Date of creation : {(this.state.gig.Gig_date_of_creation).slice(0,10)}</Text>
                            <View style = {{
                                flexDirection : 'row',
                                justifyContent : 'space-between',
                                alignItems : 'center',
                                height : 28,
                                width : 0.55 * ScreenWidth,
                            }} >
                            <View style = {styles.contacts }>
                                <Text style = {{fontWeight : '700'}}>Genre  :</Text>
                            <Text>{this.state.gig.Gig_genre}</Text>
                            </View>
        
                            </View>
                            
                                <View style = {{
                                    flexDirection : 'row',
                                    justifyContent : 'space-between',
                                    alignItems : 'center',
                                    height : 28,
                                    width : 0.55 * ScreenWidth,
                                }}>
                                <View style = {{ ...styles.contacts , borderWidth : 0  }}>
                                    <Text style = {{ fontWeight : '700' }}> Salary : </Text>
                                <NumberFormat value = { this.state.gig.Gig_salary } displayType = {'text'}
                                    thousandSeparator = {true}
                                    prefix = {'shs.'}
                                    renderText = {(value , props) => (
                                        <Text style = {{left : 20}}> {value} </Text>
                                    )}
                                    />
                                </View>
                            
                                </View>
                                <View style = {{
                                    width : 0.5 * ScreenWidth,
                                    height : 20,
                                    flexDirection : 'row',
                                    justifyContent : 'space-around',
                                    alignItems : 'center',
        
                                }}>
                                    
                                    <Text style = {{
                                        fontSize : 15,
                                        fontWeight : 'bold',
                                    }}>  Payments : </Text>
                                    <Text>{this.state.gig.Gig_payment_mode}</Text>
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
                                
                                </View>
                                <View style = {{
                                    flexWrap : 'nowrap',
                                    maxWidth : 0.88 * ScreenWidth,
                                }}>
                                    <Text style = {{
                                        left : 0.04 * ScreenWidth
                                    }}>
                                        {this.state.gig.Gig_description.length > 210 ? this.state.gig.Gig_description.slice(0,210) : this.state.gig.Gig_description }
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
                            <Avatar rounded source = {{ uri : this.state.gig.ShowCase_1 }} size = {'xlarge'}   />
                            <Avatar rounded source = {{ uri : this.state.gig.ShowCase_2 }} size = {'xlarge'}   />
                            <Avatar rounded source = {{ uri : this.state.gig.ShowCase_3 }} size = {'xlarge'}   />
                            <Avatar rounded source = {{ uri : this.state.gig.ShowCase_4 }} size = {'xlarge'}   />
        
        
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
                                                <Text>{this.state.gig.Gig_deadline}</Text>
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
                                                <Text>{this.state.gig.Gig_expiration_date.slice(0,10)}</Text>
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
                                                <Text>{this.state.gig.Gig_genre}</Text>
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
                                            data = {this.state.gig.Gig_info}
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
                                                    <Avatar containerStyle = {{ elevation : 5 }} rounded source = {require('../../assets/Notifications.png')} size = {'small'} />
                                                    <Text style = {{ left : 20 , fontWeight : 'bold'  }}>Negotiable</Text>
                                                </View>
                                            }
                                        onPress = {
                                            ()=>{
                                                
                                            }
                                        }
                                        checked = {this.state.gig.Gig_negotiation}/>
                                </View>
                            
                        </View>
        
                        
                    </ScrollView>

                   )
               }

       
        }
    
    }
const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}
}

const mapDispatchToProps = (dispatch) => ({

    
})

export default connect(mapStateToProps, mapDispatchToProps)(GigProfile)

const styles = StyleSheet.create({
    credentials : {
        width : ScreenWidth,
        height : 0.38 * ScreenHeight,
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
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'center',
        height : 0.63 *  ScreenHeight,
    
    },
    chips : {
        paddingBottom : 6,
        paddingLeft : 10,
        paddingRight : 10,
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
