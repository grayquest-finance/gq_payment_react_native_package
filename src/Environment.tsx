
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
                baseURLState.BASE_URL = "https://erp-api-stage.graydev.tech/";// Base URL for STAGE Environment
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk-stage.graydev.tech/";// Base Web URL for STAGE Environment`
                redirectionURLState.REDIRECTION_URL = "svc-dp-stage.graydev.tech";// Redirection URL for STAGE Environment
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.SANDBOX
            return (environmentState.environment = "stage");
            case "preprod":
                baseURLState.BASE_URL = "https://erp-api.ppd.graydev.in/";// Base URL for PREPROD Environment
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.ppd.graydev.in/";// Base Web URL for PREPROD Environment
                redirectionURLState.REDIRECTION_URL = "svc-dp-preprod.graydev.tech";// Redirection URL for PREPROD Environment
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.PRODUCTION
            return environmentState.environment = "preprod";
            case "live":
                baseURLState.BASE_URL = "https://erp-api.grayquest.com/";// Base URL for PRODUCTION Environment
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.grayquest.com/";// Base Web URL for PRODUCTION Environment
                redirectionURLState.REDIRECTION_URL = "svc-dp.grayquest.com";// Redirecrtion URL for PRODUCTION Environment
                cashfreeEnvState.CASHFREE_ENV = CFEnvironment.PRODUCTION
            return environmentState.environment = "live";
            default:
                baseURLState.BASE_URL = "https://erp-api.uat.graydev.in/";// Base URL for UAT Environment
                webBaseURLState.WEB_BASE_URL = "https://erp-sdk.uat.graydev.in/";// Base Web URL for UAT Environment
                redirectionURLState.REDIRECTION_URL = "svc-dp.uat.graydev.in/";// Redirection URL for UAT Environment
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

