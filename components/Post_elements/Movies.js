import React , {Component} from 'react'
import {Text , FlatList , StyleSheet , View} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Avatar ,   } from 'react-native-elements';
import songs_movies from './Songs_movies.js'
import { ScreenWidth } from 'react-native-elements/dist/helpers';



const Tab = createMaterialTopTabNavigator();

export default class Movies extends Component {
    render = () => {
    return (
        <View style = {styles.section}>

        <Tab.Navigator
            
            tabBarOptions = {{
              inactiveTintColor : 'red',
              showLabel : 'true',
          }}>
              
              <Tab.Screen name="All" > {props => <songs_movies {...props} names = {this.props.name} /> } </Tab.Screen>
              <Tab.Screen name="Action" > {props => <songs_movies {...props} names = {this.props.name} /> } </Tab.Screen>
              <Tab.Screen name="Adventures" > {props => <songs_movies {...props} names = {this.props.name} /> } </Tab.Screen>
              <Tab.Screen name="Horrors" > {props => <songs_movies {...props} names = {this.props.name} /> } </Tab.Screen>
        </Tab.Navigator>
          
            
        </View>
    )
        }
    
}

const styles = StyleSheet.create ({
    section : {
        width : ScreenWidth,
        height : 100,
        
    }


})
