import React, { Component } from 'react'
import { View , Text , TouchableOpacity, StyleSheet , ScrollView , Share } from 'react-native';
import { CheckBox , Avatar , Switch , ListItem , Image } from 'react-native-elements';
import { connect } from 'react-redux'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import * as Sharing from 'expo-sharing'
import * as SQLite from 'expo-sqlite'


export class Chat_screen_settings extends Component {
    state = {
        Messages : 0,
        Images : 0,
        Videos : 0,
        Contact : null,
        Mute : false,
    }

    get_contact = () => {
        for(let i = 0; i<this.props.fun.Contacts.length; i++){
            if (this.props.fun.Contacts['Name'] == this.props.route.params['Name']){
                this.setState({ Contact : this.props.fun.Contacts['Contact'] })
                break
            }
        }
    }

  

    count_messages = () => {
        let Received = 0
        let Sent = 0
        let index = this.props.route.params['chat_index']
        for(let i = 0; i<this.props.fun.Messages[index]['Messages'].length; i++){
            if ( this.props.fun.Messages[index]['Messages'][i]['Type'] == 'text'){
                if (this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Received ++
                }
                if (!this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Sent ++
                }
            }
        }
        this.setState({ Messages : {
            'Received' : Received,
            'Sent' : Sent
        } })
    }

    
    

    count_images = () => {
        let Received = 0
        let Sent = 0
        let index = this.props.route.params['chat_index']
        for(let i = 0; i<this.props.fun.Messages[index]['Messages'].length; i++){
            if ( this.props.fun.Messages[index]['Messages'][i]['Type'] == 'image'){
                if (this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Received ++
                }
                if (!this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Sent ++
                }
            }
        }
        this.setState({ Images : {
            'Received' : Received,
            'Sent' : Sent
        } })
        }
    count_videos = () => {
        let Received = 0
        let Sent = 0
        let index = this.props.route.params['chat_index']
        for(let i = 0; i<this.props.fun.Messages[index]['Messages'].length; i++){
            if ( this.props.fun.Messages[index]['Messages'][i]['Type'] == 'video'){
                if (this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Received ++
                }
                if (!this.props.fun.Messages[index]['Messages'][i]['Receiving']){
                    Sent ++
                }
            }
        }
        this.setState({ Videos : {
            'Received' : Received,
            'Sent' : Sent
        } })
        }
    componentDidMount(){
        //const {chat_index} = this.props.route.params
        let index = this.props.route.params['chat_index']
            if (this.props.fun.Messages[index]){
                this.count_messages()
                this.count_images()
                this.count_videos()
                this.get_contact()
            }
       
    }    

    render() {
        let profile_pic = this.props.route.params['Profile_pic']
        let Name = this.props.route.params['Name']
        let color = this.props.route.params['Color']
        return (
            <ScrollView horizontal = {false}>
                <View  style = {styles.status} >
                    <View style = {{ justifyContent : 'center' }}>
                        <View style = {{...styles.profile_pic_layout , backgroundColor : this.props.fun.Layout_Settings.Icons_Color}}>
                            {
                                profile_pic ? (
                                    <TouchableOpacity onPress = {()=>{
                                        this.props.state.navigation.navigation.navigate('Full View' , {'media_type' : 'Picture' , 'media' : profile_pic})

                                    }}>
                                        <Avatar source = {{ uri : profile_pic }} rounded size = {'xlarge'}  />
                                    </TouchableOpacity>
                                ) : (
                                    <Avatar containerStyle = {{ backgroundColor : color }} title = {Name.slice(0,2)} rounded size = {'xlarge'}  />
                                )
                            }
                        </View>
                    </View>
                    <View style = {{ justifyContent : 'space-between', height : 0.4 * ScreenHeight }}>
                        <View style = {styles.shared}>
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'file-photo-o', type : 'font-awesome' , color : this.props.fun.Layout_Settings.Icons_Color }} />
                            <View style = {{ justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Sent : </Text>
                                    <Text> { this.state.Images.Sent } </Text>
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Received : </Text>
                                    <Text>{this.state.Images.Received}</Text>
                                </View>
                           
                            </View>
                        </View>
                        <View style = {styles.shared} >
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'file-video-o', type : 'font-awesome',color : this.props.fun.Layout_Settings.Icons_Color }} />
                            <View style = {{ justifyContent : 'center'}}>
                            <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Sent : </Text>
                                    <Text> {this.state.Videos.Sent}</Text>
                                </View>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {{ fontWeight : '700' }}>Received : </Text>
                                    <Text> {this.state.Videos.Receiving}</Text>
                                </View>
                            </View>
                        </View>
                      
                        <View style = {styles.shared} >
                            <Avatar rounded size = {'small'} containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'envelope',  type : 'font-awesome',color : this.props.fun.Layout_Settings.Icons_Color }} />
                            <View style = {{ justifyContent : 'center'}}>
                                <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Sent : </Text>
                                        <Text> {this.state.Messages.Sent}</Text>
                                    </View>
                                    <View style = {{flexDirection : 'row'}}>
                                        <Text style = {{ fontWeight : '700' }}>Received : </Text>
                                        <Text> {this.state.Messages.Receiving}</Text>
                                    </View>
                            </View>
                        </View>


                    </View>
                </View>
                <View>

                <TouchableOpacity onPress = {
                    async ()=>{
                          //props.state.navigation.navigation.navigate("Settings")
                      const options = {
                        message : this.state.Contact,
                      };
                      let sharing_possible = await Sharing.isAvailableAsync()
                      if (sharing_possible){
                          try {
                              const result = await Share.share(options);
                                if (result.action === Share.sharedAction) {
                                  if (result.activityType) {
                                      console.log(result.activityType)
                                    // shared with activity type of result.activityType
                                  } else {
                                    // shared
                                  }
                                } else if (result.action === Share.dismissedAction) {
                                    console.log('shared')
                                  // dismissed
                                }
                          } catch (error) {
                              console.log(error)
                          }
                      }
                    }
                }>
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'share-alt' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row' , justifyContent : 'space-between' }}>
                    <ListItem.Title>Share Contact</ListItem.Title>
                    <ListItem.Chevron/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>


                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded icon = {{ name : 'bell' , color : 'black', type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Mute</ListItem.Title>
                    <Switch value = {false} color = {this.props.fun.Layout_Settings.Icons_Color}/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'bullhorn' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'row', justifyContent : 'space-between' }}>
                    <ListItem.Title>Report</ListItem.Title>
                    <ListItem.Chevron/>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>


                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return{state,fun}
    
}

const mapDispatchToProps =  (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat_screen_settings)

const styles = StyleSheet.create({
    status : {
        height : 0.5 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        maxWidth : 0.9 * ScreenWidth,
        minHeight : 0.4 * ScreenWidth,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        left : 0.05 * ScreenWidth,

    },
    profile_pic_layout : {
        height : 160 ,
         width : 160 , 
         borderRadius : 80 , 
         backgroundColor : 'red', 
         justifyContent : 'center',
          alignItems : 'center'

    },
    shared : {
        flexDirection : 'row',
        alignItems : 'center',
        height : 50,
        width : 0.45 * ScreenWidth,
        
        justifyContent : 'space-evenly'
        
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
      },
      ratingImage: {
        height: 19.21,
        width: 100
      },
      ratingText: {
        paddingLeft: 10,
        color: 'grey'
      }


})