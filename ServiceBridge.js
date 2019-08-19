import { NativeModules, NativeEventEmitter } from 'react-native'

module.exports = NativeModules.ServiceBridge;
// const { ServiceBridge } = NativeModules

// const NativeEvents = new NativeEventEmitter(NativeModules.ServiceBridge)

// export default {
//     /**
//      * Connect to a Redis server.
//      * @param redisURI the Redis connection URI
//      */
//     connectPubSub(redisURI) {
//         return ServiceBridge.connectPubSub(redisURI)
//     },
//     /**
//      * Subscribe to a PubSub channel
//      * @param channel the Redis channel name
//      * @param callback the callback function to handle received messages
//      */
//     subscribePubSubCallback(channel, callback) {
//         NativeEvents.addListener('handleMessage', this.msgcb)
//         return ServiceBridge.subscribePubSub(channel)
//     },
//     /**
//      * Publish message on a PubSub channel
//      * @param channel the Redis channel name
//      * @param message the message to publish
//      */
//     publishMessage(channel, message) {
//         return ServiceBridge.publishMessage(channel, message)
//     },

//     msgcb(data) {
//         console.log(data);
//     }
// }