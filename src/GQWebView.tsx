import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';

import RazorpayCheckout from 'react-native-razorpay';

import {
  CFDropCheckoutPayment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';

import {
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';
import { Environment } from './Environment';

interface GQWebViewProps{
    url: string;
    sdkSuccess: (data: any) => void;  
    sdkCancel: (data: any) => void;
    sdkError: (data: any) => void;
}

const GQWebView: React.FC<GQWebViewProps> = ({ url, sdkSuccess, sdkCancel, sdkError }) => {
    const webViewRef = useRef<WebView>(null); // Reference to the WebView
    console.log("Webview LoadURl: "+url);

    let name;

    useEffect(() => {
  
      const onVerify = (orderID: string) => {
        const paymentVerify = {
          'status': 'SUCCESS',
          'order_code': orderID
        }
        console.log('orderId is :' + orderID);
        webViewRef.current?.injectJavaScript(`sendPGPaymentResponse(${JSON.stringify(paymentVerify)});`);
      };
  
      const onError = (error: CFErrorResponse, orderID: string) => {
        console.log(
          'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderID,
        );
        console.log(`CashFailure-OrderCode: ${orderID}`)
        console.log(`CashFailure-Status: ${error.getStatus()}`)
        console.log(`CashFailure-Message: ${error.getMessage()}`)
        console.log(`CashFailure-Code: ${error.getCode()}`)
        console.log(`CashFailure-type: ${error.getType()}`)
        const paymentVerify = {
          'order_code': orderID,
          'status': error.getStatus(),
          'message': error.getMessage(),
          'code': error.getCode(),
          'type': error.getType()
        }
        webViewRef.current?.injectJavaScript(`sendPGPaymentResponse(${JSON.stringify(paymentVerify)})`);
      };
      
      // CFPaymentGatewayService.setEventSubscriber({onReceivedEvent});
      CFPaymentGatewayService.setCallback({onVerify, onError});
      return () => {
        console.log('UNMOUNTED');
        CFPaymentGatewayService.removeCallback();
        CFPaymentGatewayService.removeEventSubscriber();
      };
    }, []);

    const _startCheckout = async (orderid: string, sessionid: string ) => {
      try {
        const session = getSession(orderid, sessionid);
        const paymentModes = new CFPaymentComponentBuilder()
          .add(CFPaymentModes.CARD)
          .add(CFPaymentModes.UPI)
          .add(CFPaymentModes.NB)
          .add(CFPaymentModes.WALLET)
          .build();
        const theme = new CFThemeBuilder()
          .setNavigationBarBackgroundColor('#4563cb')
          .setNavigationBarTextColor('#FFFFFF')
          .setButtonBackgroundColor('#4563cb')
          .setButtonTextColor('#FFFFFF')
          .setPrimaryTextColor('#000000')
          .setSecondaryTextColor('#000000')
          .build();
        const dropPayment = new CFDropCheckoutPayment(
          session,
          paymentModes,
          theme,
        );
        console.log(JSON.stringify(dropPayment));
        CFPaymentGatewayService.doPayment(dropPayment);
      } catch (e) {
        console.log(e);
      }
    };
  
    // Implement other methods similarly
    const getSession = (order_id: string, session_id: string) => {
      return new CFSession(
        session_id, // sessionId
        order_id, // orderId
        // CFEnvironment.SANDBOX,
        Environment.getCashfreeEnv(),
      );
    };

    // Function to handle messages received from the WebView
  const onMessage = (event: WebViewMessageEvent) => {
    try {
        // console.log("Message from web "+event.nativeEvent.data);
      const messageData = JSON.parse(event.nativeEvent.data);
      console.log('Received from Web:', messageData);

      const eventType = messageData.eventType
      console.log( `EventType: ${eventType}`)

      if(eventType!=null && eventType=='sendPGOptions'){
        name = messageData.name
        console.log( `name : ${name}`)
        const pgOptions = messageData.pgOptions
        console.log(`pgOptions: ${JSON.stringify(pgOptions)}`)
        if(name=='UNIPG'){
          handleUNIPG(pgOptions);
        }else if(name=='CASHFREE'){
          handleCashFree(pgOptions)
        }
      }else if(eventType!=null && eventType=='sendADOptions'){
        console.log( `Ad Option Details: ${JSON.stringify(messageData)}` )
        handleAD(messageData)
      }else if(eventType!=null && eventType=='sdkSuccess'){
        delete messageData['eventType']
        console.log(`sdkSuccess details from web: ${JSON.stringify(messageData)}`)
        sdkSuccess(JSON.stringify(messageData));
      } else if(eventType!=null && eventType=='sdkCancel'){
        delete messageData['eventType']
        console.log(`sdkCancel details from web: ${JSON.stringify(messageData)}`)
        sdkCancel(JSON.stringify(messageData))
      }else if(eventType!=null && eventType=='sdkError'){
        delete messageData['eventType']
        console.log(`sdkError details from web ${messageData}`)
        sdkError(JSON.stringify(messageData));
      }

      // Here you can handle the data received from the web page
      if (messageData.action === 'exampleAction') {
        Alert.alert('WebView Message', `Received action: ${messageData.action}`);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView:', error);
    }
  };

  const handleCashFree = (object: any) => {
    const order_code = object.order_code;
    console.log(`CashOrderCode: ${order_code}`)
    const payment_session_id = object.payment_session_id
    console.log( `CashPaymentSessionId: ${payment_session_id}` );
    _startCheckout(order_code, payment_session_id);
  }

  const handleUNIPG = (details: any) => {

    console.log(`KEY: ${details.key}`)
    const prefill = details.prefill;
    console.log(`Prefill: ${JSON.stringify(prefill)}`)
    console.log(`prefill_contact: ${prefill.contact}`)

    var options = {
      description: '',
      image: '',
      currency: 'INR',
      name: '',
      amount: 0,
      key: details.key,
      order_id: details.order_id,
      notes: details.notes,
      redirect: details.redirect,
      prefill: {
        email: prefill.email,
        contact: prefill.contact,
        name: prefill.name
      }
    }
    
    RazorpayCheckout.open(options).then((data) => {
      console.log(`PaymentSuccess: ${data}`)
      console.log(`PaymentSuccess: ${JSON.stringify(data)}`)
      webViewRef.current?.injectJavaScript(`sendPGPaymentResponse(${JSON.stringify(data)})`);
    }).catch((error) => {
      console.log(`PaymentFail: ${JSON.stringify(error)}`)
      webViewRef.current?.injectJavaScript(`sendPGPaymentResponse(${JSON.stringify(error)})`);
    });
  }

  const handleAD = (details: any) => {

    console.log(`KEY: ${details.key}`)
    const callback_url = details.callback_url
    console.log(`CallBackURl: ${callback_url}`)
    let recurring = false;
    if(details.recurring=="1"){
      recurring = true;
    }else{
      recurring = false;
    }

    var options = {
      description: '',
      image: '',
      currency: 'INR',
      name: '',
      amount: 0,
      key: details.key,
      order_id: details.order_id,
      customer_id: details.customer_id,
      notes: details.notes,
      redirect: details.redirect,
      recurring: recurring
    }
    
    RazorpayCheckout.open(options).then((data) => {
      console.log(`ADSuccess: ${data}`)
      console.log(`ADSuccess: ${JSON.stringify(data)}`)
      webViewRef.current?.injectJavaScript(`sendADPaymentResponse(${callback_url}, ${JSON.stringify(data)})`);
    }).catch((error) => {
      const jsonObject = error
      jsonObject.callback_url = callback_url
      console.log(`AdPaymentError: ${JSON.stringify(jsonObject)}`)
      webViewRef.current?.injectJavaScript(`sendADPaymentResponse(${JSON.stringify(jsonObject)})`);
    });
  }

  console.log('Webview Loaded from GQWebView');
    return(
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={{ flex: 1 }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                    Alert.alert('Error', `WebView failed to load: ${nativeEvent.description}`);
                  }}
                  onLoadStart={() => console.log('WebView started loading')}
                  onLoadEnd={() => console.log('WebView finished loading')}
                  onMessage={onMessage} // Handle messages from the web page
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default GQWebView;