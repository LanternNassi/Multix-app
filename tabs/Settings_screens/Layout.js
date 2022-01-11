import React, { Component } from 'react'
import {StyleSheet , View , Text , TouchableOpacity , ScrollView } from 'react-native'
import { ListItem , Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import {ColorPicker} from 'react-native-color-picker'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import * as SQLite from 'expo-sqlite'
import fun_database from '../../redux/Database_fun_transactions'

export class Layout extends Component {
    state = {
        component : ''
    }
    query_maker = (component , color) =>{
        return (
            'UPDATE Layout_Settings SET ' +component+' = ? WHERE id =1'
        )
    }

    update_color = async (component , color) => {
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            tx.executeSql(this.query_maker(component,color),
            [color],(tx,result)=>{

            },(error)=>{})
        },(error)=>{},()=>{})
    }

    render() {
        return (
            <View style = {styles.container}>
                <View style = {styles.colorpicker}>
                <Text style  = {{ fontWeight : 'bold' }}> { this.state.component } </Text>
                    <ColorPicker
                        onColorSelected={async color => {
                            if (this.state.component){
                                this.props.update_layout(this.state.component,color)
                                await this.update_color(this.state.component,color)
                            } else {
                                alert('Please first select a component to update')
                            }
                        }}
                        style={{flex: 1}}
                    />
                </View>
                <ScrollView style = {{ flex : 1 }}>
                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Icons_Color' })
                    }
                } >
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Icons </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the icons </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Icons_Color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Icons_surroundings'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Icons Surrondings  </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the surrondings of the icons </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Top_navigation'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Top Navigator </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the top navigator </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Top_navigation  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Bottom_navigation'})
                    }
                } >
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Bottom Navigator Color </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the bottom navigator  </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Bottom_navigation  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Message_component' })
                    }
                } >
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title>Message component color </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the message component  </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Message_component  }} />
                </ListItem>
                </TouchableOpacity>


                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Online_color'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title>Online badge color </ListItem.Title>
                    <ListItem.Subtitle> Change the color of the online badge color  </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Online_color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Sender_component'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Sender message component  </ListItem.Title>
                    <ListItem.Subtitle> Change the sender message component color   </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Sender_component  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Sender_text_color'})
                    }
                } >
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Sender message text  </ListItem.Title>
                    <ListItem.Subtitle> Change the sender message text color </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Sender_text_color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Message_text_color'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Message text  </ListItem.Title>
                    <ListItem.Subtitle> Change the message text color   </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Message_text_color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Bottom_navigation_icons_color'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Bottom Navigation icons  </ListItem.Title>
                    <ListItem.Subtitle> Change the bottom navigation icons color</ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Bottom_navigation_icons_color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        this.setState({component : 'Header_color'})
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Header  </ListItem.Title>
                    <ListItem.Subtitle> Change the Header color</ListItem.Subtitle>
                    </ListItem.Content>
                    <View style = {{ ...styles.badge , backgroundColor : this.props.fun.Layout_Settings.Header_color  }} />
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    async () => {
                        let defaults = await fun_database.reset_theme_default()
                        this.props.store_Layout_settings(defaults)
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'warning' , color : this.props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Default Lay out  </ListItem.Title>
                    <ListItem.Subtitle> Reset to default layout settings</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                </TouchableOpacity>

                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let fun  = state.fun
    let business = state.business
    return {fun , business}   
}

const mapDispatchToProps = (dispatch) => ({
    update_layout : (component,color) => dispatch({ type : 'update_layout_color' , component : component , color : color }),
    store_Layout_settings : (content) => dispatch({type : 'Layout_Settings' , content : content}),

}) 
    


export default connect(mapStateToProps, mapDispatchToProps) (Layout)

const styles = StyleSheet.create({
    container : {
        flex : 1,       
    },
    colorpicker : {
        height : 0.43 * ScreenHeight,
        
    },
    badge : {
        height : 10,
        width : 10,
        borderRadius : 5,
    }

})
