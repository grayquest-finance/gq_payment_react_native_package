import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Text } from 'react-native';
import { Environment } from './Environment';
import { Common } from './Common';
import GQWebView from './GQWebView';


interface Props {
  token?: string | null;
  environment?: string | null;
  onSuccess?: (data: object) => void;
  onFailed?: (error: object) => void;
  onCancel?: (data: object) => void;
}

const GQTokenCheckout: React.FC<Props> = ({ token, environment, onSuccess, onFailed, onCancel }) => {
  const [webviewVisible, setWebviewVisible] = useState(false);
  const [completeURL, setLoadUrl] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  let loadURL;
  let errorMessage: string;
  let isValid;

  // Function to handle success
  const handleSuccess = (data: object) => {
    setLoading(false);
    if (onSuccess) {
      onSuccess(data); // Pass data to the client's onSuccess function
    }
  };

  // Function to handle failure
  const handleFailed = (error: object) => {
    if (onFailed) {
      setLoading(false);
      onFailed(error); // Pass error object to the client's onFailed function
    }
  };

  const handleCancel = (data: object) => {
    if (onCancel) {
      onCancel(data); // Pass error object to the client's onFailed function
    }
  };


  const handleOpenGQWebView = () => {
    // console.log('Global Environment '+Environment.getEnvironment())
    // createCustomerApiCall();
    if (webviewVisible) {
      // setLoading(false);
      setWebviewVisible(false)
    } else {
      setLoading(false);
      setWebviewVisible(true)
    }
  };

  const sessionCode = async () => {
    try {

      const apiresponse = await Common.sessionCodemakeApiCall(token);

      console.log("API Response: " + JSON.stringify(apiresponse));

      if (apiresponse.status_code == 200 || apiresponse.status_code == 201) {
        loadURL = `${Environment.gteWebBaseURL()}instant-eligibility?_code=${apiresponse.data.session_code}&s=rnsdk&_v=${Environment.VERSION}`
        console.log("loadUrl: " + loadURL);

        setLoadUrl(loadURL);

        handleOpenGQWebView();
      } else {
        handleFailed(apiresponse);
      }

    } catch (error) {
      console.error('API call failed:', error);
    }
  }

  useEffect(() => {

    errorMessage = "";

    if (Common.isValidEnv(environment)) {
      isValid = true;
      Environment.setEnvironment(environment)
      console.log("Environment: " + Environment.getEnvironment())
    } else {
      isValid = false;
      errorMessage += `Invalid Environment, `
    }

    if (Common.isValidString(token)) {
      isValid = true;
    } else {
      isValid = false;
      errorMessage += `Invalid Token, `
    }

    if (isValid) {

      sessionCode();
    } else {
      handleFailed({ 'error': errorMessage })
    }
  }, []);

  return (
    <View style={styles.container}>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Please wait...</Text>
        </View>
      )}

      {/* Modal for WebView */}
      <Modal
        visible={webviewVisible}
        animationType="slide"
        onRequestClose={() => handleFailed({ "error": "Failed" })}
      >
        <View style={styles.webviewContainer}>
          <GQWebView url={completeURL}
            sdkSuccess={handleSuccess}
            sdkError={handleFailed}
            sdkCancel={handleCancel}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    flex: 1,
  },

});

export default GQTokenCheckout;