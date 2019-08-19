//
//  ServiceBridge.swift
//  ReactRedisPubSub
//
//  Created by Codificar Sistemas on 09/08/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(ServiceBridge)
class ServiceBridge: RCTEventEmitter {
  
  private static var redisURI: String?
  
  // Array of event names that we can listen to
  override func supportedEvents() -> [String]! {
    return ["handleMessage"]
  }
  
  // true if the class must be initialized on the main thread
  // false if the class can be initialized on a background thread
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  /**
   * Connect to a Redis server.
   * Create a unique RedisHandler instance with Subscribe and Publish Redis connections.
   * @param redisURI the Redis connection URI
   */
  @objc
  func connectPubSub(_ redisURI: String,
                      resolver resolve: RCTPromiseResolveBlock,
                      rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
    do {
      ServiceBridge.redisURI = redisURI
      _ = try RedisHandler.getInstance(redisURI: ServiceBridge.redisURI!, module: self)
      resolve("Successfully connected to Redis server")
    } catch {
      reject("ER_CON", "Failed to connect to Redis server", error)
    }
  }
  
  /**
   * Subscribe to a PubSub channel
   * @param channel the Redis channel name
   */
  @objc
  func subscribePubSub(_ channel: String,
                     resolver resolve: RCTPromiseResolveBlock,
                     rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
    do {
      try RedisHandler.getInstance(redisURI: ServiceBridge.redisURI!, module: self).subscribePubSub(channel: channel)
      resolve("Successfully subscribed to channel \(channel)")
    } catch {
      reject("ER_SUB", "Failed to subscribe to channel \(channel)", error)
    }
  }
  
  /**
   * Unsubscribe a subscribed PubSub channel
   * @param channel the Redis channel name
   */
  @objc
  func unsubscribePubSub(_ channel: String,
                       resolver resolve: RCTPromiseResolveBlock,
                       rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
    do {
      try RedisHandler.getInstance(redisURI: ServiceBridge.redisURI!, module: self).unsubscribePubSub(channel: channel)
      resolve("Successfully unsubscribed from channel \(channel)")
    } catch {
      reject("ER_UNS", "Failed to unsubscribe from channel \(channel)", error)
    }
  }
  
  /**
   * Handle the message received via subscribed channel
   * @param channel the redis channel subscribed
   * @param message the message received
   */
  func handleMessage(channel: String, message: String) {
    sendEvent(withName: "handleMessage", body: ["channel": channel, "message": message])
  }
  
  /**
   * Publish message on a PubSub channel
   *
   * @param channel the Redis channel name
   * @param message the message to publish
   */
  @objc
  func publishMessage(_ channel: String, message: String,
                      resolver resolve: RCTPromiseResolveBlock,
                      rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
    do {
      try RedisHandler.getInstance(redisURI: ServiceBridge.redisURI!, module: self).publishPubSub(channel, message: message)
      resolve("Message successfully published on channel \(channel)")
    } catch {
      reject("ER_PUB", "Failed to publish message on channel \(channel)", error)
    }
  }
}
