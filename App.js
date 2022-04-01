import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyDtvD0iPyPoiy8EP-nRu6yCdAv4hrmBmtI");

const styles = StyleSheet.create({
  kontejner: {
    flex: 1,
    //flexDirection: "column",
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

/*
const seznamMest = [
//[název města, north/severně, east/východně]
  ['Napajedla', 49.1715583, 17.5119439],
  ['Otrokovice', 49.2099161, 17.5307672],
  ['Staré Město u Uherského Hradiště', 49.0779261, 17.4444222],
  ['Uherské Hradiště', 49.0697497, 17.4596856],
  ['Uherský Brod', 49.0251300, 17.6471506]
];
*/

var seznamMest = ['Napajedla', 'Otrokovice', 'Staré Město u Uherského Hradiště', 'Uherské Hradiště', 'Uherský Brod'];

const Seznam = () => {
  return (
    <View>
      <FlatList
        data={seznamMest}
        renderItem={({item}) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        //style={{height: 40}}
        placeholder="Přidejte město"
        onSubmitEditing={(newText) => seznamMest.push(newText)}       //nefunguje
      />
    </View>
  );
};

const vytvorMarker = (misto) => {
  var location;
  Geocoder.from(misto)
      .then(json => {
        location = json.results[0].geometry.location;                 //nefunguje
        //console.log(location);
      })
      .catch(error => console.warn(error));

  return (
      <Marker
        coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
        }}
        title={misto}
        keyExtractor={(item, index) => index.toString()}
      />
    )
}

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
