import {Client} from "@stomp/stompjs";
import {WS_BASE_URL} from "../config";

let client=null;

const getWebSocketUrl=()=>{
    if(WS_BASE_URL){
        return `${WS_BASE_URL.replace(/^http/,"ws")}/ws`;
    }

    const protocol=
        window.location.protocol==="https:"
            ?"wss:"
            :"ws:";

    return `${protocol}//${window.location.host}/ws`;
};

export const connectToLogs=(
    onLogReceived,
    onConnected,
    onDisconnected
)=>{
    client=new Client({
        brokerURL:getWebSocketUrl(),
        reconnectDelay:5000,
        heartbeatIncoming:4000,
        heartbeatOutgoing:4000
    });

    client.onConnect=()=>{
        console.log(
            "Connected to LogPulse WebSocket"
        );

        if(onConnected){
            onConnected();
        }

        client.subscribe(
            "/topic/logs",
            (message)=>{
                const log=JSON.parse(
                    message.body
                );

                onLogReceived(log);
            }
        );
    };

    client.onWebSocketClose=()=>{
        console.log(
            "LogPulse WebSocket disconnected"
        );

        if(onDisconnected){
            onDisconnected();
        }
    };

    client.onStompError=(frame)=>{
        console.error(
            "STOMP error:",
            frame.headers["message"]
        );
    };

    client.activate();

    return client;
};

export const disconnectFromLogs=()=>{
    if(client){
        client.deactivate();
        client=null;
    }
};