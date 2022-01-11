import React , {Component} from 'react';
import { FlatList , Text , View , TouchableOpacity , StyleSheet } from 'react-native';
import {  Avatar ,  } from 'react-native-elements';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

class Songs_movies extends Component {

    render = () => {
        return(
            <View style = {styles.container}>
                <TouchableOpacity style = {styles.title}>
        <Text style = {{ color : 'black', fontWeight : 'bold', fontSize : 21, elevation :8 }}>{this.props.genre}</Text>
                </TouchableOpacity>

            <FlatList
                data = {this.props.name} 
                horizontal = {true}
                alwaysBounceHorizontal = {true}
                showsHorizontalScrollIndicator = {false}
                contentContainerStyle = {styles.list}
                renderItem = {
                    (item) => (
                        <TouchableOpacity style = {styles.item}>
                            <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                            <Avatar rounded containerStyle = {{elevation : 5,}} source = {require('../../assets/Notifications.png')} size = {'medium'}/>
                            </View>
                            <Text style = {{fontWeight : '600', color : 'black'}}>Hell Boy</Text>
                        </TouchableOpacity>
                    )
                } 
            
            
            />
            </View>



        )
    }



} 

export default Songs_movies

const styles = StyleSheet.create({
    container : {
        height : 120,
        width : ScreenWidth,
        backgroundColor : 'transparent',
        top : 3,
        alignItems : 'center'

    },
    title : {
        height : 30,
        width : ScreenWidth-20, 
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'transparent',
    

    },
    list : {
        
        height : 80,
        top : 10,
    },
    item : {
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingLeft: 9,
        paddingRight : 9,
        
    }
   
})