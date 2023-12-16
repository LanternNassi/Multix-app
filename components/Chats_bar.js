
import React , {Component} from 'react'
import {View , Text , FlatList , StyleSheet, Image, SafeAreaView, ScrollView,  TouchableHighlight,TouchableOpacity, TouchableHighlightBase} from 'react-native'
import { Avatar , Badge , ListItem, Button, Icon, Card } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableItem } from 'react-native-tab-view';
import SkeletonContent from 'react-native-skeleton-content';
import { connect } from 'react-redux'
import * as Progress from 'react-native-progress'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'


class Chats_bars extends Component {
    state = {
        'chat_screen_visibility' : false ,
        loading : true,

    }
    online_guys = null

    get_online_chats = () => {
        let onlines = []
        for(let i = 0; i<this.props.state.fun.Contacts.length; i++){
            if (this.props.state.fun.Online_chats[this.props.state.fun.Contacts[i].Name]){
                onlines.push(this.props.state.fun.Contacts[i])
            }
        }
        //this.setState({ online_guys : onlines })
        this.online_guys = onlines
    }


    componentDidMount = () => {
        setTimeout(()=>{
            this.state.loading = false
        },5000)
    }


    
    render(){
        if ((this.props.state.fun.Online_chats === {} || this.props.state.fun.Online_chats) && (this.props.state.fun.Contacts === [] || this.props.state.fun.Contacts)){
            this.get_online_chats()
            function get_chats(props){
                let chats = []
                for (const [key , value] of Object.entries(props.state.fun.Online_chats)){
                    chats.push({key,value})
                }
                return chats
            }
            return (
                <View style = {{...styles.container , backgroundColor : this.props.state.fun.Layout_Settings.Header_color}}>
                <FlatList
                alwaysBounceHorizontal = {true}
                showsHorizontalScrollIndicator = {false}
                ListEmptyComponent = {
                    () => (
                        <View style = {{
                            height : 0.1 * ScreenHeight,
                            width : ScreenWidth,
                            justifyContent : 'space-around',
                            alignItems: 'center'
                        }}>
                            <Avatar icon = {{ name : 'cloud-upload' , type : 'fontawesome' , size : 40 , color : this.props.state.fun.Layout_Settings.Icons_Color }} size = {'medium'} />
                            <Text style = {{ fontWeight : 'bold', color : 'white' }}>No online chats yet</Text>
                        </View>
                    )
                } 
                horizontal = {true}
                 data = {
                   //get_chats(this.props)
                   //this.state.online_guys
                   this.online_guys
                 }
                 renderItem = {
                     (item, index) =>  {
                         if (this.props.state.fun.Online_chats[item.item.Name]){
                            return (
                                <TouchableOpacity onPress = {( )=>{}}>
                                    <View style = {styles.item}> 
                                    <SkeletonContent isLoading = {false} containerStyle = {{ width : 50 }} layout = {[
                                        {key : 'pic' , width : 50 , height : 50 , borderRadius : 25},
                                        {key : 'name' , width : 50 , height : 10 }
                                    ]} >
                                    
                                    <Avatar activeOpacity = {3} key = {'pic'}  source = {{ uri : item.item.Profile_photo }} rounded size = {'medium'}/>
                                    
                                    <Badge status="success" containerStyle={{ position: 'absolute', top: 3, right: 3 }} />
                                    </SkeletonContent>
                                    
                                    </View>
                                    
                                </TouchableOpacity>
                            )
                         }
                        
                     }
                     
                 }
                 
                />
              
                </View>    
                
            )
        } else {
            return (
                <View style = {{
                    height : 0.1 * ScreenHeight,
                    width : ScreenWidth,
                    justifyContent : 'space-around',
                    alignItems: 'center'
                }}>
                    <Progress.CircleSnail size = { 40 } progress = {0.5} color = {'black'} />
                </View>
            )
        }
        
    }
        
}

let mapStateToProps = (state_redux) => {
    let state = state_redux
    return {state}

}
let mapDispatchToProps = () => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Chats_bars)

const styles = StyleSheet.create({
    container : {
        marginTop :0,
        justifyContent : 'center',
        height : 0.11 * ScreenHeight,
        //backgroundColor : 'white',
        elevation : 5
        
       
    },
    item : {
        padding : 9,

    }


})