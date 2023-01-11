import React, { Component } from 'react'
import { View , Text , StyleSheet , FlatList , TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenWidth , ScreenHeight } from 'react-native-elements/dist/helpers'
import fun_database from '../../redux/Database_fun_transactions'

export class Chats_FAB extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount = () => {
        console.log(this.props.state.fun.Contacts)
    }
    Index_checker = (id) => {
        if (this.props.state.fun.chats_positions){
            for(let i=0; i<(this.props.state.fun.chats_positions).length; i++){
                if(this.props.state.fun.chats_positions[i].Server_id === id){
                    return this.props.state.fun.chats_positions[i].index
                }
            }
            return false
        } else {
            return false
        }
        
    }
    render() {
        return (
            <View style = {{ flex : 1 }}>
                <View style = {styles.header}>
                    <Text style = {styles.header_title}>
                        Connected Chats
                    </Text>
                </View>
                {/* <View style = {styles.divider}/> */}

                <FlatList 
                    style = {styles.list}
                    data = {
                       this.props.state.fun.Contacts
                    }
                    horizontal = {false}
                    // ItemSeparatorComponent = {()=>(
                    //     <View style = {styles.divider}/>
                    // )}
                    contentContainerStyle = {styles.containerstyle}
                    ListEmptyComponent = { () => (
                        <View style = {styles.empty_container} >
                            <Text> No Chats Yet !!! </Text>
                        </View>
                    )}
                    renderItem = { (item , index)=>(
                        <TouchableOpacity style = {styles.item} onPress = {
                            ()=>{
                                
                                this.props.current_chat(item.item.Name , item.item.Profile_photo ? item.item.Profile_photo : false , fun_database.get_random_color(item.item.Name.slice(0,1)),this.Index_checker((item.item.Server_id) ? item.item.Server_id : item.item.id));  this.props.state.business.navigation.navigation.navigate('Chat_screen' , {Name:item.item.Name , Server_id : item.item.Server_id ? item.item.Server_id : item.item.id , Index : this.Index_checker((item.item.Server_id) ? item.item.Server_id : item.item.id)})
                            }
                        } >
                            <View style = {styles.info}>
                            { item.item.Profile_photo ? (
                            <Avatar source = {{ uri : item.item.Profile_photo }} rounded size = {'small'}/>
                            ) : (
                            <Avatar  title = { (item.item.Name).slice(0,2)} rounded size = {'small'} containerStyle = {{ backgroundColor : fun_database.get_random_color(item.item.Name.slice(0,1)) }}/>
                            ) }                               
                             <Text style = {styles.name}> {item.item.Name} </Text>
                            </View>
                        </TouchableOpacity>
                    ) }
                 />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {state}
}

const mapDispatchToProps = (dispatch) => ({
    current_chat : (param , pic , color , Index)=>dispatch({type:'current_chat' , name : param , Profile_photo : pic , Color : color , Index : Index })

})
    


export default connect(mapStateToProps, mapDispatchToProps)(Chats_FAB)

const styles = StyleSheet.create({
    item : {
        width : ScreenWidth,
        height : 0.08 * ScreenHeight,        
    },
    header : {
        height : 0.17 * ScreenHeight,
        width : ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
        flexWrap : 'nowrap',
    },
    header_title : {
        fontSize : 17,
        fontWeight : 'bold',
    },
    list : {
        flex : 1,
    },
    containerstyle : {
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    info : {
        width : 0.4 * ScreenWidth,
        height : 0.08 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    name : {
        fontSize : 14 , 
        fontWeight : 'bold'
    },
    empty_container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    divider : {
        borderWidth : 0.2,
    }
})
