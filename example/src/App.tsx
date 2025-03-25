import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Modal } from 'react-native';
import GQPaymentSDK from 'gq_payment_react_native_package';

export default function App() {
  const [GQSDKInititate, setGQSDKInititate] = useState(false);

  const clientObject = {
    // auth: {
    //   client_id: 'GQ-d9167506-30ac-4a0d-bb61-8e487a596c43',
    //   client_secret_key: '4a937d7a-5b41-445c-94ae-4289efff2237',
    //   gq_api_key: '513476f6-dfa9-4bc4-9ae3-8da925a1207d'
    // },

    // pranit-1
    // auth: {
    //   client_id: 'GQ-d9167506-30ac-4a0d-bb61-8e487a596c43',
    //   client_secret_key: '4a937d7a-5b41-445c-94ae-4289efff2237',
    //   gq_api_key: '513476f6-dfa9-4bc4-9ae3-8da925a1207d'
    // },

    // Edunext
    // auth: {
    //   client_id: 'GQ-a194690e-c1f8-483c-9d83-2a2fd737b021',
    //   client_secret_key: '94c35f29-84fe-4a50-a752-f4328b9b850d',
    //   gq_api_key: 'f4877340-0771-46d7-bb60-a582afc610c7'
    // },

     // Edunext
     auth: {
      client_id: 'GQ-a194690e-c1f8-483c-9d83-2a2fd737b021',
      client_secret_key: '94c35f29-84fe-4a50-a752-f4328b9b850d',
      gq_api_key: 'f4877340-0771-46d7-bb60-a582afc610c7'
    },

    // auth: {
    //   client_id: 'GQ-0f81714a-902e-480b-a7cf-dc6efa2c7c3f',
    //   client_secret_key: '44c4d4ea-a40b-44a2-a1e2-67a77ae1e245',
    //   gq_api_key: 'fba2411b-ed05-4820-878d-a42c4475efac'
    // },

    // auth: {
    //   client_id: 'GQ-d9167506-30ac-4a0d-bb61-8e487a596c43',
    //   client_secret_key: '4a937d7a-5b41-445c-94ae-4289efff2237',
    //   gq_api_key: '513476f6-dfa9-4bc4-9ae3-8da925a1207d'
    // },
    env: "stage",
    student_id: 'std_121000124',
    customer_number: '8425900opj',
    // reference_id: '',
    // emi_plan_id: "131873",
    // udf_details: {
    //   "udf_1":"dsdsdsd"
    // },
    // fee_headers: {
    //   "monthly_emi": 15000,
    //   "auto_debit": 5000,
    //   "direct": 5
    // },
    fee_headers: {
      "student_fee": 15000,
    },
    pp_config: {
      // slug: "purva-gile"
      slug: "edunext"
      // slug: "arjun-gile"
    },
    payment_methods: "['credit_card', 'net_banking']",
    // fee_headers_split : {
    //   monthly_emi: {
    //     "bank_id": "ABC123R",
    //     "type": "PERCENTAGE",
    //     "value": "50"
    //   }
    // },
    // customization: {
    //   theme_color: "000000"
    // }
  };

  const prefillObject = {
    student_details: {
      student_first_name: 'John',
      student_last_name: 'Doe',
    },
    customer_details: {
      customer_email: 'john@gmail.com'
    },
  };

  // const prefillObject = null;

  const openGQSDK = () => {
    setGQSDKInititate(true)
  }

  // Handle success callback
  const handleSuccess = (data: object) => {
    console.log('Success:', data);
    // Alert.alert('Success', JSON.stringify(data));
  };

  // Handle failure callback
  const handleFailure = (error: object) => {
    console.log('Failure:', error);
    // Alert.alert('Failure', JSON.stringify(error));
    // setGQSDKInititate(false)
  };

  // Handle failure callback
  const handleCancel = (data: object) => {
    console.log('Cancel:', data);
    // Alert.alert('Cancel', JSON.stringify(data));
    setGQSDKInititate(false)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Open GQSDK" onPress={openGQSDK} />

      {/* Modal for WebView */}
      <Modal
        visible={GQSDKInititate}
        animationType="slide"
        // onRequestClose={() => setGQSDKInititate(false)}
        >
          <View style={styles.container}>
          <GQPaymentSDK 
            config={clientObject}
            prefill={prefillObject}
            onSuccess={handleSuccess}
            onFailed={handleFailure}
            onCancel= {handleCancel}
            />
          </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    // alignItems: 'center',
  },
});
