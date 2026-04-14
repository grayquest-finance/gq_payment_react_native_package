
import {
    CFEnvironment
  } from 'cashfree-pg-api-contract';

const environmentState = {
    environment: '',
}

const baseURLState = {
    BASE_URL: '',
}

const webBaseURLState = {
    WEB_BASE_URL: '',
}

const redirectionURLState = {
    REDIRECTION_URL: '',
}

const cashfreeEnvState = {
    CASHFREE_ENV: '',
}

export const Environment = {

    CREATE_CUSTOMER_API: 'v1/customer/create-customer',
    GET_SESSION_CODE_API: 'v1/pp/get-session-data',
    VERSION: "\"1.1\"",

    setEnvironment(env: any): any {
        switch(env){
            case "stage":
                baseURLState.BASE_URL = "https://erp-api-stage.graydev.tech/";
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk-stage.graydev.tech/";
                redirectionURLState.REDIRECTION_URL = "svc-dp-stage.graydev.tech/";
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.SANDBOX
            return (environmentState.environment = "stage");
            case "preprod":
                baseURLState.BASE_URL = "https://erp-api.ppd.graydev.in/";
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.ppd.graydev.in/";
                redirectionURLState.REDIRECTION_URL = "svc-dp.ppd.graydev.in/";
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.PRODUCTION
            return environmentState.environment = "preprod";
            case "live":
                baseURLState.BASE_URL = "https://erp-api.grayquest.com/";
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.grayquest.com/";
                redirectionURLState.REDIRECTION_URL = "svc-dp.grayquest.com/";
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.PRODUCTION
            return environmentState.environment = "live";
            default:
                baseURLState.BASE_URL = "https://erp-api.uat.graydev.in/";
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.uat.graydev.in/";
                redirectionURLState.REDIRECTION_URL = "svc-dp.uat.graydev.in/";
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.SANDBOX
                return environmentState.environment = "test";
        }
    },

    getEnvironment(): string{
        return environmentState.environment;
    },

    getbaseURL(): string{
        return baseURLState.BASE_URL;
    },

    gteWebBaseURL(): string{
        return webBaseURLState.WEB_BASE_URL
    },

    getRedirectionURL(): string{
        return redirectionURLState.REDIRECTION_URL
    },

    getCashfreeEnv(): any{
        return cashfreeEnvState.CASHFREE_ENV
    }
}

