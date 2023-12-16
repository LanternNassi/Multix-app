import { ScrollView, StyleSheet,TouchableOpacity, View, TextInput,Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import ProductCard from "../../components/ProductCard";
import { widthToDp } from "rn-responsive-screen";
import axios from "axios";
import {connect} from 'react-redux'
import * as Progress from 'react-native-progress'



function ProductsScreen(props) {
  const [products, setProducts] = useState([
    

  ]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [IsReady , SetIsReady] = useState(false)
  

  const Get_products=(category , discount)=>{
    axios({
      method : 'GET',
      url : (props.state.Debug) ? ('http://192.168.43.232:8040/Getproducts/?category='+category+'&discount='+discount) : ('https://multix-fun.herokuapp.com/Getproducts/'),
      headers : { 
        'content-type' : 'application/json',
        'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
      }
    }).then((Response)=>{
      // console.log(Response.data)
      setProducts(Response.data)
      SetIsReady(true)
    })
  }

  const search_product=(keywords , discount)=>{
    axios({
      method : 'GET',
      url : (props.state.Debug) ? ('http://192.168.43.232:8040/SearchProduct/?keywords='+keywords+'&discount='+discount) : ('https://multix-fun.herokuapp.com/Getproducts/'),
      headers : { 
        'content-type' : 'application/json',
        'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
      }
    }).then((Response)=>{
      console.log(Response.data)
      setProducts(Response.data)
      SetIsReady(true)
    })
  }
  useEffect(() => {
    if (props.type == 'products'){
      Get_products('all',0);
    } else {
      Get_products('all',1);
    }
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Keyboard.dismiss() // or some other action
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
              <View style = {styles.searchcontainer}>
            <TextInput style = {styles.search_bar}
            
            onChangeText = {
                (text) =>{
                    if (text){
                        var info = text.split('')
                        if ((info.length) >= 3) {
                            SetIsReady(false)
                            if (props.type == 'products'){
                              search_product(text,0)
                            }else {
                              search_product(text,1)
                            }
                        }else{
                          
                        }
                    } else{
                        SetIsReady(false)
                        if (props.type == 'products'){
                          search_product('all',0)
                        }else {
                          search_product('all',1)
                        }
                    }
                    
                }
            }
              placeholder = {' Search Product'} />

        </View>
        {IsReady?(
          <ScrollView>
            <View style={styles.products}>
            {products.map((product) => (
                <TouchableOpacity key={product.id} onPress={()=>{
                  props.state.navigation.navigation.navigate('Info',{'info':product})
                }}>
                  <ProductCard product={product} info ={false} props={props} />
                </TouchableOpacity>
              ))
            }
            </View>
          </ScrollView>
        ):(
          <View style = {{
              flex : 1,
              alignItems : 'center',
              justifyContent : 'center',
            }}>
            <Progress.CircleSnail  size = { 60 } progress = {0.7} color = {'white'} />
        </View>
        )}
      
    </View>
  );
}

let mapStateToProps = (state_redux) => {
  let state = state_redux.business
  let fun = state_redux.fun
  return {state,fun}

}
let mapDispatchToProps = (dispatch) => ({
  

})
export default connect(mapStateToProps , mapDispatchToProps)(ProductsScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  products: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: widthToDp(100),
    paddingHorizontal: widthToDp(4),
    paddingBottom : 10,
    justifyContent: "space-between",
  },
  search_bar : {
    width : 0.8 * ScreenWidth,
    height : 40,
    borderBottomWidth : 1,
    borderRadius : 10,
    paddingLeft : 20,
    backgroundColor : 'white'
  },
  searchcontainer : {
    // backgroundColor : 'red',
    height : 0.1 * ScreenHeight,
    alignItems : 'center',
  }
});