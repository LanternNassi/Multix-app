import * as FileSystem from 'expo-file-system'
import React from 'react';
import * as SQLite from 'expo-sqlite'
import {connect} from 'react-redux';

export class business_database{
   
    static business_data =  () => {
        const db = SQLite.openDatabase('Business_database.db')
        const profile = {}
        db.transaction(
            (tx) => {
                tx.executeSql('SELECT * FROM Business_account',[],(tx,Result) => {
                    console.log('account done')
                    if (Result.rows.length > 0) {
                        profile['Account'] = Result.rows.item(0)
                        tx.executeSql('SELECT * FROM Billing_info' , [] , (tx,Result) => {
                            if (Result.rows.length > 0){
                                profile['Billing information'] = Result.rows.item(0)
                                tx.executeSql('SELECT * FROM Certifications' , [] , (tx , Result) => {
                                    if (Result.rows.length > 0) {
                                        const certs = []
                                        for(let i = 0; i < Result.rows.length; i++){
                                            let number = certs.push(Result.rows.item(i).Name)
                                        }
                                        profile['Certifications'] = certs
                                    }
                                    // Fetching all Contracts associated with the account
                                    tx.executeSql('SELECT * FROM Contracts',
                                    [],(tx,Result_conts) => {
                                        if (Result_conts.rows.length > 0){
                                            profile['Contracts'] = []
                                            for(let a = 0; a < Result_conts.rows.length; a++){
                                                profile['Contracts'].push({...Result_conts.rows.item(a)})
                                            }
                                        } 

                                    },(error) => {console.log(error)})
                                    //Fetching all Languages associated with the account
                                    tx.executeSql('SELECT * FROM Languages',
                                    [],(tx,Result_conts) => {
                                        if (Result_conts.rows.length > 0){
                                            const Langs = []
                                            for(let i = 0; i < Result_conts.rows.length; i++){
                                                let number_conts = Langs.push(Result_conts.rows.item(i).Name)
                                            }
                                            profile['Languages'] = Langs
                                        } else {
                                            profile['Languages'] = []
                                        }

                                    },(error) => {console.log(error)})
                                    //Fetching all transactions associated with the account
                                    tx.executeSql('SELECT * FROM Transactions',
                                    [],(tx,Result_trans) => {
                                        if (Result_trans.rows.length > 0){
                                            profile['Transactions'] = []
                                            for(let a = 0; a < Result_conts.rows.length; a++){
                                                profile['Transactions'].push({...Result_trans.rows.item(a)})
                                            }
                                        }},(error) =>{console.log(error)})
                                    
                                }, (error) => {console.log(error + ' from Certs ')})
                            }
                             //
                        } , (error) => {console.log(error) } )
                    }else {

                    }
                } , error => {console.log(error + 'from account')})
            },(error) =>{
                console.log(error)
            },
            () => {
                console.log('Success')
                //console.log(profile)
                
            }
        )
        return profile
    }
    static gig_data = () => {
        const db = SQLite.openDatabase('Business_database.db')
        let Gigs = []
        db.transaction((tx)=>{
            //Fetching all gigs associated with the account
            tx.executeSql('SELECT * FROM Gigs',
            [],(tx,Result_gigs)=>{
                for(let b = 0; b < Result_gigs.rows.length; b++){
                    //getting the gig id for all the queries
                    const gig_id = Result_gigs.rows._array[b].id
                    const gig = { Gig_info : {...Result_gigs.rows._array[b]}}
                    //Fetching all the applicants associated with the gig 
                    tx.executeSql('SELECT * FROM Gig_Applicant WHERE Gig_id = ?',
                    [gig_id],(tx,Result_applicants) => {
                        gig['Gig_applicants'] = []
                        console.log('Gigs applicants done')
                        if (Result_applicants.rows.length > 0){
                            for(let a = 0; a < Result_applicants.rows.length; a++){
                                gig['Gig_applicants'].push({...Result_applicants.rows.item(a)})
                            }
                        } 

                    },(error) => {console.log(error)})
                    //Fetching all the Gig projects associated with the gig 
                    tx.executeSql('SELECT * FROM Gig_Project WHERE Gig_id = ?',
                    [gig_id],(tx,Result_projects) => {
                        console.log('Gigs projects done')
                        gig['Gig_projects'] = []
                        if (Result_projects.rows.length > 0){
                            for(let a = 0; a < Result_projects.rows.length; a++){
                                gig['Gig_projects'].push({...Result_projects.rows.item(a)})
                            }
                        } 

                    },(error) => {console.log(error)})
                    //Fetching all the transactions associated with the gig 
                    tx.executeSql('SELECT * FROM Gig_Transaction WHERE Gig_id = ?',
                    [gig_id],(tx,Result_transactions) => {
                        console.log('Gigs transactions done')
                        gig['Gig_transactions'] = []
                        if (Result_transactions.rows.length > 0){
                            for(let a = 0; a < Result_transactions.rows.length; a++){
                                gig['Gig_projects'].push({...Result_transactions.rows.item(a)})
                            }
                        } 

                    },(error) => {console.log(error)})
                    //Fetching the additional info associated with gig 
                    tx.executeSql('SELECT * FROM Gig_additional_info WHERE Gig_id = ?',
                    [gig_id],(tx,Result_adds) => {
                        console.log('Gigs info done')
                        gig['Gig_adds'] = []
                        if (Result_adds.rows.length > 0){
                            for(let a = 0; a < Result_adds.rows.length; a++){
                                gig['Gig_adds'].push({...Result_adds.rows.item(a)})
                            }
                        }

                    },(error) => {console.log(error)})

                    Gigs.push(gig)
                }
            },(error)=>{console.log(error)})


        },
        (error)=>{},()=>{})
        return Gigs
    }
    
}

  
export default business_database

