import React, { useRef } from 'react';
import { View, StyleSheet, Linking, Platform, StatusBar, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Environment } from './Environment';

interface GQSecWebViewProps{
    url: string;
    onClose: () => void;
}

const GQSecWebView: React.FC<GQSecWebViewProps> = ({ url, onClose }) => {
    const webViewRef = useRef<WebView>(null);
    // console.log("Sec Webview LoadURl: "+url);

  const onNavigationStateChange = (event: any) => {
    // Detect URL changes
    console.log('Current URL:', event.url);
    const updateURL = event.url;
    if(updateURL.includes(Environment.getRedirectionURL())){
        onClose()
        return false; 
    }else if (updateURL.startsWith("upi://") || updateURL.startsWith("intent://") || 
    updateURL.startsWith("tez://") || updateURL.startsWith("phonepe://") || updateURL.startsWith("paytmmp://")) {
      console.log("tex")
      openGPay(updateURL)
      // Linking.openURL(url)
      //   .catch((err) => {
      //     console.error("Failed to open UPI intent:", err);
      //     // Alert.alert("Error", "No UPI app found on your device.");
      //   });
      return false; // Prevent WebView from loading the UPI URL
    }else{
      console.log("elseeeeeee")
      return true
    }
  };

  const openGPay = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      console.error("Google Pay Not Installed");
    }
  };

  const injectedJS = `
    (function() {
      // Override window.open to open inside the WebView
      window.open = function(url) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ newUrl: url }));
      };

      // Close automatically opened empty tabs (like about:blank)
      setInterval(() => {
        if (window.location.href === "about:srcdoc" || window.location.href === "about:blank") {
          window.close();
        }
      }, 500);
    })();
  `;

  // console.log('SecWebview Loaded from GQWebView');
    return(
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <WebView
            ref={webViewRef}
            source={{ uri: url }}
            javaScriptEnabled={true}
            setSupportMultipleWindows={true}
            javaScriptCanOpenWindowsAutomatically={true}
            originWhitelist={['*']}
            injectedJavaScriptBeforeContentLoaded={injectedJS}
            
            onShouldStartLoadWithRequest={(request) => {
                const { url } = request;

                // console.log("secURL: "+url);
      
                // ❌ Block about:srcdoc, about:blank, and other invalid URLs
                if (url.startsWith("about:blank")) {
                  return false;
                }

                if(url.includes(Environment.getRedirectionURL())){
                  onClose()
                  return false; 
              }
               if (url.startsWith("upi://") || url.startsWith("intent://") || 
               url.startsWith("tez://") || url.startsWith("phonepe://") || url.startsWith("paytmmp://") || 
              url.startsWith("credpay://") || url.startsWith("bhim://") || url.startsWith("amazonpay://")) {
                console.log("tex")
                // openGPay(url)
                Linking.openURL(url)
                  .catch((err) => {
                    console.error("Failed to open UPI intent:", err);
                    // Alert.alert("Error", "No UPI app found on your device.");
                  });
                return false; // Prevent WebView from loading the UPI URL
              }
      
                // ✅ Allow normal URLs
                return true;
              }}
            onNavigationStateChange={onNavigationStateChange}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              // Alert.alert('Error', `WebView failed to load: ${nativeEvent.description}`);
            }}
            />

        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    webviewContainer: {
        flex: 1,
      },
});

export default GQSecWebView;