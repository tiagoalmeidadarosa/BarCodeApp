import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal, Pressable, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 'auto',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: 'tomato'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [modalVisible, setModalVisible] = useState(false);
  const [billName, setBillName] = useState('');

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    var barCode = String(data);
    if (barCode.length === 44) {
      var firstPart = barCode.substring(5, 9);
      var secondPart = barCode.substring(9, 19);
      
      const DATE_FORMAT = 'DD-MM-YYYY';
      const BASE_DATE = '07-10-1997';

      var dueDate = moment(BASE_DATE, DATE_FORMAT).add(firstPart, 'days').format(DATE_FORMAT);
      var value = parseFloat(`${secondPart.substring(0, 8)}.${secondPart.substring(8, 10)}`);
      
      setScanned(true);
      setText(`Data de vencimento: ${dueDate}\n Valor: R$ ${value}`);
      setModalVisible(true);
      console.log('Type: ' + type + '\nData: ' + data);
    }
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
    )
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 100, width: 400 }} />
      </View>

      {scanned && (
        <Button 
          title={'Scan again?'} 
          onPress={() => { 
            setText('');
            setScanned(false);
          }} 
          color='tomato'
        />
      )}

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                onChangeText={setBillName}
                value={billName}
                placeholder="Nome da conta"
              />
              <Text style={styles.maintext}>{text}</Text>
              <Pressable
                style={billName !== '' ? styles.button : [styles.button, styles.buttonDisabled]}
                onPress={() => {
                  setBillName('');
                  setModalVisible(!modalVisible);
                }}
                disabled={billName === ''}
              >
                <Text style={styles.textStyle}>Criar lembrete</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
