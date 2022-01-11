import React, { Component , useEffect , useState } from 'react'
import { View , TextInput , Text , ScrollView , StyleSheet , TouchableOpacity, Picker, Dimensions } from 'react-native'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Avatar , Card , Icon } from 'react-native-elements'
import { Sae , Fumi } from 'react-native-textinput-effects';
import { connect } from 'react-redux'
import DropDownPicker from 'react-native-dropdown-picker';
import TagInput from 'react-native-tags-input'




export const Extra_info = (props) => {
    const [ Type , setType ] = useState('')
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [Days , setDays] = useState('')
    const [pressed , setpressed] = useState(false)
    const [items, setItems] = useState([
        {label: 'Multix Express', value: 'Multix Express'},

    ]);
    const [tags_Pref , settags_Pref] = useState({
        tag : '',
        tagsArray : []
    })
    const [tagsColor , settagsColor] = useState('#3ca897')
    const [tagsText , settagsText] = useState('#fff')


    
    const payments_list = ['JCB']

    const updateTagState_Preferences = (state) => {
          settags_Pref(state)
      };

    useEffect(()=>{
        const {type} = props.route.params
        setType(type)
    } , [])
    return (
        <ScrollView style = {styles.container}>
             <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ width : 0.9 * ScreenWidth, justifyContent : 'space-between' , alignItems : 'center' , height : 0.14 * ScreenHeight }}>
                <Avatar rounded icon = {{ name : 'check' , size : 18 , type : 'font-awesome' }} containerStyle = {{
                    backgroundColor : 'green'
                }} />
                <Text style = {styles.disclaimer}>Please take a step to make your gig a stand out by carefully filling the steps</Text>
            </View>
            <View style = {styles.input_container} >
                { Type === 'Hiring' ? (
                    <Sae
                    style = {{ width : ScreenWidth-10 , backgroundColor : 'white'}}
                    label={'Expected number of days for the completion '}
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={'black'}
                    inputPadding={16}
                    labelHeight={24}
                    // active border height
                    borderHeight={2}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={true}
                    inputStyle = {{ color : 'black',fontSize : 15 }}
                    keyboardType = {'numeric'}
                    onChangeText = {
                        (text) => {
                            setDays(text)
                        }
                    }
                />
                ) : (<View/>) }
            
            <View style = {{
                height : 0.11 * ScreenHeight,
                justifyContent : 'space-between',
                alignItems : 'flex-start'
            }}>
                <Text style = {{
                    fontSize : 13,
                    fontWeight : 'bold'
                }}>Select a type of payment</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                />
            </View>
            { Type === 'Hiring' || Type === 'Hot deals' ? (
                <TagInput
                    updateState={updateTagState_Preferences}
                    tags={tags_Pref}
                    placeholder="Add Preferences eg CV , ..."                            
                    label="Press comma & space to add a tag "
                    labelStyle={{color: 'black', fontSize : 13,fontWeight : '700'}}
                    leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={tagsText}/>}
                    leftElementContainerStyle={{marginLeft: 3}}
                    containerStyle={{width: (Dimensions.get('window').width ) }}
                    inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
                    inputStyle={{color: tagsText}}
                    onFocus={() =>{settagsColor('#fff'); settagsText('#3ca897')}}
                    onBlur={() => { settagsColor('#3ca897') ; settagsText('#fff')}}
                    autoCorrect={false}
                    tagStyle={styles.tag}
                    tagTextStyle={styles.tagText}
                    keysForTag={', '}/>
            ) : (<View/>) }
            


  </View>
  <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        <TouchableOpacity onPress = {
            () => {
                if (!pressed){
                    setpressed(true)
                    if (Type === 'Hiring'){
                        props.send_days(Days)
                    }
                    props.send_Payment(value)
                    if (Type === 'Hiring' || Type === 'Hot deals'){
                        props.send_Prefs(tags_Pref['tagsArray'])
                    }
                    props.send_Payment(value)
                    props.state.navigation.navigation.navigate('Show Case' , { type : Type })
                }
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>
            
        </ScrollView>
    )
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
    
}

const mapDispatchToProps = (dispatch) => ({
    send_days : (Days) => dispatch({ type : 'gig_word_info' , key : 'Gig_days_of_completion' , value : Days }),
    send_Payment : (Payment) => dispatch({ type : 'gig_word_info' , key : 'Gig_payment_mode' , value : Payment }),
    send_Prefs : (Prefs) => dispatch({ type : 'gig_add_info' , value : Prefs }),
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Extra_info)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        
        flex : 1,
        
    },
    disclaimer : {
        color : 'black',
        fontSize : 14,
        fontWeight : '700',
    },
    input_container : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : ScreenHeight * 0.5,
        width : ScreenWidth ,
  

    },
    tag: {
        backgroundColor: '#fff',
       
        
      },
    tagText: {
        color: '#3ca897'
      },
    textInput: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 25,
    padding: 3,
    },


})
