import React, {useState , useEffect} from 'react'
import {View , Text , StyleSheet , FlatList , TouchableOpacity , Image} from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { ScreenWidth , ScreenHeight } from 'react-native-elements/dist/helpers'
import NumberFormat from 'react-number-format'


export const Orders = (props) => {
    const [orders , set_orders] = useState([])

    const Get_orders = () => {
        axios({
            method : 'GET',
            url : (props.state.Debug) ? ('http://192.168.43.232:8040/Get_orders/') : (''),
            headers : {
                'content-type' : 'application/json',
                'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
            }
        }).then((response)=>{
            if(response.status == 200){
                console.log(response.data)
                set_orders(response.data)
            }
        })
    }

    const shortener = (Name) => {
        if (Name.length>10){
            return Name.slice(0,10) + "..."
        }else {
            return Name
        }      
    }

    useEffect(()=>{
        Get_orders()
    },[])

  return (
    <View style={styles.container}>
        <FlatList
        contentContainerStyle = {styles.flatlist}
            data = {orders.reverse()}
            renderItem = {(item , index)=>{
                console.log(item)
                return (
                    <TouchableOpacity style = {styles.item}>
                        <View style = {styles.header}>
                            <Image source = {{uri : item.item.Product_info.Images[0] }} style = {styles.thumbnail} />
                            <View>
                                <Text style = {{color:'white' , fontWeight: "bold",}}>{shortener(item.item.Product_info.Name)}</Text>
                                <NumberFormat value = {item.item.Snapshot_price} displayType = {'text'}
                                    thousandSeparator = {true}
                                    prefix = {'shs.'}
                                        renderText = {(value , props) => (
                                            <Text style = {{color : 'white'}}>{value} x {item.item.count}</Text>
                                           
                                        )}
                                />
                            </View>
                        </View>
                        <View style = {styles.status}>
                            <Text style = {{color : 'white'}}>{(item.item.Date_created).slice(0,10)}</Text>
                            <Text style = {{color : 'white'}}>Status : {item.item.Status}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }}
        />

    </View>
  )
}

let mapStateToProps = (state_redux) => {
  let state = state_redux.business
  let fun = state_redux.fun
  return {state,fun}

}
let mapDispatchToProps = (dispatch) => ({
  

})

export default connect(mapStateToProps, mapDispatchToProps)(Orders)

const styles  = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "black",
        alignItems : 'center'
        
    },
    item : {
        width : 0.95 * ScreenWidth,
        height : 0.1 * ScreenHeight,
        borderRadius : 10,
        backgroundColor : '#121212',
        elevation : 6,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
    },
    header : {
        flexDirection : 'row',
        width : 0.5 * ScreenWidth,
        height : 0.1 * ScreenHeight,
        justifyContent : 'space-around',
        alignItems : 'center',

    },
    thumbnail : {
        height : 0.08 * ScreenHeight,
        width : 0.08 * ScreenHeight,
        borderRadius : 0.04 * ScreenHeight,
        elevation : 4,
    },
    flatlist : {
        paddingTop : 20,
        // backgroundColor : 'red',
        paddingBottom : 20
    },
    status : {
        width : 0.35 * ScreenWidth,
        alignItems : 'center'
    }

})