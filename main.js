import Stackscreens from './Stackscreens.js'
import { registerRootComponent } from 'expo';
import { Provider,connect } from 'react-redux';
import React , {Component} from 'react'
import {View , Text} from 'react-native'
import store from './redux/Default_State/State.js'
import {Provider as Paper , DarkTheme , DefaultTheme , ThemeProvider } from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';


export default function main() {
    return (
        <Paper theme = {DarkTheme} settings = {{ icon: props => <AwesomeIcon {...props}  /> }}>
            <ThemeProvider theme = {DarkTheme}>
        <Provider store = {store}>
            <Stackscreens/>
        </Provider>
        </ThemeProvider>
        </Paper>
    )
}

