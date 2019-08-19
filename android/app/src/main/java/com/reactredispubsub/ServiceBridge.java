// ServiceBridge.java

package com.reactredispubsub;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;
import java.util.HashMap;

import com.reactredispubsub.RedisHandler;

public class ServiceBridge extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private static ReactApplicationContext reactContext = null;
  
    private static String redisURI;
    private static boolean hostActive;
    private static String channelData;
    private static String messageData;

    @Override
    public String getName() {
        return "ServiceBridge";
    }

    /**
    * Monitor app lifecycle. 
    * Emit stored message when host becomes active.
    */
    @Override
    public void onHostResume() {
        // Activity `onResume`
        hostActive = true;
        // Emit pending message
        if(messageData != null) {
            this.handleMessage(channelData, messageData);
            channelData = null;
            messageData = null;
        }
    }
    /**
    * Set host as inactive (background) to store incoming messages.
     */
    @Override
    public void onHostPause() {
        // Activity `onPause`
        hostActive = false;
    }
    @Override
        public void onHostDestroy() {
    }

    public ServiceBridge(ReactApplicationContext reactContext) {
        super(reactContext);

        ServiceBridge.reactContext = reactContext;
        ServiceBridge.reactContext.addLifecycleEventListener(this);
    }

    /**
    * Connect to a Redis server.
    * Create a unique RedisHandler instance with Subscribe and Publish Redis connections.
    * @param redisURI the Redis connection URI
    */
    @ReactMethod
    public void connectPubSub(String redisURI, Promise promise) {
        ServiceBridge.redisURI = redisURI;
        try {
            RedisHandler.getInstance(redisURI, this);
            promise.resolve("Successfully connected to Redis server");
        } catch(Exception e) {
            promise.reject("ER_CON", "Failed to connect to Redis server", e);
        }
    }

    /**
    * Subscribe to a PubSub channel
    * @param channel the Redis channel name
    */
    @ReactMethod
    public void subscribePubSub(String channel, Promise promise) {
        try {
            RedisHandler.getInstance(ServiceBridge.redisURI, this).subscribePubSub(channel);
            promise.resolve("Successfully subscribed to channel "+channel);
        } catch(Exception e) {
            promise.reject("ER_SUB", "Failed to subscribe to channel "+channel, e);
        }
    }

    /**
    * Unsubscribe a subscribed PubSub channel
    * @param channel the Redis channel name
    */
    @ReactMethod
    public void unsubscribePubSub(String channel, Promise promise) {
        try {
            RedisHandler.getInstance(ServiceBridge.redisURI, this).unsubscribePubSub(channel);
            promise.resolve("Successfully unsubscribed from channel "+channel);
        } catch(Exception e) {
            promise.reject("ER_UNS", "Failed to unsubscribe from channel "+channel, e);
        }
    }

    /**
    * Handle the message received via subscribed channel
    * @param channel the redis channel subscribed
    * @param message the message received
    */
    public void handleMessage(String channel, String message) {
        if(hostActive) {
            WritableMap map = Arguments.createMap();
            map.putString("channel", channel);
            map.putString("message", message);

            ServiceBridge.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("handleMessage", map);
        }
        else {
            channelData = channel;
            messageData = message;
        }
    }

    /**
    * Publish message on a PubSub channel
    *
    * @param channel the Redis channel name
    * @param message the message to publish
    */
    @ReactMethod
    public void publishMessage(String channel, String message, Promise promise) {
        try {
            RedisHandler.getInstance(ServiceBridge.redisURI, this).publishPubSub(channel, message);
            promise.resolve("Message successfully published on channel "+channel);
        } catch(Exception e) {
            promise.reject("ER_PUB", "Failed to publish message on channel "+channel, e);
        }
    }
}