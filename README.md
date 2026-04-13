# GrayQuest React Native Payment SDK 
The SDK is an integrated flow in ERP that will enable users to avail multiple payment options in a seamless manner, with faster integration and deployment times.

GQ offers three payment modes:
- Monthly EMI
- Auto-Debit
- Payment Gateway


# Get the SDK
The React Native SDK is hosted on npm.org.

# Requirements
Our React Native SDK supports Android SDK version 19 and above and iOS minimum deployment target of 10.3 and above

# Installation
Navigate to your project and run the following command.

```
npm install gq_payment_react_native_package
```

Run the following command to get support of Payment Gateway.

```
npm install react-native-webview
npm install react-native-razorpay
npm install react-native-cashfree-pg-sdk
npm install react-native-base64
```

# Package Whitelisting
The newest versions of our React Native SDK(2.0.0 and newer) will require your app package/bundle to be whitelisted in system to use the SDK Checkout. Whitelisting request can be made from GrayQuest Team

# Initiating the payment
To initiate the checkout payment in the SDK, follow these steps
1. Create a Config object.
2. Set payment callback.
3. Initiate the payment using the Config object created from [step 1].

# Create a Client Object
The client_id, client_secret_key, and gq_api_key is used to get the access to the payment, this will be shared from the GrayQuest.

GrayQuest provides two environments, one being the stage environment for developers to test the payment flow and responses and the other being live environment which gets shipped to production. This environment can be set in this client object.

The values for environment can be either test or live.
```
const clientObject = {
    auth: {
      client_id: <client_id>,// 
      client_secret_key:<client_secret_key>,
      gq_api_key: <gq_api_key>
    },
    env: <env>,
    student_id: <student_id>,
    customer_number: <customer_number>,
    pp_config: {
       slug: <slug>
     },
     customization: {
      logo_url: <logo_url>
      theme_color: <theme_color>
    }
    fee_headers: {
      "fee_type_1": <fee_type_1>,
      "fee_type_2": <fee_type_2>,
       .....
       .....
      "fee_type_n": <fee_type_n>,
    },
};
```

Add the following code to initiate Payment:

```
<GQPaymentSDK 
            clientObject={clientObject}
            prefillObject={prefillObject}
            onSuccess={handleSuccess}
            onFailed={handleFailure}
            onCancel= {handleCancel}
            />
``` 
    
# Setup Payment Callback
The SDK exposes an interface Callback to receive callbacks from the SDK once the payment flow ends.

This protocol comprises of 3 methods:

1. onSuccess (data: object)
2. onFailed (error: object)
3. onCancel (data: object)

Code snippet demonstrating it's usage:
```
  const handleSuccess = (data : object) => {
    console.log('onSuccess:',data);
  }

  const handleFailure = (error: object) => {
    console.log('onFailed:' , error);
  }

  const handleCancel = (data: object) => {
    console.log('onCancel: ', data);
  }
```
# Sample Code
```
import React, { useState } from 'react';
import GQPaymentSDK from 'gq_payment_react_native_package';


function App(): React.JSX.Element {


const configObject = () :  object => {
   const jsonObject : { [key:string]: any } = {
       auth: {
         client_id: <client_id>,
         client_secret_key: <client_secret_key>,
         gq_api_key: <gq_api_key>
       },
       env: <env>,
       student_id: <student_id>,
       customer_number: <customer_number>,
       pp_config: <pp_config>,
       fee_headers: <fee_headers>,
       customization: <customization>,
   }
   return jsonObject;
 }


const handleSuccess = (data : object) => {
   console.log('AppSuccess:',data);
   // setGQSDKInititate(false)
 }


const handleFailure = (error: object) => {
   console.log('Apperror:' , error);
   setGQSDKInititate(false)
 }


 const handleCancel = (data: object) => {
   console.log('Appcancel: ', data);
   setGQSDKInititate(false)
 }


return (
<SafeAreaView style={backgroundStyle}>
     <StatusBar
       barStyle={isDarkMode ? 'light-content' : 'dark-content'}
       backgroundColor={backgroundStyle.backgroundColor}
     />
     <ScrollView
       contentInsetAdjustmentBehavior="automatic"
       style={backgroundStyle}>
       <View
         style={{
           backgroundColor: isDarkMode ? Colors.black : Colors.white,
         }}>
           <View style = {{ marginStart: 15, marginEnd: 15 }}>
             <Button
               title="Open GQ SDK"
               onPress={storeValues} />
           </View>
           <Modal
             visible={GQSDKInititate}
             animationType="slide"
             >
               <View style={styles.container}>
               <GQPaymentSDK
                 config={configObject()}
                 prefill={optionalPrefillObject}
                 onSuccess={handleSuccess}
                 onFailed={handleFailure}
                 onCancel= {handleCancel}
                 />
               </View>
             </Modal>
         </View>
     </ScrollView>
   </SafeAreaView>
 );
}
export default App;
```