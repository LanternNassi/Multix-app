import { View, Text, Image, StyleSheet } from "react-native";
import React , {useEffect , useState}from "react";
import { widthToDp, heightToDp } from "rn-responsive-screen";
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import Button from "./Button";
import NumberFormat from 'react-number-format'
import {connect} from 'react-redux'



function ProductCard({ key, product,info,props}) {
  const [price , setprice] = useState(0)
  const [Type , setType] = useState('products')
  useEffect(()=>{
    if(product.Discount > 0){
      setType('deals')
      setprice(product.Price-((product.Discount/100) * product.Price))
    }else {

    }
  },[])
  return (
    <View style={{...styles.container , backgroundColor: info ? ('black'):('#121212')}} key={key}>
      <Image
        source={{
          uri: product.Showcase_images[0]
        }}
        // source = {require('../assets/Male_no_profile_pic.jpg')}
        style={styles.image}
      />
            <Text style={styles.title}>{(product.Name).length>15?((product.Name).slice(0,15)+'...'):(product.Name)}</Text>
            {(Type=='products')?(
              <Text style={styles.category}>{(product.Category).length>15?((product.Category).slice(0,15)+'...'):(product.Category)}</Text>
            ):(
              <NumberFormat value = { product.Price } displayType = {'text'}
                thousandSeparator = {true}
                prefix = {'shs.'}
                    renderText = {(value , props) => (
                        <Text style={styles.strike}>{value} </Text>
                    )}
              />
            )}
                       
      <View style={styles.priceContainer}>
        {(Type=='products')?(
          <NumberFormat value = { product.Price } displayType = {'text'}
          thousandSeparator = {true}
          prefix = {'shs.'}
              renderText = {(value , props) => (
                  <Text style={styles.price}>{value} </Text>
              )}
        />
        ):(
          <NumberFormat value = {price} displayType = {'text'}
          thousandSeparator = {true}
          prefix = {'shs.'}
              renderText = {(value , props) => (
                  <Text style={styles.price}>{value} </Text>
              )}
        />
        )}
      
      </View>
      <View style = {{...styles.cat ,
         justifyContent : (Type == 'deals')?("space-between"):("flex-end"),
         }}>
          {(Type=='deals')?(
            <Text style = {styles.discount}>{product.Discount}%  off</Text>
          ):(null)}
      <Button
            title="BUY"
            icon_color={'black'} style ={{backgroundColor:props.fun.Layout_Settings.Icons_Color}}
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
  

})

export default connect(mapStateToProps , mapDispatchToProps)(ProductCard)


const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    borderRadius: 10,
    marginBottom: heightToDp(4),
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    padding: 10,
    width: widthToDp(42),
  },
  image: {
    width :130,
    height: heightToDp(40),
    borderRadius: 7,
    marginBottom: heightToDp(2),
  },
  title: {
    fontSize: widthToDp(3.7),
    fontWeight: "bold",
    color:'white',
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: heightToDp(3),
  },
  category: {
    fontSize: widthToDp(3.4),
    color: "#828282",
    marginTop: 3,
    color:'white',
  },
  price: {
    fontSize: widthToDp(4),
    fontWeight: "bold",
    color:'white'
  },
  cat : {
    width : 0.38 * ScreenWidth,
    height : 0.06 * ScreenHeight,
    flexDirection : 'row',
    justifyContent : 'flex-end',
    alignItems : 'center'
  },
  strike : {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color:'white',
    fontSize: widthToDp(3.5),
  },
  discount : {
    color : 'red'
  }
});