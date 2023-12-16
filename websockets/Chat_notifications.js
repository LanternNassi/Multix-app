
import Reconnectingwebsocket from 'react-native-reconnecting-websocket'

export class Chat{
    static init(id,Debug){
        if (Debug) {
            this.chat_ws = new Reconnectingwebsocket('ws://192.168.43.232:8040/ws/chat/' + id + '/' )
        } else {
            this.chat_ws = new Reconnectingwebsocket('wss://multix-fun.herokuapp.com/ws/chat/' + id +'/')
        }
    }
    static onMessage(handler){
        this.chat_ws.addEventListener('message' , handler)
    }
    static onClose(handler){
        this.chat_ws.addEventListener('close',handler)
    }
    static onOpen(handler){
        this.chat_ws.addEventListener('open',handler)
    }
    static onError(handler){
        this.chat_ws.addEventListener('error',handler)
    }
    static async sendMessage(message){
        this.chat_ws.send(JSON.stringify(message))
    }
}

export default Chat