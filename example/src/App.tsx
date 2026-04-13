import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Modal } from 'react-native';
import GQPaymentSDK from '../../src/GQPaymentSDK';
import GQTokenCheckout from '../../src/GQTokenCheckout';

export default function App() {
  const [GQSDKInititate, setGQSDKInititate] = useState(false);

  const clientObject = {
      // avinash live
      auth: {
        client_id: 'GQ-9857f27a-4b3d-413b-9003-6df521e81d2f',
        client_secret_key: '8c9dc263-049e-435d-9145-941789ecd694',
        gq_api_key: '163d3711-efd6-4306-b9c9-241a17b47ff5'
      },
    env: "live",
    student_id: 'demo7899',
    customer_number: '8425900004',
    reference_id: 'ref123456',
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
      "student_fee": 10,
      // "Payabel EMI": 100000,
      // "Payabel AD": 50000,
      // "Payabel PG": 10
    },
    // pp_config: {
      // slug: "purva-gile"
      // slug: "edunext"
      // slug: "arjun-gile"
    // },
    // payment_methods: "['credit_card', 'net_banking']",
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
    console.log('SuccessApp:', data);
    // Alert.alert('Success', JSON.stringify(data));
  };

  // Handle failure callback
  const handleFailure = (error: object) => {
    console.log('Failure:', error);
    // Alert.alert('Failure', JSON.stringify(error));
    // setGQSDKInititate(false)
  };

  // Handle failure callback̦̦̦̦̦
  const handleCancel = (data: object) => {
    console.log('Cancel:', data);
    // Alert.alert('Cancel', JSON.stringify(data));
    setGQSDKInititate(false);
  };

  const env = 'test';
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uX2NvZGUiOiI4NDlmNmY2ZS01YzE0LTRmNmEtOGE5NC02MmEwYmE1OWMzYjQiLCJleHAiOjE3NjIyNjIzODgsImlhdCI6MTc2MjI2MTQ4OH0.mq3OgcyvUj9jaK_njLXsQQqJKDa7ugBkOZ_lo0gF_vA';

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

            {/* <GQTokenCheckout
              token={token}
              environment={env}
              onSuccess={handleSuccess}
              onFailed={handleFailure}
              onCancel= {handleCancel}
            /> */}
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
