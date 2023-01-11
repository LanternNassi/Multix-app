import React , {Component, Children} from 'react'
import {SpeedDial, Avatar } from 'react-native-elements'
import {View , Text , TextInput , Image , Button , StyleSheet, TouchableOpacity , ScrollView, Animated , FlatList,ImageBackground , } from 'react-native'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable';
import * as MediaLibrary from 'expo-media-library';
import { Audio,Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Asset from 'expo-asset'
import * as Progress from 'react-native-progress'
import Slider from '@react-native-community/slider'
import * as Permissions from 'expo-permissions';
import { StatusBar } from 'expo-status-bar';
// import MusicControl from 'react-native-music-control'
// import TrackPlayer from 'react-native-track-player';

// const ScreenWidth = Dimensions.get('window').width
// const ScreenHeight = Dimensions.get('window').height 

// const ScreenWidth = 100
// const ScreenHeight = 500

console.log(ScreenWidth)
console.log(ScreenHeight)


const bottomsheet = {
    0 : {
        bottom : 0,
        height : 0,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    0.5 : {
        bottom : 0,
        height : 50,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    1 : {
        bottom : 0,
        height : 240,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    }
}

const bottomsheet_fold = {
    0 : {
        bottom : 0,
        height : 240,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    },
    0.5 : {
        bottom : 0,
        height : 50,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    1 : {
        bottom : 0,
        height : 0,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    
}

export class tools extends Component {
    state = {
        type_playing : 'audio',
        current_video_song : '',
        audio_files : '',
        audio_files_flatlist : [],
        audio_sheet : false,
        video_files : '',
        video_sheet : false, 
        unfold : bottomsheet,
        soundObject : new Audio.Sound(),
        current_time : 0,
        current_max_time : 0,
        current_audio_song : 'Multix',
        playing : 'No',
        loop_color :[ this.props.fun.Layout_Settings.Icons_surroundings , this.props.fun.Layout_Settings.Icons_Color ] , 
        looping : false ,
        current_song_id : null,
        audio_thumbnail : null,
        video_files_flatlist : [],
        video_uri : '',
        muted : false,
        videos_loaded : false
    }
    filtered_list = [];
    video_ref = null;

    search_audio = (text,type) =>{
        if (type === 'audio'){
            if (text === ''){
                this.setState({audio_files_flatlist : this.state.audio_files.assets})
            }else{
                this.filtered_list.splice(0,this.filtered_list.length)
                for(var i = 0 ; i <= (this.state.audio_files.assets).length-1; i++ ){
                    var name = this.state.audio_files.assets[i].filename
                    if(name.includes(text) ){
                        this.filtered_list.push(this.state.audio_files.assets[i])
                    }else {
                    }
                }
                this.setState({ 
                    audio_files_flatlist : this.filtered_list
                  })
            }

        }else if (type === 'video'){
            //console.log("Am there")
            if (text === ''){
                this.setState({video_files_flatlist : this.state.video_files.assets})
            }else{
                this.filtered_list.splice(0,this.filtered_list.length)
                for(var i = 0 ; i <= (this.state.video_files.assets).length-1; i++ ){
                    var name = this.state.video_files.assets[i].filename
                    if(name.includes(text) ){
                        this.filtered_list.push(this.state.video_files.assets[i])
                    }else {
                    }
                }
                this.setState({ 
                    video_files_flatlist : this.filtered_list
                  })
            }

        }
        
    }
    get_Audio_Files = async () => {
        let audio = await MediaLibrary.getAssetsAsync({mediaType : 'audio' , first : 10000});
        const {assets} = await MediaLibrary.getAssetsAsync({mediaType : 'photo' , first : 30});
        const thumb_id = Math.floor(Math.random()/1*30)
        this.setState({ audio_thumbnail : assets[thumb_id].uri  })
        this.setState({audio_files : audio , audio_files_flatlist : audio.assets})
    }
    get_Video_Files = async () => {
        try {
        let video = await MediaLibrary.getAssetsAsync({mediaType : 'video' , first : 300 });

        console.log(video)
        const {assets,totalCount} = video
        const processed_assets = []
        for(let i = 0 ; i<=assets.length-1; i++ ){
            const video_thumb = await this.generateThumbnail(assets[i].uri)
            processed_assets.push({...assets[i],video_thumbnail :  video_thumb.uri})
        }
        this.setState({video_files : {...video , assets : processed_assets} , video_files_flatlist : processed_assets , videos_loaded : true})
        } catch (error) {
            console.log(error)
        }
        
    }
    generateThumbnail = async (uri_video) => {
        try {
          const thumb = await VideoThumbnails.getThumbnailAsync(
            uri = uri_video,
            {
              time: 100,
            }
          );
        return (thumb)
         
        } catch (e) {
            //console.log(uri_video)
          //console.log(e);
          return ({uri : null})
        }
        
      };
    seconds(secs){
        var minutes = Math.floor(secs/60);
        var seconds = (((secs/60)-minutes)*60).toFixed(0)
        return (
            seconds == 60 || seconds >= 60 ? 
            (minutes+1) + ":00":
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        )
    }
    millistoMinutesAndSeconds(millis){
        var minutes = Math.floor((millis/1000)/60);
        var seconds = ((((millis/1000) / 60)-minutes)*60).toFixed(0);
        return (
            seconds == 60 || seconds >= 60 ? 
            (minutes+1) + ":00":
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        )

    }

    play_audio = async ( Asset ) => {
        if (Asset.mediaType === 'audio' && this.state.type_playing === 'audio' ){
            try {
                await this.state.soundObject.loadAsync(Asset);
               
                await this.state.soundObject.setProgressUpdateIntervalAsync(1000)
                this.state.soundObject.setOnPlaybackStatusUpdate(async (AVP_status)=>{
                    if (AVP_status.isPlaying) {
                        this.setState({ 
                            current_time : AVP_status.positionMillis
                         })
                    } else if (AVP_status.didJustFinish && !AVP_status.isLooping){
                        //console.log(AVP_status.isLooping)
                        let obj = this.state.audio_files.assets[this.state.current_song_id+1]
                        this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :this.state.current_song_id+1 , })
                        await this.state.soundObject.unloadAsync()
                        await this.state.soundObject.loadAsync(obj)
                        await this.state.soundObject.playAsync()
                    } 
                })
                await this.state.soundObject.playAsync();
                if (this.state.looping){
                    this.state.soundObject.setIsLoopingAsync(true)
                } else {
                    this.state.soundObject.setIsLoopingAsync(false)
                }
               
            } catch (error) {
                console.log(error)
            }

        } else if ( Asset.mediaType === 'video'&& this.state.type_playing === 'video' ){
            try {
                await this.video_ref.loadAsync(Asset);
                if (this.state.looping){
                    this.state.soundObject.setIsLoopingAsync(true)
                } else {
                    this.state.soundObject.setIsLoopingAsync(false)
                }
                await this.video_ref.setProgressUpdateIntervalAsync(1000)
                this.video_ref.setOnPlaybackStatusUpdate(async (AVP_status)=>{
                    if (AVP_status.isPlaying) {
                        this.setState({ 
                            current_time : AVP_status.positionMillis
                         })
                    } else if (AVP_status.didJustFinish && !AVP_status.isLooping){
                        //console.log(AVP_status.isLooping)
                        let obj = this.state.video_files.assets[this.state.current_song_id+1]
                        this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :this.state.current_song_id+1 , })
                        await this.video_ref.unloadAsync()
                        await this.video_ref.loadAsync(obj)
                        await this.video_ref.playAsync()
                       
                    } 
                })
                await this.video_ref.playAsync();
                if (this.state.looping){
                    this.video_ref.setIsLoopingAsync(true)
                } else {
                    this.video_ref.setIsLoopingAsync(false)
                }
               
            } catch (error) {
                console.log(error)
            }

        }
        
    }
    play_Random = async (number_of_songs) =>{
        if (this.state.type_playing === 'audio'){
            let number = Math.random()
            let overall_id = Math.floor( (number/1)*100)
            let obj = this.state.audio_files.assets[overall_id]
            if (obj == undefined){
                overall_id/=10
                let obj = this.state.audio_files.assets[overall_id]
            }
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :overall_id , })
            await this.play_audio(obj,overall_id)
            this.state.looping ? await this.state.soundObject.setIsLoopingAsync(true) : await this.state.soundObject.setIsLoopingAsync(false) 
            

        } else if (this.state.playing === 'video'){
            let number = Math.random()
            let overall_id = Math.floor( (number/1)*100)
            let obj = this.state.video_files.assets[overall_id]
            if (obj == undefined){
                overall_id/=10
                let obj = this.state.video_files.assets[overall_id]
            }
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :overall_id , })
            await this.play_audio(obj,overall_id)
            this.state.looping ? await this.video_ref.setIsLoopingAsync(true) : await this.video_ref.setIsLoopingAsync(false) 
            

        }
        

    }
    play_next = async (id)=>{
        if (this.state.type_playing === 'audio'){
            let obj = this.state.audio_files.assets[id+1]
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :id+1 , })
            await this.play_audio(obj)


        }else if (this.state.type_playing === 'video'){
            let obj = this.state.video_files.assets[id+1]
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :id+1 , })
            await this.play_audio(obj)
        }
        
    }
    play_previous = async (id)=>{
        if (this.state.type_playing === 'audio'){
            let obj = this.state.audio_files.assets[id-1]
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :id-1 , })
            await this.play_audio(obj)


        }else if (this.state.type_playing === 'video' ){
            let obj = this.state.video_files.assets[id-1]
            this.setState({ current_max_time : obj.duration , playing : 'playing', current_audio_song : (obj.filename).slice(0,21), current_song_id :id-1 , })
            await this.play_audio(obj)


        }
        
    }

    // update_notification_music_controls = async () =>{
    //     MusicControl.setNowPlaying({
    //         title: this.state.current_audio_song + '...',
    //         artwork: require('../assets/Notifications.png'), // URL or RN's image require()
    //         artist: 'Michael Jackson',
    //         // album: 'Thriller',
    //         // genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
    //         duration: this.state.current_max_time, // (Seconds)
    //         description: '', // Android Only
    //         color: 0xffffff, // Android Only - Notification Color
    //         colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
    //         // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
    //         rating: 84, // Android Only (Boolean or Number depending on the type)
    //         notificationIcon: 'Notifications', // Android Only (String), Android Drawable resource name for a custom notification icon
    //         isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    //     })
    // }
    async componentDidMount() {
        //await Audio.setAudioModeAsync({
            //staysActiveInBackground : true,
          //  playThroughEarpieceAndroid : true,
            //interruptionModeAndroid : 1,
        //})
        //const {status} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        //const [status, requestPermission] = MediaLibrary.usePermissions();
        const {status} = await MediaLibrary.getPermissionsAsync();
        console.log(status)
        if (status === "granted"){
            await this.get_Audio_Files();
            await this.get_Video_Files();
         } else {
            const {status} = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted"){
                await this.get_Audio_Files()
               await this.get_Video_Files();
            }
        } 
        // await TrackPlayer.setupPlayer()
        
        ////Music control commands

        // MusicControl.enableControl('closeNotification', true, { when: 'paused' })

        // MusicControl.enableBackgroundMode(true);

        // // setting controls on lock screen
        // MusicControl.enableControl('play', true)
        // MusicControl.enableControl('pause', true)
        // MusicControl.enableControl('stop', false)
        // MusicControl.enableControl('nextTrack', true)
        // MusicControl.enableControl('previousTrack', false)


        // MusicControl.handleAudioInterruptions(true);

        // MusicControl.on(Command.play, async ()=> {
        //     if (this.state.type_playing === 'audio'){
        //         this.setState({playing : 'playing'})
        //         await this.state.soundObject.playAsync()
        //     } else if (this.state.type_playing === 'video'){
        //         this.setState({playing : 'playing'})
        //         await this.video_ref.playAsync()
        //     }
            
        // })

        // MusicControl.on(Command.pause, async ()=> {
        //     if (this.state.type_playing === 'audio'){
        //         this.setState({playing : 'paused'})
        //         await this.state.soundObject.pauseAsync()
        //     } else if (this.state.type_playing === 'video'){
        //         this.setState({playing : 'paused'})
        //         await this.video_ref.pauseAsync()
        //     }
        // })

        // MusicControl.on(Command.stop, async ()=> {
        //     if (this.state.type_playing === 'audio'){
        //         this.setState({playing : 'paused'})
        //         await this.state.soundObject.pauseAsync()
        //     } else if (this.state.type_playing === 'video'){
        //         this.setState({playing : 'paused'})
        //         await this.video_ref.pauseAsync()
        //     }       
        //  })

        // MusicControl.on(Command.nextTrack, async ()=> {
        //     async ()=>{
        //         const id = this.state.current_song_id 
        //         await this.state.soundObject.unloadAsync()
        //         await this.play_next(id)
        //     }
        // })

        // MusicControl.on(Command.previousTrack, async ()=> {
        //     async ()=>{
        //         const id = this.state.current_song_id
        //         await this.state.soundObject.unloadAsync()
        //         await this.play_previous(id)
        //     }      
        // })

        // MusicControl.on(Command.closeNotification, ()=> {
        //     console.log('closed')
        // })
    
    }
    render(){
        return (
            <View style = {styles.container} >
                <StatusBar style="dark" animated = {true}/>
                <View style = {styles.header}>
                    <View style = {styles.O_V} >

                        <TouchableOpacity style = {styles.T_O}
                        onPress = {
                            ()=>{
                                if (this.state.audio_sheet){
                                    this.setState({ unfold : bottomsheet_fold});
                                    setTimeout(()=>{
                                    this.setState({audio_sheet : false , unfold : bottomsheet})
                                },1000)
                                } else if (this.state.video_sheet){
                                    this.setState({ unfold : bottomsheet_fold});
                                    setTimeout(()=>{
                                    this.setState({video_sheet : false , unfold : bottomsheet})
                                },1000)
                                    this.setState({audio_sheet:true})

                                } else {
                                    this.setState({audio_sheet : true})
                                }
                            }
                        }
                         >
                            <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings  }} 
                            icon = {{ name : 'music' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                        </TouchableOpacity>
                    </View>
                        <Text style = {styles.header_title}> Playing Now </Text>
                        <View style = {styles.O_V} >
                        <TouchableOpacity style = {styles.T_O}
                        onPress = {
                            ()=>{
                                if (this.state.audio_sheet){
                                    this.setState({ unfold : bottomsheet_fold});
                                    setTimeout(()=>{
                                    this.setState({audio_sheet : false , unfold : bottomsheet})
                                },1000)
                                    this.setState({video_sheet : true})
                                } else if (this.state.video_sheet){
                                    this.setState({ unfold : bottomsheet_fold});
                                    setTimeout(()=>{
                                    this.setState({video_sheet : false , unfold : bottomsheet})
                                },1000)

                                } else {
                                    this.setState({video_sheet : true})
                                }
                                
                            }
                        }
                         >
                            <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings  }} 
                            icon = {{ name : 'film' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{ height : 200 , width : ScreenWidth , justifyContent : 'center' , alignItems : 'center' ,  }}>
                        { this.state.type_playing === 'audio' ? (
                            <View style = {{ height : 200 , width : 200 , zIndex : 0, borderRadius : 100 , backgroundColor : 'white', elevation:20, justifyContent : 'center' , alignItems : 'center' ,   }}>
                            <Image source = {require('../assets/Notifications.png')} style = {{  height : 189 , width : 189 , borderRadius : 94.5 }} />
                            </View>
                        ) : (
                            <View style = {{marginTop : 20  }}>
                        <Video
                            //source = {{uri : this.state.video_uri}}
                            ref = {(ref)=>this.video_ref = ref}
                            rate={1.0}
                            isMuted={false}
                            resizeMode={'cover'}
                            shouldPlay
                            style={{ height : 0.378*ScreenHeight,width : 0.85*ScreenWidth , }}
                        />
                        <TouchableOpacity onPress = {
                            ()=>{
                                //console.log("am there")
                                this.video_ref.presentFullscreenPlayer()
                            }
                        }>
                        <Avatar 
                         size = {'medium'} icon = {{ name : 'expand',color : this.props.fun.Layout_Settings.Icons_surroundings , type : 'font-awesome'}} rounded containerStyle= {{
                            position : 'absolute',
                            right : 20,
                            bottom:0,
                            backgroundColor : 'transparent',
                        }} />
                        </TouchableOpacity>
                        </View>
                        ) }
                        
                </View> 
                <View style = {{ width : ScreenWidth ,  height : 0.15 * ScreenHeight  , marginTop : 20 , flexDirection : 'row', justifyContent : 'space-evenly', alignItems : 'center'  }}>
                    <TouchableOpacity style = {styles.encloser_2} onPress = {
                        async ()=>{
                            if(this.state.looping){
                                this.setState({ loop_color :[ this.props.fun.Layout_Settings.Icons_surroundings , this.props.fun.Layout_Settings.Icons_Color ] , looping : false })
                                this.state.type_playing === 'audio'?
                                await this.state.soundObject.setIsLoopingAsync(false) : await this.video_ref.setIsLoopingAsync(false)

                            } else {
                                this.setState({ loop_color :[ this.props.fun.Layout_Settings.Icons_Color , this.props.fun.Layout_Settings.Icons_surroundings ] , looping : true })
                                this.state.type_playing === 'audio'?
                                await this.state.soundObject.setIsLoopingAsync(true) : await this.video_ref.setIsLoopingAsync(true)

                            }
                            
                        }
                    }>
                    <Avatar containerStyle = {{ backgroundColor : this.state.loop_color[0], elevation : 10 }} rounded icon = {{ name : 'refresh' , type : 'font-awesome' , color : this.state.loop_color[1] }} size = {'medium'} />
                    </TouchableOpacity>
                    <View>
                        <Text style = {styles.header_title}> {this.state.current_audio_song}... </Text>
                        <Text style = {{ fontSize : 15 , fontWeight : '900' }} > Audio </Text>

                    </View>
                    <TouchableOpacity style = {styles.encloser_2} onPress = {
                        async ()=>{
                            await this.state.soundObject.unloadAsync()
                            await this.play_Random(this.state.audio_files.length-1)
                        }
                    } >
                    <Avatar containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings, elevation : 10 }} rounded icon = {{ name : 'random' , type : 'font-awesome' , color : this.props.fun.Layout_Settings.Icons_Color }} size = {'medium'} />
                    </TouchableOpacity>
                </View>
                <View style = {{ marginTop : 20 , width : 0.99 * ScreenWidth  , height : 30 , flexDirection : 'row' , justifyContent : 'space-evenly' , alignItems : 'center'}}>
                    <Text style = {{ fontSize : 15 , fontWeight : '700' }}> {this.millistoMinutesAndSeconds(this.state.current_time)} </Text>
                    <Slider maximumValue = {this.state.current_max_time*1000}
                    disabled = {false}
                    onValueChange = {(seconds)=>{
                        this.state.type_playing === 'audio'?
                        this.state.soundObject.playFromPositionAsync(seconds) : this.video_ref.playFromPositionAsync(seconds)
                    }}
                    style = {{ width : 0.8 * ScreenWidth }} 
                    minimumValue = {0}
                    value = {this.state.current_time}
                     maximumTrackTintColor = {'red'} 
                     minimumTrackTintColor = { this.props.fun.Layout_Settings.Icons_Color}  />
                     <Text style = {{ fontSize : 15 , fontWeight : '700'  }} >{this.seconds(this.state.current_max_time)} </Text>

                </View>
                <View style = {{ height : 0.2 * ScreenHeight, width : ScreenWidth , flexDirection : 'row' , justifyContent : 'space-around', alignItems : 'center'  }}>
                    <TouchableOpacity style = {styles.encloser_2} onPress = {
                        async ()=>{
                            const id = this.state.current_song_id
                            await this.state.soundObject.unloadAsync()
                            await this.play_previous(id)
                            // await this.update_notification_music_controls()
                        }
                    }>
                        <Avatar rounded  containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings , elevation : 18  }} icon = {{ name : 'fast-backward' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' ,  }} size = {'medium'}  />
                    </TouchableOpacity>

                    <TouchableOpacity style = {styles.encloser_2} onPress = {
                        async ()=>{
                            if (this.state.type_playing === 'video'){
                                await this.video_ref.presentFullscreenPlayerAsync()
                            }
                        }
                    }>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings , elevation : 18  }} icon = {{ name : 'arrows-alt' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome'  }} size = {'medium'}  />
                    </TouchableOpacity>


                    <TouchableOpacity style = {
                        styles.encloser_1
                    } onPress = {
                        async ()=> {
                            if (this.state.playing === "playing"){
                                if (this.state.type_playing === 'audio'){
                                    this.setState({playing : 'paused'})
                                    // MusicControl.updatePlayback({
                                    //     // state : MusicControl.STATE_PAUSED,
                                    // })
                                    await this.state.soundObject.pauseAsync()
                                } else if (this.state.type_playing === 'video'){
                                    this.setState({playing : 'paused'})
                                    await this.video_ref.pauseAsync()
                                }
                        
                            }else if (this.state.playing === "paused"){
                                if (this.state.type_playing === 'audio'){
                                    this.setState({playing : 'playing'})
                                    // MusicControl.updatePlayback({
                                    //     // state : MusicControl.STATE_PLAYING,
                                    // })
                                    await this.state.soundObject.playAsync()
                                } else if (this.state.type_playing === 'video'){
                                    this.setState({playing : 'playing'})
                                    await this.video_ref.playAsync()
                                }
                            }
                            
                        }
                    }>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings , elevation : 18 }} icon = {{ name : this.state.playing === 'playing' || this.state.playing === "No"? 'pause':'play' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome'  }} size = {'large'}  />
                    </TouchableOpacity>


                    <TouchableOpacity style = {
                        styles.encloser_2
                    } onPress = {
                        async ()=>{
                            if (this.state.playing === "playing" && !this.state.muted){
                                if (this.state.type_playing === 'audio'){
                                    
                                    this.setState({muted : true})
                                    await this.state.soundObject.setIsMutedAsync(true)
                                } else if (this.state.type_playing === 'video'){
                                    this.setState({muted : true})
                                    await this.video_ref.setIsMutedAsync(true)
                                }               
                        } else if (this.state.playing === 'playing' && this.state.muted){
                            if (this.state.type_playing === 'audio'){
                                this.setState({muted : false})
                                await this.state.soundObject.setIsMutedAsync(false)
                            } else if (this.state.type_playing === 'video'){
                                this.setState({muted : false})
                                await this.video_ref.setIsMutedAsync(false)
                            }    
                        }
                    }
                    }>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings , elevation : 18  }} icon = {{ name : this.state.muted ? ('microphone-slash') : ('microphone') , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome'  }} size = {'medium'}  />
                    </TouchableOpacity>


                    <TouchableOpacity style = {styles.encloser_2} onPress = {
                        async ()=>{
                            const id = this.state.current_song_id 
                            await this.state.soundObject.unloadAsync()
                            await this.play_next(id)
                            // await this.update_notification_music_controls()

                        }
                    }>
                    <Avatar rounded containerStyle = {{ backgroundColor : this.props.fun.Layout_Settings.Icons_surroundings , elevation : 18  }} icon = {{ name : 'fast-forward' , color : this.props.fun.Layout_Settings.Icons_Color , type : 'font-awesome'  }} size = {'medium'}  />
                    </TouchableOpacity>
                </View>
                
                { this.state.audio_sheet && !this.state.video_sheet ? (
                     <Animatable.View animation = {this.state.unfold} style = {{ elevation : 22, position : 'absolute' , justifyContent : 'space-between', alignItems : 'center'  }} >
                     <View style = {{ flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' }}>
                     <TextInput  placeholder = {'      Search media'} 
                     onChangeText = {
                         (text)=>{
                                this.search_audio(text,'audio')
                         }
                     }
                     placeholderTextColor = {'white'}
                     style = {{  
                         height : 40,
                         width : 300,
                         borderBottomWidth : 2,
                         color : 'white',
                         paddingBottom : 8
                         
                      }} />
                      <TouchableOpacity onPress = {
                          ()=>{
                              this.setState({ unfold : bottomsheet_fold })
                              setTimeout(()=>{
                                  this.setState({audio_sheet : false , unfold : bottomsheet,audio_files_flatlist : this.state.audio_files.assets})

                              }, 1000)
                          }
                      }>
                      <Avatar rounded icon = {{ name : 'times' , type : 'font-awesome' , color : 'white' }} size = {'medium'}  />
                      </TouchableOpacity>
                      </View>
                     <FlatList
                        indicatorStyle = {'white'}
                         horizontal = {false}
                         data = {this.state.audio_files_flatlist}
                         renderItem = {
                             (item)=> (
                                 <TouchableOpacity style = {styles.list_item} onPress = {
                                     async ()=> {
                                         await this.state.soundObject.unloadAsync();
                                         this.setState({current_max_time : item.item.duration ,type_playing : 'audio', playing : 'playing', current_audio_song : (item.item.filename).slice(0,21), current_song_id : item.index , unfold : bottomsheet_fold})
                                         //console.log(this.state.current_song_id)
                                         await this.play_audio(item.item,item.index)
                                         setTimeout(()=>{
                                         this.setState({audio_sheet : false , unfold : bottomsheet,audio_files_flatlist : this.state.audio_files.assets})
                                     }, 1000)
                                    //  await this.update_notification_music_controls()
                                     }
                                 } >
                                     <Avatar source = {{uri : this.state.audio_thumbnail}} rounded size = {'medium'} />
                                     <Text style = {{ color : 'white' }}> {(item.item.filename).slice(0,21)}... </Text>
                                     <Avatar rounded icon = {{ name : 'play-circle', type : 'font-awesome', color : 'white' }} size = {'small'} />
                                     <Text style = {{ color : 'white' }} > {this.seconds(item.item.duration)}  </Text>
                                 </TouchableOpacity>
                             )
                         }
                         
 
                     />
 
 
                 </Animatable.View>
 

                ) : ( <View/> )  }

                { this.state.video_sheet && !this.state.audio_sheet ? (
                     <Animatable.View animation = {this.state.unfold} style = {{  position : 'absolute' , elevation : 22,justifyContent : 'space-between', alignItems : 'center'  }} >
                     <View style = {{ flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' }}>
                     <TextInput  placeholder = {'      Search media'} 
                     onChangeText = {(text)=>{
                        
                            this.search_audio(text,'video')
                    
                     }}
                     placeholderTextColor = {'white'}
                     style = {{  
                         height : 40,
                         width : 300,
                         borderBottomWidth : 2,
                         color : 'white',
                         paddingBottom : 8
                         
                      }} />
                      <TouchableOpacity onPress = {
                          ()=>{
                              this.setState({ unfold : bottomsheet_fold});
                              setTimeout(()=>{
                                this.setState({video_sheet : false , unfold : bottomsheet})
                              },1000)
                          }
                      }  >
                      <Avatar rounded icon = {{ name : 'times' , type : 'font-awesome' , color : 'white' }} size = {'medium'}  />
                      </TouchableOpacity>
                      </View>
                      {
                          this.state.videos_loaded ? (
                            <FlatList
                            horizontal = {false}
                            data = {this.state.video_files_flatlist}
                            renderItem = {
                                 (item)=>(
                                    
                                    <TouchableOpacity style = {styles.list_item} onPress = {
                                           async ()=> {
                                               this.setState({current_max_time : item.item.duration , video_uri : item.item.uri, type_playing : 'video' ,  playing : 'playing', current_audio_song : (item.item.filename).slice(0,21), current_song_id : item.index , unfold : bottomsheet_fold})
                                               this.state.type_playing === 'audio' && this.state.playing === 'playing' ? 
                                                   await this.state.soundObject.unloadAsync()
                                                : 
                                                   (await this.video_ref.unloadAsync())
                                               setTimeout(async ()=>{
                                                   await this.play_audio(item.item)
                                               },1000)
                                               
                                               setTimeout(()=>{
                                               this.setState({video_sheet : false , unfold : bottomsheet,})
                                           }, 1000)
   
                                           }
                                        }
                                     >
                                        <Avatar source = {{uri : item.item.video_thumbnail }} rounded size = {'medium'} />
                                        <Text style = {{ color : 'white' }}> {(item.item.filename).slice(0,21)}... </Text>
                                        <Avatar rounded icon = {{ name : 'play-circle', type : 'font-awesome', color : 'white' }} size = {'small'} />
                                        <Text style = {{ color : 'white' }} > {this.seconds(item.item.duration)}  </Text>
                                    </TouchableOpacity>
                                )
                            }
                      
                        />
                          ) : (
                              <View style = {{ flex : 1 , alignItems : 'center' , justifyContent : 'center' }}>
                                <Progress.CircleSnail  size = { 60 } progress = {0.7} color = {'white'} style = { styles.play }/>
                                <Text style = {{ color : 'white' }}>This feature is expected to be resolved in the next release  ...</Text>
                              </View>
                          )
                      }
                   
                 </Animatable.View>
 

                ) : ( <View/> )  }
               
      </View>
        )

    }
   
}
const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}


const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(tools)

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    header : {
        marginTop : 20,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : 0.09 * ScreenHeight,
        width : ScreenWidth,
    },
    T_O : {
        height : 60 ,
         width : 60 ,
          borderRadius : 30 , 
          justifyContent :'center',
           backgroundColor : 'white',
            alignItems : 'center' , 
        elevation : 20

    },
    O_V : {
        height : 69 ,
         width : 69, 
         borderRadius : (0.5 * 69) ,
          elevation : 20 , 
          justifyContent : 'center', 
          alignItems : 'center',
          backgroundColor : 'white'

    },
    header_title : {
        fontSize : 20,
        fontWeight : '700'
    },
    list_item : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        width : ScreenWidth,
        height : 50,
        backgroundColor : 'transparent'
    },
    encloser_2 : {
        width : 0.165 * ScreenWidth,
        height : 0.165 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'white',
        borderRadius : 0.5 * (0.165 * ScreenWidth),
        elevation : 20
    },
    encloser_1 : {
        width : 0.24 * ScreenWidth,
        height : 0.24 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'white',
        borderRadius : 0.5 * (0.24 * ScreenWidth),
        elevation : 20
    }
})
