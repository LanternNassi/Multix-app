import Reconnectingwebsocket  from 'react-native-reconnecting-websocket'

export default class Gig_notifications {
    constructor(name,Debug){
        this.ws = new Reconnectingwebsocket(Debug ? ('wss://192.168.43.232:8000/ws/gig_notifications/'+ name + '/') :('wss://multix-business.herokuapp.com/ws/gig_notifications/'+ name + '/'))
    }
    onMessage = (handler) =>{
        this.ws.addEventListener('message',handler)
    }
    sendMessage(message){
        this.ws.send(JSON.stringify(message))
    }
    onOpen = (handler) => {
        this.ws.addEventListener('open',handler)
    }
    onError = (handler) => {
        this.ws.addEventListener('error',handler)
    }
    onClose = (handler) => {
        this.ws.addEventListener('close',handler)
    }

}