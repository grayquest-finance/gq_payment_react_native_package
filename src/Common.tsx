import { Environment } from "./Environment";
import base64 from 'react-native-base64';

export const Common  = {

    isValidJson(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
        } catch (e) {
          return false;
        }
    },

    isValidAuth(jsonString: string) : {isValid: boolean, message: any} {
        try{

            const auth = JSON.parse(jsonString);

            let errormessage = "";
            let isValid = false;

            if (!('client_id' in auth)) {
                isValid = false;
                errormessage += "Client Id is Required, ";
              }
              
              if (!('client_secret_key' in auth)) {
                isValid = false;
                errormessage += "Client Secret Key is Required, ";
              }
              
              if (!('gq_api_key' in auth)) {
                isValid = false;
                errormessage += "GQ API Key is Required, ";
              }

            return {
                isValid: isValid,
                message: errormessage
            }
        }catch (e){
            return {
                isValid: false,
                message: "InValid Auth Object"
            }
        }
    },

    isValidPPConfig(jsonString: string): {isValid: boolean, message: any}{
        try{
            const ppConfig = JSON.parse(jsonString);

            let errormessage = "";
            let isValid = false;

            if(!('slug' in ppConfig)){
                isValid = false;
                errormessage += "Valid slug is required"
            }
            return {
                isValid: isValid,
                message: errormessage
            }
        }catch (e){
            return {
                isValid: false,
                message: "InValid PP Config Object"
            }
        }
    },

    isValidCustomization(jsonString: string): {isValid: boolean, message: any}{
        try{
            const customization = JSON.parse(jsonString);

            let errormessage = "";
            let isValid = false;

            if(!('theme_color' in customization && !customization.theme_color.includes("#"))){
                isValid = false;
                errormessage += "Valid Theme Color is required"
            }
            return {
                isValid: isValid,
                message: errormessage
            }
        }catch (e){
            return {
                isValid: false,
                message: "InValid Customization Object"
            }
        }
    },

    isValidEnv(env: any): boolean{
        if(env == "test" || env == "stage" || env == "preprod" || env == "live")
            return true;
        else 
            return false;
    },

    isValidString(value: any): boolean {
        return typeof value == 'string' && value.trim().length>0;
    },

    isValidMobileNumber(mobile: any): boolean {
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(mobile);
    },

    encodeBase64(str: any): string {
        return base64.encode(str);;
    },

    async makeApiCall(number: any, client_id: any, client_secret_key: any, gq_api_key: any): Promise<any>{
        const url = Environment.getbaseURL()+Environment.CREATE_CUSTOMER_API;

        const jsonBody = {
            "customer_mobile": number
        }

        const base64 = this.encodeBase64(`${client_id}:${client_secret_key}`)
        console.log("base64: "+base64);

        console.log("API URL: "+url);

        const headers = {
            'Content-Type': 'application/json',
            'GQ-API-Key': gq_api_key,
            'Authorization': `Basic ${base64}`
        }

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(jsonBody)
            });

            const contentType = response.headers.get('content-type');

            // if (!response.ok) {
            //     // Handle non-2xx responses
            //     const data = await response.json();
            //     // console.log("ErrorResponse: "+data);
            //     console.log("ErrorResponse: "+JSON.stringify(data));
            //     throw new Error(JSON.stringify(data));
            // }
        
            if (contentType && contentType.includes('application/json')) {
                // Parse JSON response
                const data = await response.json();
                // return data;

                if (response.ok) {
                    console.log("SuccessResponse: "+data);
                    console.log("SuccessResponse: "+JSON.stringify(data));
                } else {
                    console.log("ErrorResponse: "+data);
                    console.log("ErrorResponse: "+JSON.stringify(data));
                }
    
                return data; // Return the API response data
            } else {
                // Handle non-JSON response
                const textData = await response.text();
                // console.error('Unexpected non-JSON response:', textData);
                // throw new Error('Received non-JSON response');
                return textData;
            }

            // const responseData = await response.json();

            
            // if (response.ok) {
            //     console.log("SuccessResponse: "+responseData);
            //     console.log("SuccessResponse: "+JSON.stringify(responseData));
            // } else {
            //     console.log("ErrorResponse: "+responseData);
            //     console.log("ErrorResponse: "+JSON.stringify(responseData));
            // }

            // return responseData; // Return the API response data
        }catch(error){
            console.error('API call error:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    },
}