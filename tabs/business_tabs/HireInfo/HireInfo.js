import { View, Text, ScrollView,TouchableOpacity, StyleSheet , Image } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Images from "./Image.js";
import { Ionicons } from "@expo/vector-icons";
import MetaInfo from "./MetaInfo.js";
import {connect} from 'react-redux'
import { widthToDp } from "rn-responsive-screen";
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers/index.js";
import Text_edit from "../../../components/business_editers/Text_edit.js";


function HireInfo(props) {
  const [job_info , setproduct_info] =useState(props.route.params['info'])
  const [edit , setedit] = useState(props.state.business_edit_done)
  const [type_of_input , settype_of_input]=useState()
  
    useEffect(() => {
  }, []);

  const submit_order = (count , id , success_func)=>{
    
  }


  return (
    <SafeAreaView style={styles.container}>
            <View style = {styles.header}>
        <View style = {{...styles.actions,width : 0.3 * ScreenWidth}}>
          <Ionicons
            style={styles.icon}
            onPress = {()=>{alert('back')}}
            name="arrow-back-outline"
            size={24}
            color={props.fun.Layout_Settings.Icons_Color}
          />
            <Text style={styles.title}>{job_info.Category}</Text>
        </View>
        
        <View style = {styles.actions}>
          <Ionicons
            style={styles.icon}
            onPress = {()=>{
              
            }}
            name="create"
            size={24}
            color={props.fun.Layout_Settings.Icons_Color}
          />
          <Ionicons
          style={styles.icon}
          onPress = {()=>{

          }}
          name="cart"
          size={24}
          color={props.fun.Layout_Settings.Icons_Color}
        />
        </View>
      </View>
      <ScrollView>
        {job_info && (
          <View>
            {/* <Images images={product_info.Showcase_images} /> */}
            <Image source = {require('../../../assets/Notifications.png')} style = {styles.image}/>
          </View>
        )}
        <MetaInfo job_info={job_info} />
      </ScrollView>
          {props.state.business_edit[0]?(<Text_edit product = {product_info} submit_function = {submit_order} type = {props.state.business_edit[1]} value = {''} icon = {'cart-arrow-down'} />):(null)}
    </SafeAreaView>
  );
}

let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
  
  }
  let mapDispatchToProps = (dispatch) => ({
    notifier : (action) => dispatch({type : 'done' , decide : action}),
  
  })

export default connect(mapStateToProps , mapDispatchToProps)(HireInfo)

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 10,
  },
  title : {
    color : 'white',
    fontSize : 15,
  },
  header : {
    width : ScreenWidth,
    height : 0.08 * ScreenHeight,
    backgroundColor : '#121212',
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between'
    
  },
  actions : {
    width : 0.4 * ScreenWidth,
    height : 0.08 * ScreenHeight,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-around',
  },
  image: {
    width: widthToDp(100),
    height: widthToDp(100),
  },
});