import { View, Text, ScrollView,TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Images from "./Image.js";
import { Ionicons } from "@expo/vector-icons";
import MetaInfo from "./MetaInfo.js";
import {connect} from 'react-redux'
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers/index.js";
import Text_edit from "../../../components/business_editers/Text_edit.js";


function ProductInfo(props) {
  const [product_info , setproduct_info] =useState(props.route.params['info'])
  const [edit , setedit] = useState(props.state.business_edit_done)
  const [type_of_input , settype_of_input]=useState()
  
    useEffect(() => {
  }, []);

  const submit_order = (count , id , success_func)=>{
    axios({
      method : 'POST',
      url : (props.state.Debug)? ('http://192.168.43.232:8040/Create_order/') : (''),
      data : {
        'count' : count,
        'id' : id,
        'Snapshot_price' : product_info.Price - ((product_info.Discount/100)*product_info.Price)
      },
      headers : {
        'content-type' : 'application/json',
        'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
      }
    }).then((response)=>{
      if (response.status == 200){
        success_func()
      }else {
        alert('Something went wrong with creating your order')
      }
    })

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
            <Text style={styles.title}>{product_info.Category}</Text>
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
        {product_info && (
          <View>
            <Images images={product_info.Showcase_images} />
          </View>
        )}
        <MetaInfo product={product_info} />
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

export default connect(mapStateToProps , mapDispatchToProps)(ProductInfo)

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
  }
});