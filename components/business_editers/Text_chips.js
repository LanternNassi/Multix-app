import React, { Component , useState } from 'react'
import {View  , Text , StyleSheet , TouchableOpacity , Button , ScrollView , Dimensions} from 'react-native'
import { Avatar , Card , Icon} from 'react-native-elements'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TagInput from 'react-native-tags-input'
import  * as SQLite from 'expo-sqlite'




const come_out = {
    0 : {
        top : ScreenHeight

    },
    0.5 : {
        top : 0.5 * ScreenHeight,

    },
    1 : {
        top : 0.1 * ScreenHeight,

    }

}

const collapse = {
    0 : {
        top : 0.1 * ScreenHeight,

    },
    0.5 : {
        top : 0.5 * ScreenHeight,


    },
    1 : {
        top : 3 * ScreenHeight

    }

}

const mainColor = '#3ca897';
export class Text_chips extends Component{
    constructor(props){
        super(props)
        this.state = {
            value : this.props.value,
            done : false,
            tags_Certs: {
                tag: '',
                tagsArray: [...this.props.tags]
              },
            tagsColor: mainColor,
            tagsText: '#fff',
        }
    }
    
    updateTagState_Certifications = (state) => {
        this.setState({
          tags_Certs: state
        })
      };
    
    query_maker = ( type_of_profile ,table_name ,official_parameter) => {
        if (type_of_profile === 'business profile'  && table_name === 'Business_account'){
            return 'UPDATE ' + table_name +' SET ' + official_parameter + ' = ?'
        } else if (type_of_profile === 'Gig'){
            return 'UPDATE ' + table_name + ' SET ' + official_parameter + ' = ? WHERE Server_id = ?'  
        } else if (type_of_profile === 'business profile' && (table_name === 'Certifications' || table_name === 'Languages' ) ){
            return 'INSERT INTO ' + table_name + ' ( Account_id , Name , Server_id) VALUES (?,?,?)'
        } 
    }
    del_query_maker = (table_name) => {
        return 'DELETE FROM ' + table_name
    }

    update_profile = (type_of_profile , table_name , official_parameter , updated_value) =>{
        if (type_of_profile === 'business profile') {
            console.log(official_parameter , updated_value)
            if ( table_name === 'Business_account'){
                const db = SQLite.openDatabase('Business_database.db')
                db.transaction((tx) => {
                    tx.executeSql('UPDATE Business_account SET Preference_1 = ? , Preference_2 = ? , Preference_3 = ? , Preference_4 = ?',
                    [updated_value['Preference_1'],updated_value['Preference_2'],updated_value['Preference_3'],updated_value['Preference_4']],(tx,Result_set) => {
                        console.log(Result_set)
                        for (let i = 0; i < 5 ; i++ ){
                            this.props.update_profile_account_redux('Preference_'+(i+1) , updated_value['Preference_' + (i+1)])
                        }
                    } , (error) =>{
                        console.log(error)
                    })
                } , (error) => {} , () => {})

            }else {
                const db = SQLite.openDatabase('Business_database.db')
                db.transaction((tx) => {
                    tx.executeSql(this.del_query_maker(table_name),
                    [],(tx,Result_set) => {
                        console.log('passed')
                        this.props.update_rest_of_profile(this.props.mode , this.state.tags_Certs.tagsArray)
                        console.log(this.props.mode , this.state.tags_Certs.tagsArray)
                        for(let i = 0; i < updated_value.length; i++){
                            tx.executeSql(this.query_maker(type_of_profile , table_name , official_parameter ),
                            [1,updated_value[i][table_name ==='Certifications' ? ('Certification_name'):('Language')] ,updated_value[i]['id']] ,
                            (tx,Result) =>{console.log(Result);
                                
                            },(error) =>{console.log(error)}, 
                            )
                        }
                    } , (error) =>{
                        console.log(error)
                    })
                } , (error) => {} , () => {})
            }
            

        } else if (type_of_profile = 'Gig') {
            console.log(props.id , official_parameter , updated_value)
            const db = SQLite.openDatabase('Business_database.db')
            db.transaction((tx) => {
                tx.executeSql(query_maker(type_of_profile ,table_name ,official_parameter),
                [updated_value,props.id],(tx,Result_set) => {
                    console.log('update successfull')
                } , (error) =>{
                    console.log(error)
                })
            } , (error) => {} , () => {})

        }
        
    }

    

