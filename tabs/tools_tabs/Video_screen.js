import React, { Component } from 'react'
import {View, Text,StyleSheet} from 'react-native'
import { Video } from 'expo-av';
import {Avatar} from 'react-native-elements'
import { connect } from 'react-redux'

export class Video_screen extends Component {
    state = {
        //video_ref : null,
        song_index : this.props.route.params.index,
        song_asset : this.props.route.params.asset,
        isMuted : false,
        isLooping : false,
        resizeCover_uri : '',
    }
    video_ref = null;
    async play_song(){
        await this.video_ref.unloadAsync()
        await this.video_ref.loadAsync(this.state.song_index)
        await this.video_ref.playAsync()
        this.video_ref.presentFullscreenPlayer()
    }
    
    componentDidMount = async ()=>{
        this.video_ref.presentFullscreenPlayer()
        //await this.play_song()
    }
    render() {
        return (
            <View style = {{ flex : 1 }}>
                <Video
                    source = {{uri : this.state.song_asset.uri}}
                    ref = {(ref)=>this.video_ref = ref}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={{ flex : 1 }}
                    />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {state}
    
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Video_screen)

const styles = StyleSheet.create({

})
