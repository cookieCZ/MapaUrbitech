import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    marginTop: 100,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  prvniView: {
    flex: 20,
  },
  cudlik: {
    flex: 1,
    display: "flex",
  },
  mapa: {
    width: 400,
    height: 400,
  },
});

const seznamMest = ['Napajedla', 'Otrokovice', 'Staré Město u Uherského Hradiště', 'Uherské Hradiště', 'Uherský Brod'];

const Seznam = () => {
    const [getMesto, setMesto] = useState('');

  return (
    <View>
      <FlatList
        data={seznamMest}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        placeholder="Přidejte město"
        value={getMesto}
        onChangeText={(text) => {setMesto(text)}}
      />
      <Button
        onPress={() => {if(getMesto !== '') {
                          seznamMest.push(getMesto);
                          setMesto('');}}}
        title={"přidej"}
      />
    </View>
  );
};

const vytvorMarker = (misto) => {
  const [souradnice, setSouradnice] = useState({});

  Geocoder.init("AIzaSyDtvD0iPyPoiy8EP-nRu6yCdAv4hrmBmtI");
  Geocoder.from(misto)
      .then(json => {setSouradnice(json.results[0].geometry.location);})       //nefunguje
      .catch(error => console.warn(error));

  return (
      <Marker
        /*coordinate={{
        latitude: souradnice.latitude,
        longitude: souradnice.longitude,
        }}*/
        coordinate={souradnice}
        title={misto}
      />
    )
};

const Mapa = () => {
  return (
      <MapView style={styles.mapa}
        initialRegion={{
          latitude: 49.13,
          longitude: 17.55,
          latitudeDelta: 0.1,
          longitudeDelta: 0.4,
      }}>
        {seznamMest.map((value) => vytvorMarker(value))}
      </MapView>
  );
};

const App = () => {
  const [prvniObrazovka, setPrvniObrazovka] = useState(true);

  return (
    <View style={styles.kontejner}>
      <View style={styles.prvniView}>
        {prvniObrazovka ? <Seznam/> : <Mapa/>}
      </View>
      <View style={styles.container}>
        <Button
          onPress={() => {
            setPrvniObrazovka(true);
          }}
          style={styles.cudlik}
          title={"seznam měst"}
        />
        <Button
          onPress={() => {
            setPrvniObrazovka(false);
          }}
          style={styles.cudlik}
          title={"mapa měst"}
        />
      </View>
    </View>
  );
};

export default App;
