import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
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
  }
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')

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
      <Text style={styles.maintext}>{text}</Text>

      {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
    </View>
  );
}