    render = () => {
        return (
            <Animatable.View animation = {this.props.action === 'come out' && !this.state.done ? come_out : collapse} style = {styles.container}>
                <ScrollView style = {{
                   
                }}>
                <Card containerStyle = {{
                    backgroundColor:'rgba(0,0,0,0.8)'
                }}>
                    <Card.Title style = {{
                        color : 'white'
                    }}> Change {this.props.type}</Card.Title>
                    <Card.Divider/>
                    <View style = {styles.text_input}>
                    <TagInput
                        updateState={this.updateTagState_Certifications}
                        tags={this.state.tags_Certs}
                        placeholder="Add Certifications..."  
                                                  
                        label="Press comma & space to add a tag"
                        labelStyle={{color: 'white', fontSize : 13,fontWeight : '700'}}
                        leftElement={<Icon name={'tag-multiple'} type={'material-community'} color={this.state.tagsText}/>}
                        leftElementContainerStyle={{marginLeft: 3}}
                        containerStyle={{width: 0.82 * ScreenWidth}}
                        inputContainerStyle={[styles.textInput, {backgroundColor: 'white'}]}
                        inputStyle={{color: this.state.tagsText}}
                        onFocus={() => this.setState({tagsColor: '#fff', tagsText: mainColor})}
                        onBlur={() => this.setState({tagsColor: mainColor, tagsText: '#fff'})}
                        autoCorrect={false}
                        tagStyle={styles.tag}
                        tagTextStyle={styles.tagText}
                        keysForTag={', '}/>
                    </View>
                    <Text style={{marginBottom: 10 , color : 'white'}}>
                        Tags help in providing detailed information about you which will helps clients approve you easily without wasting time
                        </Text>
                        <Card.Divider/>
                        <View style = {styles.buttons_container}>
                        <Button title = {'Confirm'} onPress = {
                            ()=>{
                                if (this.props.effect === 'business profile'){
                                    console.log('pressed')
                                    let overall_data = {'update' : {data : this.state.tags_Certs.tagsArray } , mode : this.props.mode ,type :this.props.type }
                                    console.log(overall_data)
                                    this.props.state.request_business_json({
                                        method : 'PUT',
                                        url : 'update_business_profile',
                                        data : overall_data,
                                    }).then((response) => {
                                        console.log(response.data)
                                        this.update_profile('business profile' , this.props.db_table , this.props.name,response.data)
                                        this.setState({done : true})                           
                                        setTimeout(()=>{
                                            this.props.notifier()
                                            this.setState({done : false})
                                        },800)
                                    })
                                } else if ( this.props.effect === 'Gig' ){
                                    let data = props.type
                                    let overall_data = {'update' : {data : this.state.tags_Certs.tagsArray } , mode : this.props.mode , Gig_id : this.props.id}
                                    this.props.state.request_business_json({
                                        method : 'PUT',
                                        url : 'update_gig',
                                        data : overall_data,
                                    }).then((response) => {
                                        console.log(response.data)
                                        //this.update_profile('Gig' , this.props.db_table , this.props.name,response.data)
                                        this.setState({done : true})                           
                                        setTimeout(()=>{
                                            this.props.notifier()
                                            this.setState({done : false})
                                        },800)
                                    })
                                }
                                
                            }
                        }/>
                            
                            <Button onPress = {
                                () =>{
                                    this.setState({done : true})                           
                                    setTimeout(()=>{
                                        this.props.notifier()
                                        this.setState({done : false})
                                    },800)
                                }
                            } title = {'Cancel'} titleStyle = {{ color : 'white' }} />
                                
                            
                             
                        </View>
                </Card>
                </ScrollView>
            </Animatable.View>
        )


    }
       
    
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}
    
}

const mapDispatchToProps = (dispatch) => ({
    notifier : () => dispatch({type : 'done' , decide : true , }),
    update_profile_account_redux : (name , value) => dispatch({ type : 'update_business_profile_account' , name : name , value : value }),
    update_rest_of_profile : (name , value) => dispatch({ type : 'update_bus_profile' , key : name , value : value }),

})

export default connect(mapStateToProps, mapDispatchToProps)(Text_chips)

const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        
        
    },
    text_input : {
        maxHeight : 0.7 * ScreenHeight,
        width : 0.84 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
    },
    buttons_container : {
        width : 0.82 * ScreenWidth,
        height : 0.08 * ScreenHeight,
        flexDirection :'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    button : {
        width : 0.4 * ScreenWidth,
        height : 48,
        borderRadius : 24,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    tag: {
        backgroundColor: '#fff',
       
        
      },
    tagText: {
        color: mainColor
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
