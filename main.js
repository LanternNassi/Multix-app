import Stackscreens from './Stackscreens.js'
import { registerRootComponent } from 'expo';
import { Provider,connect } from 'react-redux';
import React , {Component} from 'react'
import {View , Text} from 'react-native'
import store from './redux/Default_State/State.js'
import {Provider as Paper , DarkTheme , DefaultTheme , ThemeProvider } from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';


export default function main() {
    return (
        <Paper settings = {{ icon: props => <AwesomeIcon {...props}  /> }}>
        <Provider store = {store}>
        <StatusBar style="light" />
            <Stackscreens/>
        </Provider>
        </Paper>
    )
}

