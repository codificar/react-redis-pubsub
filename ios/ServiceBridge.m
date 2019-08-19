//
//  ServiceBridge.m
//  ReactRedisPubSub
//
//  Created by Codificar Sistemas on 09/08/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ServiceBridge, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  connectPubSub : (NSString *)redisURI
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  subscribePubSub : (NSString *)channel
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  unsubscribePubSub : (NSString *)channel
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  publishMessage : (NSString *)channel
                  message:(NSString *)message
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

@end
