import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Text } from 'react-native';
import { Environment } from './Environment';
import { Common } from './Common';
import GQWebView from './GQWebView';

interface config {
  auth: {
    client_id: string,
    client_secret_key: string,
    gq_api_key: string
  },
  student_id: string,
  env: string,
  customer_number: string,
  reference_id: string,
  emi_plan_id: string,
  udf_details: object,
  pp_config: {
    slug: string
  },
  payment_methods: string,
  fee_headers: object,
  fee_headers_split: object,
  customization: {
    theme_color: string
  }
}

interface prefill {

}

interface Props {
  config?: config | null;
  prefill?: prefill | null;
  onSuccess?: (data: object) => void;
  onFailed?: (error: object) => void;
  onCancel?: (data: object) => void;
}

const GQPaymentSDK: React.FC<Props> = ({ config, prefill, onSuccess, onFailed, onCancel }) => {
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

      const apiresponse = await Common.makeApiCall(config!.customer_number, config?.auth.client_id, config?.auth.client_secret_key, config?.auth.gq_api_key);
      // console.log('API Response:', apiresponse);
      if(apiresponse.status_code == 200 || apiresponse.status_code==201){

        if(apiresponse.status_code == 201 ){
          user = "new"
        }else{
          user =  "existing"
        }

        const base64 = `${config?.auth.client_id}:${config?.auth.client_secret_key}`

        loadURL = `${Environment.gteWebBaseURL()}instant-eligibility?gapik=${config?.auth.gq_api_key}
        &abase=${Common.encodeBase64(base64)}&sid=${config?.student_id}
        &m=${config?.customer_number}&cid=${apiresponse.data.customer_id}&ccode=${apiresponse.data.customer_code}
        &env=${Environment.getEnvironment()}&s=rnsdk&user=${user}`;

        if('reference_id' in config! && config.reference_id.length>0){
          loadURL += `&reference_id=${config.reference_id}`
        }

        if(`emi_plan_id` in config! && config.emi_plan_id.length>0){
          loadURL += `&emi_plan_id=${config.emi_plan_id}`
        }

        if(`udf_details` in config! && config.udf_details!=null && Common.isValidJson(JSON.stringify(config.udf_details))){
          loadURL += `&udf_details=${JSON.stringify(config.udf_details)}`
        }

        if(config?.pp_config!=null && config.pp_config.slug.length>0){
          loadURL += `&_pp_config=${JSON.stringify(config.pp_config)}`
        }

        if(config?.customization!=null && config.customization.theme_color.length>0){
          loadURL +=`&pc=${config?.customization.theme_color}`
        }

        if(`payment_methods` in config! && config.payment_methods.length>0){
          loadURL +=`&payment_methods=${config.payment_methods}`
        }

        if(config?.fee_headers!=null){
          loadURL += `&_fee_headers=${JSON.stringify(config.fee_headers)}`
        }

        if(`fee_headers_split` in config! && config.fee_headers_split != null && Common.isValidJson(JSON.stringify(config.fee_headers_split))){
          loadURL += `&fee_headers_split=${JSON.stringify(config.fee_headers_split)}`
        }

        if(prefill!=null && Common.isValidJson(JSON.stringify(prefill))){
          loadURL += `&optional=${JSON.stringify(prefill)}`
        }

        loadURL += `&_v=${Environment.VERSION}`

        console.log("loadUrl: "+loadURL);

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

    errorMessage = "";

    if(Common.isValidJson(JSON.stringify(config))){
      console.log('isValidConfigObject: '+JSON.stringify(config));
  
      if('auth' in config! && Common.isValidJson(JSON.stringify(config.auth))){

        isValid = true;
  
        // const auths = Common.isValidAuth(JSON.stringify(config.auth)) 
        // auths.isValid? isValid= true : errorMessage += `${auths.message}`
  
      }else{
        isValid = false;
        errorMessage += `Invalid Auth Object`
      }
  
      if('env' in config! && Common.isValidEnv(config.env)){
        isValid = true;
        Environment.setEnvironment(config.env)
        console.log("Environment: "+Environment.getEnvironment())
      }else{
        isValid = false;
        errorMessage += `Invalid Environment, `
      }
  
      if('student_id' in config! && Common.isValidString(config.student_id)){
        isValid = true;
      }else{
        isValid = false;
        errorMessage += `Invalid Student Id, `
      }
  
      if('customization' in config!){
        if(Common.isValidJson(JSON.stringify(config.customization))){
          const customization = Common.isValidCustomization(JSON.stringify(config.customization))
          customization.isValid? isValid= true : errorMessage += `${customization.message}`
        }else{
          isValid = false;
          errorMessage += `Invalid Customization, `
        }
      }
  
      if('pp_config' in config!){
        // console.log(`ppConfig: ${JSON.stringify(config.pp_config)}`)
        if(Common.isValidJson(JSON.stringify(config.pp_config))){
          const ppConfig = Common.isValidPPConfig(JSON.stringify(config.pp_config))
          ppConfig.isValid? isValid= true : errorMessage += `${ppConfig.message}`
        }else{
          isValid = false;
          errorMessage += `Invalid PP Config, `
        }
      }

      if('fee_headers' in config!){
        // console.log(`feeHeaders: ${JSON.stringify(config.fee_headers)}`)
        if(Common.isValidJson(JSON.stringify(config.fee_headers))){
          isValid = true;
        }else{
          isValid = false;
          errorMessage += `Invalid Fee Headers, `
        }
      }
  
    }else {
      isValid = false;
      errorMessage +=  `Invalid Config Object`
    }
  
    // console.log("Error Message: "+errorMessage);
    // console.log("isVAlid: "+isValid);
  
    if(isValid){
      if('customer_number' in config! && Common.isValidMobileNumber(config.customer_number)){
        // console.log("hasCustomerNumber")
          createCustomerApiCall();
        
      }else{

        const base64 = `${config?.auth.client_id}:${config?.auth.client_secret_key}`
  
        loadURL = `${Environment.gteWebBaseURL()}instant-eligibility?gapik=${config?.auth.gq_api_key}
        &abase=${Common.encodeBase64(base64)}
        &sid=${config?.student_id}&env=${Environment.getEnvironment()}&s=rnsdk&user=new`

        if('reference_id' in config! && config.reference_id.length>0){
          loadURL += `&reference_id=${config.reference_id}`
        }

        if(`emi_plan_id` in config! && config.emi_plan_id.length>0){
          loadURL += `&emi_plan_id=${config.emi_plan_id}`
        }

        if(`udf_details` in config! && config.udf_details!=null && Common.isValidJson(JSON.stringify(config.udf_details))){
          loadURL += `&udf_details=${JSON.stringify(config.udf_details)}`
        }
  
        if(config?.pp_config!=null && config.pp_config.slug.length>0){
          loadURL += `&_pp_config=${JSON.stringify(config.pp_config)}`
        }

        if(`payment_methods` in config! && config.payment_methods.length>0){
          loadURL +=`&payment_methods=${config.payment_methods}`
        }

        if(config?.customization!=null && config.customization.theme_color.length>0){
          loadURL +=`&pc=${config?.customization.theme_color}`
        }
  
        if(config?.fee_headers!=null){
          loadURL += `&_fee_headers=${JSON.stringify(config.fee_headers)}`
        }

        if(`fee_headers_split` in config! && config.fee_headers_split != null && Common.isValidJson(JSON.stringify(config.fee_headers_split))){
          loadURL += `&fee_headers_split=${JSON.stringify(config.fee_headers_split)}`
        }

        if(prefill!=null && Common.isValidJson(JSON.stringify(prefill))){
          loadURL += `&optional=${JSON.stringify(prefill)}`
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