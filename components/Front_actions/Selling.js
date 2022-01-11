import React, { Component , useState , useEffect } from 'react'
import { StyleSheet , View , Text , TouchableOpacity , FlatList} from 'react-native'
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenHeight , ScreenWidth} from 'react-native-elements/dist/helpers'
import * as Animatable from 'react-native-animatable'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'




export const Selling = (props) => {
    const [ gig , Setgig ] = useState(props.route.params['account'])
    const [Description , setDescription] = useState('')
    const [submitted , Setsubmitted] = useState(false)
    const [suggestions , Setsuggestions] = useState([])
    useEffect(()=>{
        console.log(props.route.params['account'])
    },[])
    const submit = (info) =>{
        props.state.request_business_json({
            method : 'POST',
            url : 'selling_create',
            data : info,
        }).then((response)=>{
            if (response.status === 202){
                console.log(response.data)
                Setsuggestions(response.data['Suggestions'])
                Setsubmitted(true)
                const data = {
                    'type' : 'Selling',
                    'gig' : gig.Gig_name,
                    'Name' : gig.Name,
                    'account_id' : gig.Account_id,
                    'notification' : {
                        'Type' : 'Selling',
                        'Date' : response.data['Date'],
                        'Type_id' : response.data['Selling_id'],
                    },
                    'contract_id' : response.data['contract_id']
                }
                console.log('sent')
                props.state.ws_gig_notifications.sendMessage(data)
            }
        })
    }
    if (!submitted){
        return (
            <View style = {styles.container}> 
                <View style = {styles.holder}>
                    <View style = {styles.avatar}>
                        <Avatar rounded source = {{ uri : gig.ShowCase_1 }} size = {'medium'}/>
                        <Animatable.Text animation="pulse" iterationCount={'infinite'} style = {{
                            fontSize : 25,
                            fontWeight : 'bold'
                        }}>
                            Interested in { gig.Gig_name } ???
                        </Animatable.Text>
                    </View>
                    <View style = {styles.extra_info}>
                        <Text style = {{
                            fontSize : 14,
                            fontWeight : 'bold',
                        }}>
                            Say something to {gig.Name} about his gig {gig.Gig_name} 
                        </Text>
                        <Fumi
                            onChangeText = {text => {
                                setDescription(text)
                            }}
                            label = {'Say something about your specifications '}
                            
                            iconClass={FontAwesomeIcon}
                            iconName={'user'}
                            iconSize={20}
                            iconWidth={40}
                            inputPadding={16}
                            inputStyle = {{ color : 'black',fontSize: 15, }}
                            style = {{ width : 0.9 * ScreenWidth }}
                            height = {0.28 * ScreenHeight}
                            multiline = {true}
                        />
                        
                    </View>
                    <TouchableOpacity onPress = {
                        () => {
                            const info_submit = {}
                            info_submit['id'] = gig['Gig_id']
                            info_submit['Account_id'] = gig['Account_id']
                            const info = {}
                            info['gig_id'] = gig['Gig_id']
                            //info['Account_id_of_customer'] = gig['Account_id']
                            info['Extra_info'] = Description
                            info['Approved'] = false
                            info_submit['info'] = info
                            submit(info_submit)

                        }
                    }
                     style = {{...styles.proceed_btn , backgroundColor : props.state.theme.icons_surrounding}}>
                         <Text style = {{color : 'white'  }}> Proceed </Text>
                    </TouchableOpacity>
                </View>
    
            </View>
       )

    }else if (submitted){
        return (
            <View style = {styles.container}>
                <View style = {{ ...styles.holder , height : 0.5 * ScreenHeight  }}>
                    <Text style = {{
                        fontSize : 20,
                        fontWeight : 'bold',
                    }}> You might want to also look at... </Text>
                    <View style = {{ ...styles.avatar , height : 0.2 * ScreenHeight}}>
                        <Text style = {{
                            fontSize : 13,
                            fontWeight : 'bold',
                        }}> We picked a few gigs you might be Interested in from {gig.Name} collection</Text>
                        <View style = {{
                            height : 0.13 * ScreenHeight,
                            width : 0.9 * ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',
                        }}>
                        <FlatList
                            data = {suggestions}
                            style = {{ flex : 1 }}
                            horizontal = {true}
                            showsHorizontalScrollIndicator = {false}
                            renderItem = {
                                (item , index)=>(
                                    <TouchableOpacity style = {styles.item} onPress = {
                                        () => {
                                            console.log(item.item)
                                        }
                                    }>
                                        <View style = {{width : 60 , height : 60 , justifyContent : 'center' , alignItems : 'center', elevation : 5 , backgroundColor : 'white', borderRadius : 30}}>
                                       
                                        <Avatar rounded containerStyle = {{elevation : 5,}} source = {{uri : item.item.ShowCase_1}} size = {'medium'}/>
                                        </View>
                                            <Text style = {{fontWeight : '600', color : 'black'}}> { (item.item.Gig_name).length > 7 ? ((item.item.Gig_name).slice(0,7) + '...')
                                            :(item.item.Gig_name) } </Text>
                                    </TouchableOpacity>
                                )
                            }
                        />
                        </View>
                    </View>
                    <TouchableOpacity
                     style = {{...styles.proceed_btn , backgroundColor : props.state.theme.icons_surrounding}}>
                         <Text style = {{color : 'white'  }}> Proceed to profile </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
  

}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}   
}

const mapDispatchToProps = (dispatch) => ({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Selling)


const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    holder : {
        height : 0.85 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center'
    },
    avatar : {
        height : 0.1 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-between',
        alignItems : 'center',
    },
    extra_info : {
        width : 0.9 * ScreenWidth,
        height : 0.37 * ScreenHeight,
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    proceed_btn : { 
        width : 180 ,
        height : 42 ,
        borderRadius :21  , 
        justifyContent : 'center' , 
        alignItems : 'center' 
    },
    item : {
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingLeft: 14,
        paddingRight : 14,  
    },

})
