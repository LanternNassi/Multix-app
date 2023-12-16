import { View, Text, StyleSheet , FlatList } from "react-native";
import React, { useState , useEffect } from "react";
import { height, heightToDp } from "rn-responsive-screen";
import {connect} from 'react-redux'
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProductCard from "../../../components/ProductCard";
import NumberFormat from 'react-number-format'
import Button from "../../../components/Button";
import { ScreenWidth } from "react-native-elements/dist/helpers";



function MetaInfo(props) {
  const [activeSize, setActiveSize] = useState(0);
  const [reduced_price , setreduced_price] = useState(0)
  const [Type , setType] = useState('products')
  
  const [related_products , setRelated_products] = useState([])

  const Get_related_products=(category,discount)=>{
    axios({
      method : 'GET',
      url : (props.state.Debug) ? ('http://192.168.43.232:8040/Getproducts/?category='+category+'&discount='+discount) : ('https://multix-fun.herokuapp.com/Getproducts/'),
      headers : { 
        'content-type' : 'application/json',
        'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
      }
    }).then((Response)=>{
      // console.log(Response.data)
      setRelated_products(Response.data)
    })
  }

  
  useEffect(()=>{
    if(props.product.Discount > 0){
      setType('deals')
      setreduced_price(props.product.Price-((props.product.Discount/100) * props.product.Price))
    }else {

    }
    Get_related_products(props.product.Category,0)
  },[])
  function button_event(){
    props.notifier([true,'Quantity'])
  }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{props.product.Name}</Text>
        <Button onPress={button_event} title={'Order'} icon_color={'black'} style ={{backgroundColor:props.fun.Layout_Settings.Icons_Color}}/>
        <View>
        <NumberFormat value = { props.product.Price } displayType = {'text'}
          thousandSeparator = {true}
          prefix = {'shs.'}
              renderText = {(value , props) => (
                  <Text style={{
                    ...styles.price,
                    fontSize : (Type == 'deals')?(13):(16),
                    textDecorationLine: (Type == 'deals')?('line-through'):('none'),
                  }}>{value} </Text>
              )}
        />
        {(Type == 'deals')?(
          <NumberFormat value = { reduced_price } displayType = {'text'}
            thousandSeparator = {true}
            prefix = {'shs.'}
                renderText = {(value , props) => (
                    <Text style={styles.price}>{value} </Text>
                )}
          />
        ):(null)}
          <Text style={styles.star}>⭐⭐⭐⭐</Text>
        </View>
      </View>
      <View style = {(Type =='deals')?({
        width : ScreenWidth * 0.9,
        justifyContent : 'space-between',
        alignItems : 'center',
        flexDirection : 'row'
      }):({})}>
      <Text style={styles.heading}>Description</Text>
      {(Type=='deals')?(
        <Text style = {styles.discount}>{props.product.Discount}% off</Text>
      ):(null)}
      </View>
      <Text style={styles.description}>{props.product.Description}</Text>

      <Text style={styles.heading}>Related products</Text>
      <View style={styles.row}>
        <FlatList
          horizontal = {true}
          data = {related_products}
          ListEmptyComponent = {()=>(
            <View >
                <Text style = {{
                  color : 'white',
                  fontSize : 13
                }}>No related products</Text>
            </View>
          )}
          renderItem = {(product,index)=>{
            if(product.item.id != props.product.id){
              return(
                <TouchableOpacity style = {{paddingLeft : index===0?(0):(13)}} key={product.item.id} onPress={()=>{
                  props.state.navigation.navigation.navigate('Multix')
                  setTimeout(()=>{
                    props.state.navigation.navigation.navigate('Info',{'info':product.item})
                  },100)

                }}>
                  <ProductCard product={product.item} info = {true} props ={props}/>
                </TouchableOpacity>
              )
            } else{
              return null
            }
            }}
        />
      </View>

      
    </View>
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

export default connect(mapStateToProps , mapDispatchToProps)(MetaInfo)

const styles = StyleSheet.create({
  container: {
    marginTop: heightToDp(-5),
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height: heightToDp(80),
    padding: heightToDp(5),
  },
  title: {
    // fontSize: heightToDp(5),
    fontSize : 15,
    fontWeight: "bold",
    color : 'white',
  },
  row: {
    paddingTop : 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    // fontSize: heightToDp(5),
    fontSize : 16,
    fontWeight: "bold",
    color: "white",
  },
  heading: {
    fontSize: heightToDp(5),
    marginTop: heightToDp(3),
    color: "white",
  },
  star: {
    fontSize: heightToDp(3),
    marginTop: heightToDp(1),
  },
  sizeTag: {
    borderColor: "#C37AFF",
    backgroundColor: "#F7F6FB",
    color: "#000",
    paddingHorizontal: heightToDp(7),
    paddingVertical: heightToDp(2),
    borderRadius: heightToDp(2),
    marginTop: heightToDp(2),
    overflow: "hidden",
    fontSize: heightToDp(4),
    marginBottom: heightToDp(2),
  },
  description: {
    fontSize: heightToDp(4),
    color: "#aaa",
    marginTop: heightToDp(2),
  },
  discount : {
    color : 'red'
  }
});