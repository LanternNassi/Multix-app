import React , {useState , useEffect} from 'react'
import {View , Text , StyleSheet , Keyboard , ScrollView , FlatList , TextInput , TouchableOpacity} from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import JobCard from '../../components/JobCard'
import { widthToDp } from "rn-responsive-screen";
import * as Progress from 'react-native-progress'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';


export const Hires = (props) => {
    const [hires , setHires] = useState([])
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [IsReady , SetIsReady] = useState(false)

    const get_hires = (category , amount) =>{
        axios({
            method : 'GET',
            url : 'http://192.168.43.232:8040/Get_Hires/?Amount='+amount+'&Category='+category+'',
            headers : { 
                'content-type' : 'application/json',
                'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
              }
        }).then((response)=>{
            if (response.status == 200){
                setHires(response.data)
                SetIsReady(true)
            }
        })

    }

    const search_hires = (amount, category, keywords) => {
        axios({
            method : 'GET',
            url : 'http://192.168.43.232:8040/Search_Hires/?Amount='+amount+'&Category='+category+'&keywords='+keywords,
            headers : { 
                'content-type' : 'application/json',
                'Authorization': 'Token ' +  props.fun.Fun_profile['Multix_token'] ,
              }
        }).then((response)=>{
            if (response.status == 200){
                setHires(response.data)
                SetIsReady(true)
            }
        })
    }

    useEffect(()=>{
        get_hires('all',0);
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
    },[])


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
                            search_hires(0,'all',text)
                        }else{
                          
                        }
                    } else{
                        SetIsReady(false)
                        search_hires(0,'all','all')
                    }
                    
                }
            }
              placeholder = {' Search Job'} />

        </View>
        {IsReady?(
          <FlatList
                // style = {{
                //     width : ScreenWidth,
                //     height : 0.2 *ScreenHeight,
                // }}
                data={hires}
                contentContainerStyle = {styles.products}
                renderItem = {({item,index})=>{
                    return (
                        <TouchableOpacity key={index} onPress={()=>{
                            props.state.navigation.navigation.navigate('Job Info',{'info':item})
                        }}>
                          <JobCard Job = {item} info = {false} />
                        </TouchableOpacity>
                    )
                   
                }}

          />
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
  )
}

let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}

}

let mapDispatchToProps = (dispatch) => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(Hires)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      },
    products: {
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
})