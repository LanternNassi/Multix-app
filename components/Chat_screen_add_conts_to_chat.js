import React, { Component } from 'react'
import { View , Text , TouchableOpacity , FlatList , StyleSheet } from 'react-native';
import { Avatar , CheckBox , Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import * as Animatable from 'react-native-animatable';
import { FAB,Portal,Provider } from 'react-native-paper';

export class Chat_screen_add_conts_to_chat extends Component {
    constructor(props){
        super(props)
    }
    state = {
        checked : []
    }
    checker = (id) => {
        let success = false ;
        for(let i = 0 ; i <= this.state.checked.length ; i++ ){
            if(  id === this.state.checked[i]){
                success = true;
                break;
            }

            else {
                success = false
            }
        }
        return success;

    }
    remover = (id) => {
        if (this.state.checked.includes(id)){
            let index = this.state.checked.indexOf(id);
            this.state.checked.splice(index,1);
            this.setState({checked : this.state.checked})
        } else {

        }
        
    }
    render() {
        return (
            <View>
                <TouchableOpacity style = {{
                    width : ScreenWidth,
                    maxWidth : ScreenHeight,
                    height : 40,
                    justifyContent : 'center',
                    alignItems : 'center'

                }} >
                    <Animatable.Text animation = {"pulse"} iterationCount={'infinite'} direction="alternate" style = {{
                        fontSize : 20,
                        fontWeight : '700'
                    }}>
                        {this.state.checked.length} chats
                    </Animatable.Text>

                </TouchableOpacity>
               
             
                <View style = {{ height : 0.8*ScreenHeight }} >
                <FlatList 
                data = {this.props.state.friends}
                horizontal = {false}
                renderItem = { 
                    (item) =>  (
                        (this.checker(item.item.id)) ? (
                        <CheckBox  title = {
                                <View style = { styles.title }>
                                    <Avatar containerStyle = {{ elevation : 5 }} rounded source = {require('../assets/Notifications.png')} size = {'small'} />
                                    <Text style = {{ left : 20  }}>{item.item.name}</Text>
                                </View>
                            }
                         onPress = { () => {
                            this.remover(item.item.id)
                         }
                             
                         }
                         checked = {true}/>
                         ) : (
                            <CheckBox  title = {
                                <View style = { styles.title }>
                                    <Avatar containerStyle = {{ elevation : 5 }} rounded source = {require('../assets/Notifications.png')} size = {'small'} />
                                    <Text style = {{ left : 20  }}>{item.item.name}</Text>
                                </View>
                            }
                         onPress = {
                             ()=>{
                                 this.setState({checked : [...this.state.checked,item.item.id]})
                                 
                             }
                         }
                         checked = {false}/>

                         )
                    )
                    
                }
            />
            </View>
            <Animatable.View style = {{ position : 'absolute' ,height : 50 , width : 50 , left : 0.88*ScreenWidth , bottom : 0.1*ScreenHeight}} animation = {"slideInDown"} iterationCount={'infinite'} direction="alternate" >
            <Badge value = {this.state.checked.length} status = {'error'}/>
            </Animatable.View>
            <FAB
                 fabStyle  = {{ backgroundColor : this.props.state.theme.icons_surrounding , }}
                 visible = {true}
                 color = {this.props.state.theme.icons}
                 style = {{  height : 50 , width : 50 , left : 0.8*ScreenWidth , bottom : 0.1*ScreenHeight }}
                 onPress = { ()=> console.log("Done")  }
                 open = {false}
             
                 icon = {'check'}

            />
               
                
            </View>
        )
    }
}

const mapStateToProps = (state_redux,ownProps) => {
    let state = state_redux.business
    return {state}
    
}



export default connect(mapStateToProps,null)(Chat_screen_add_conts_to_chat)

const styles = StyleSheet.create({
    title : {
        left : 20,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    
        
    },
    
})
