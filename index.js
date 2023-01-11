import { registerRootComponent } from 'expo';

import main from './main';
// import TrackPlayer from 'react-native-track-player';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(main);
// TrackPlayer.registerPlaybackService(() => require('./track_player_service'));