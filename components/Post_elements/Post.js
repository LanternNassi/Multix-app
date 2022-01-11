import React, {Component, useState} from 'react'
import {View , ScrollView, Text , StyleSheet , Image , TouchableOpacity  } from 'react-native';
import { Avatar , Icon , Card , Input , Badge } from 'react-native-elements';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import * as animatable from 'react-native-animatable'
import SkeletonContent from 'react-native-skeleton-content'

export default function Post() {
    const [loading , setloading] = useState(false);
    return (
        <ScrollView horizontal = {false}>
    
        <View style = {styles.container}>

            <View style = {styles.av} >
                <SkeletonContent isLoading = {loading}  containerStyle = {{height : 50 , width : 50 , borderRadius : 25}} layout = {[
                    {key : 'pic' , height : 70 , width : 70 , borderRadius : 35, elevation : 5}
                ]} >
                    <Avatar key = {'pic'} rounded source = {require('../../assets/Notifications.png')} size = {'medium'}/>
                </SkeletonContent>
            </View>
            <View style = {styles.post} >
            <Card containerStyle = {{borderTopRightRadius : 35 , width : 0.95 * ScreenWidth}}>

                <SkeletonContent isLoading = {loading} containerStyle = {{width : 200 , height : 10 }} layout = {[
                    {key : 'image' , height : 10 , width : 200 , elevation :5}
                ]}>
                
                <Card.Title>Anna Raquel is with Lynn having fun</Card.Title>
                </SkeletonContent>

                <View style = {{ flexDirection : 'row' , justifyContent : 'space-between',alignItems : 'center' }}>
                    <View  style = {{ flexDirection : 'column',justifyContent:'space-around',alignItems:'flex-start',width: 70 , height : 70 , top:10 }} >
                        <SkeletonContent isLoading = {loading} containerStyle = {{width : 100 , height : 10 }} layout = {[
                            {key : 'image' , height : 10 , width : 100 , top : 3 , elevation :5}
                        ]}>
                            <View style = {styles.details}>
                        
                                    <Avatar rounded size = 'small' icon = {{ name:'map-marker' , type : 'font-awesome' , color:'black', }}/>
                                    <Text>At Naalya </Text>
                                
                            </View>
                            </SkeletonContent>
                            <SkeletonContent isLoading = {loading} containerStyle = {{width : 100 , height : 10 }} layout = {[
                            {key : 'image' , height : 10 , width : 100 , top : -9 , elevation :5}
                        ]}>
                                <View style = {styles.details}>
                                
                                        <Avatar rounded size = 'small' icon = {{ name:'calendar' , type : 'font-awesome' , color:'black', }}/>
                                        <Text>At 5:29pm </Text>
                            
                                </View>
                            </SkeletonContent>
                    </View>
                    <View style = {{top :30 , }}>
                        <Avatar  rounded size = 'small' icon = {{ name:'ellipsis-v' , type : 'font-awesome' , color:'black', }}/>
                    </View>
                </View>
            

                                
                <Card.Image style = {{height : 300 , width : 300 , top :30 , margin : 'auto'}} source = {require('../../assets/Notifications.png')}>
                    </Card.Image> 
                
                
                <Card.Divider/> 
                
                <Text>The place where all things are possible. Please if you dont mind,you can register with us or just continue.</Text>   
                
                <Card.Divider/>
                
                    <View style = {styles.comment} >
                        <Input placeholder = {"Comment"} multiline={true} />
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{ name : 'send' , color : '#6096FD', type : 'font-awesome' }} size = "medium" />
                        </TouchableOpacity>
                    </View>
                
                <View  style = {styles.reactions}>               
                    <View>
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{  name : 'heartbeat' , color : 'deeppink' , type:'font-awesome'  }} size = 'medium'/>
                        </TouchableOpacity>
                        <View style = {styles.counters}>

                            <Text style = {styles.counts}>200</Text>
                        </View>
           
                    </View>
                    <View style = {styles.reaction_shadows}>
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{ style : {justifyContent : 'center',alignItems : 'center'}, name : 'thumbs-up',color:'deeppink',type:'font-awesome' }} size = 'medium'/>
                        </TouchableOpacity>
                        <View style = {styles.counters}>
                            <Text style = {styles.counts}>200</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{ name : 'thumbs-down',color:'deeppink',type:'font-awesome' }} size = 'medium'/>
                        </TouchableOpacity>
                        <View style = {styles.counters}>
                            <Text style = {styles.counts}>200</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{ name : 'plus',color:'deeppink',type:'font-awesome' }} size = 'medium'/>
                        </TouchableOpacity>
                    </View>
                    <View>
                    <TouchableOpacity>
                        <Avatar containerStyle = {{elevation : 5}} rounded icon = {{ name : 'comments',color:'deeppink',type:'font-awesome' }} size = 'medium'/>
                        </TouchableOpacity>
                        <View style = {styles.counters}>
                            
                            <Text style = {styles.counts}>200</Text>
                        </View>
                    </View>
                </View>
                <View style = {{ width : 250,height : 40,top : 10 }}>
                    <TouchableOpacity style = {styles.review}>
                        <Avatar rounded size = {'small'} source = {require('../././../assets/Notifications.png')} />
                        <Avatar  rounded size = {'small'} source = {require('../././../assets/Notifications.png')}/>
                        <Avatar rounded size = {'small'} source = {require('../././../assets/Notifications.png')} />
                        <Avatar rounded size = {'small'} source = {require('../././../assets/Notifications.png')} />
                        <Text>View all 13 comments ...</Text>
                    </TouchableOpacity>


                </View>
                

                
            </Card>
            </View>
            

            
        </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container : {
        top : 3,
        marginLeft : 'auto',
        maxHeight : 900,
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        width : 0.98 * ScreenWidth
        

    },
    av : {
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 35 ,
        borderBottomRightRadius : 0,
        width : 70,
        height : 70,
        backgroundColor : 'white',
        top : 22,
        position : 'absolute',
        zIndex : 1 ,
        right : 15,
        elevation : 10
    },
    post : {
        top : 5,
        backgroundColor : 'transparent',
        borderRadius : 15,
        borderTopRightRadius : 0,
        
    
    },
    comment : {
        flexDirection : 'row',
        width : 240,
        justifyContent : 'flex-start',
        height : 90,
        alignItems : 'center',
        margin : 'auto',
        
        
        
    } ,
    reactions : {
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',

    },
    details : {
        flexDirection : "row",
        justifyContent : 'flex-start',
        alignItems : 'center',
        
    },
    counters : {
        width :30,
        height : 30,
        backgroundColor : 'transparent',
        borderTopLeftRadius : 50,
        borderTopRightRadius : 50,
        borderBottomRightRadius : 50,
        borderBottomLeftRadius : 50,
        position : 'absolute',
        top : -7 ,
        right : -9 ,
        
        
        
    },
    counts : {
        color : '#6096FD',
        margin : 'auto',
        fontWeight : 'bold',
    },
    review : {
        width : 300,
        height : 30,
        backgroundColor : 'rgba(255,255,255,0.9)',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        
    },
    
   

})

