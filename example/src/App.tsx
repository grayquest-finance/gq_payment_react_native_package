import { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert, View, Button, Modal } from 'react-native';
import GQPaymentSDK from 'gq_payment_react_native_package';

export default function App() {
  const [GQSDKInititate, setGQSDKInititate] = useState(false);

  const clientObject = {
    auth: {
      client_id: 'GQ-d9167506-30ac-4a0d-bb61-8e487a596c43',
      client_secret_key: '4a937d7a-5b41-445c-94ae-4289efff2237',
      gq_api_key: '513476f6-dfa9-4bc4-9ae3-8da925a1207d'
    },
    // auth: {
    //   client_id: 'GQ-d9167506-30ac-4a0d-bb61-8e487a596c43',
    //   client_secret_key: '4a937d7a-5b41-445c-94ae-4289efff2237',
    //   gq_api_key: '513476f6-dfa9-4bc4-9ae3-8da925a1207d'
    // },
    env: "test",
    student_id: 'std_123429',
    // customer_number: '8425980928',
    fee_headers: {
      "monthly_emi": 15000,
      "auto_debit": 5000,
      "direct": 5
    },
    // pp_config: {
    //   slug: "purva-gile"
    // },
    customization: {
      theme_color: "000000"
    }
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
    Alert.alert('Success', JSON.stringify(data));
  };

  // Handle failure callback
  const handleFailure = (error: object) => {
    console.log('Failure:', error);
    Alert.alert('Failure', JSON.stringify(error));
    setGQSDKInititate(false)
  };

  // Handle failure callback
  const handleCancel = (data: object) => {
    console.log('Cancel:', data);
    Alert.alert('Cancel', JSON.stringify(data));
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
            clientObject={clientObject}
            prefillObject={prefillObject}
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
