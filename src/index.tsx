import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Text } from 'react-native';
import { Environment } from './Environment';
import { Common } from './Common';
import GQWebView from './GQWebView';

interface ClientObject {
  auth: {
    client_id: string,
    client_secret_key: string,
    gq_api_key: string
  },
  student_id: string,
  env: string,
  customer_number: string,
  pp_config: {
    slug: string
  },
  fee_headers: object,
  customization: {
    theme_color: string
  }
}

interface PrefillObject {

}

interface Props {
  clientObject?: ClientObject | null;
  prefillObject?: PrefillObject | null;
  onSuccess?: (data: object) => void;
  onFailed?: (error: object) => void;
  onCancel?: (data: object) => void;
}

const GQPaymentSDK: React.FC<Props> = ({ clientObject, prefillObject, onSuccess, onFailed, onCancel }) => {
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
    console.log('Global Environment '+Environment.getEnvironment())
    // createCustomerApiCall();
    if(webviewVisible){
      // setLoading(false);
      setWebviewVisible(false)
    }else{
      setLoading(false); 
      setWebviewVisible(true)
    }
  };

  const createCustomerApiCall = async () => {
    try{
      let user;

      const apiresponse = await Common.makeApiCall(clientObject!.customer_number, clientObject?.auth.client_id, clientObject?.auth.client_secret_key, clientObject?.auth.gq_api_key);
      console.log('API Response:', apiresponse);
      if(apiresponse.status_code == 200 || apiresponse.status_code==201){

        if(apiresponse.status_code == 201 ){
          user = "new"
        }else{
          user =  "existing"
        }

        const base64 = `${clientObject?.auth.client_id}:${clientObject?.auth.client_secret_key}`

        loadURL = `${Environment.gteWebBaseURL()}instant-eligibility?gapik=${clientObject?.auth.gq_api_key}
        &abase=${Common.encodeBase64(base64)}&sid=${clientObject?.student_id}&pc=${clientObject?.customization.theme_color}
        &m=${clientObject?.customer_number}&cid=${apiresponse.data.customer_id}&ccode=${apiresponse.data.customer_code}
        &env=${Environment.getEnvironment()}&s=rnsdk&user=${user}`;

        if(clientObject?.pp_config!=null && clientObject.pp_config.slug.length>0){
          loadURL += `&_pp_config=${JSON.stringify(clientObject.pp_config)}`
        }

        if(clientObject?.fee_headers!=null){
          loadURL += `&_fee_headers=${JSON.stringify(clientObject.fee_headers)}`
        }

        if(prefillObject!=null && Common.isValidJson(JSON.stringify(prefillObject))){
          loadURL += `&optional=${JSON.stringify(prefillObject)}`
        }

        loadURL += `&_v=${Environment.VERSION}`

        console.log("loadUrl: "+loadURL);

        // setLoadUrl("https://erp-sdk-stage.graydev.tech/instant-eligibility?gapik=874828ce-32bf-40ce-b2b8-8f44990399fb&abase=R1EtYWNlYzFlMzEtMjcyOS00YzdhLWJmNTktNmNlYWU5ZGNjNjI5OjRiMDY4YmFlLWQ5NDUtNDJmMC05YzI4LTJlNjk0YzE5NTI2ZA==&sid=std_123420&m=8425980920&cid=39819&ccode=83e65cc3-e4ab-4278-8806-40c0e21a0b1c&env=stage&s=asdk&_v=\"1.1\"");
        setLoadUrl(loadURL);

        handleOpenGQWebView();
      }else{
        handleFailed(apiresponse);
      }
    }catch(error){
      console.error('API call failed:', error);
    }
  }

  useEffect(() => {

    if(Common.isValidJson(JSON.stringify(clientObject))){
      console.log('isValidConfigObject: '+JSON.stringify(clientObject));
  
      if('auth' in clientObject! && Common.isValidJson(JSON.stringify(clientObject.auth))){
  
        const auths = Common.isValidAuth(JSON.stringify(clientObject.auth))
        auths.isValid? isValid= true : errorMessage += `${auths.message}`
  
      }else{
        isValid = false;
        errorMessage += `Invalid Auth Object`
      }
  
      if('env' in clientObject! && Common.isValidEnv(clientObject.env)){
        isValid = true;
        Environment.setEnvironment(clientObject.env)
        console.log("Environment: "+Environment.getEnvironment())
      }else{
        isValid = false;
        errorMessage += `Invalid Environment, `
      }
  
      if('student_id' in clientObject! && Common.isValidString(clientObject.student_id)){
        isValid = true;
      }else{
        isValid = false;
        errorMessage += `Invalid Student Id, `
      }
  
      if('customization' in clientObject!){
        if(Common.isValidJson(JSON.stringify(clientObject.customization))){
          const customization = Common.isValidCustomization(JSON.stringify(clientObject.customization))
          customization.isValid? isValid= true : errorMessage += `${customization.message}`
        }else{
          isValid = false;
          errorMessage += `Invalid Customization, `
        }
      }
  
      if('pp_config' in clientObject!){
        if(Common.isValidJson(JSON.stringify(clientObject.pp_config))){
          const ppConfig = Common.isValidPPConfig(JSON.stringify(clientObject.pp_config))
          ppConfig.isValid? isValid= true : errorMessage += `${ppConfig.message}`
        }else{
          isValid = false;
          errorMessage += `Invalid PP Config, `
        }
      }
  
    }else {
      isValid = false;
      errorMessage +=  `Invalid Client Object`
    }
  
    console.log("Error Message: "+errorMessage);
    console.log("isVAlid: "+isValid);
  
    if(isValid){
      if('customer_number' in clientObject! && Common.isValidMobileNumber(clientObject.customer_number)){
        console.log("hasCustomerNumber")
          createCustomerApiCall();
        
      }else{

        const base64 = `${clientObject?.auth.client_id}:${clientObject?.auth.client_secret_key}`
  
        loadURL = `${Environment.gteWebBaseURL()}instant-eligibility?gapik=${clientObject?.auth.gq_api_key}
        &abase=${Common.encodeBase64(base64)}&pc=${clientObject?.customization.theme_color}
        &sid=${clientObject?.student_id}&env=${Environment.getEnvironment()}&s=rnsdk&user=new`
  
        if(clientObject?.pp_config!=null && clientObject.pp_config.slug.length>0){
          loadURL += `&_pp_config=${JSON.stringify(clientObject.pp_config)}`
        }
  
        if(clientObject?.fee_headers!=null){
          loadURL += `&_fee_headers=${JSON.stringify(clientObject.fee_headers)}`
        }

        if(prefillObject!=null && Common.isValidJson(JSON.stringify(prefillObject))){
          loadURL += `&optional=${JSON.stringify(prefillObject)}`
        }
  
        loadURL += `&_v=${Environment.VERSION}`
        console.log("loadUrl: "+loadURL);
        
        setLoadUrl(loadURL);

        handleOpenGQWebView();
      }
    }else{
      handleFailed({'error':errorMessage})
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
        onRequestClose={() => handleFailed({"error": "Failed"})}
      >
        <View style={styles.webviewContainer}>
          <GQWebView url= {completeURL} 
            sdkSuccess = {handleSuccess}
            sdkError= {handleFailed}
            sdkCancel= {handleCancel}
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

export default GQPaymentSDK;