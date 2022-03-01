import React, { useState } from "react";
import { Button, Text, View, FlatList, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';

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

const seznamMest = [
//[název města, north/severně, east/východně]
  ['Napajedla', 49.1715583, 17.5119439],
  ['Otrokovice', 49.2099161, 17.5307672],
  ['Staré Město u Uherského Hradiště', 49.0779261, 17.4444222],
  ['Uherské Hradiště', 49.0697497, 17.4596856],
  ['Uherský Brod', 49.0251300, 17.6471506],
];

const Seznam = () => {
  return (
    <FlatList
        data={seznamMest}
        renderItem={({item}) => <Text>{item[0]}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
  );
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
        {seznamMest.map((value) => (
          <Marker
            coordinate={{
            latitude: value[1],
            longitude: value[2],
            }}
            title={value[0]}
            keyExtractor={(item, index) => index.toString()}
          />
        ))}
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
