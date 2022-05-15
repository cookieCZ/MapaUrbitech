import React, { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import SQLite from 'react-native-sqlite-storage';

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

const dataListu = ['Napajedla', 'Otrokovice', 'Staré Město u Uherského Hradiště', 'Uherské Hradiště', 'Uherský Brod'];

const seznamMest = [
//[název města, latitude, longitude]
  ['Napajedla', 49.1715583, 17.5119439],
  ['Otrokovice', 49.2099161, 17.5307672],
  ['Staré Město u Uherského Hradiště', 49.0779261, 17.4444222],
  ['Uherské Hradiště', 49.0697497, 17.4596856],
  ['Uherský Brod', 49.0251300, 17.6471506],
];

var vytvoreno = false;

const db = SQLite.openDatabase(
  {
    name: 'mesta.db',
    location: 'default',
  },
  () => {},
  error => {console.log(error)}
);

const vytvorTabulku = async () => {
  db.transaction(async (tx) => {
    tx.executeSql("CREATE TABLE mesto ("
                  + "ID INTEGER PRIMARY KEY AUTOINCREMENT,"
                  + "nazev VARCHAR(50) NOT NULL,"
                  + "latitude DOUBLE(15, 10) NOT NULL,"
                  + "longitude DOUBLE(15, 10) NOT NULL)")
    seznamMest.forEach(async (value) => {
      await tx.executeSql("INSERT INTO mesto (nazev, latitude, longitude) VALUES (?, ?, ?)",
        [value[0], value[1], value[2]]
      );
    });
  });
};

const vlozMesto = async (mesto) => {
  var souradnice = {};
  
  dataListu.push(mesto);

  Geocoder.init("AIzaSyDtvD0iPyPoiy8EP-nRu6yCdAv4hrmBmtI");
  Geocoder.from(mesto)
      .then(json => {souradnice = json.results[0].geometry.location;})
      .catch(error => console.warn(error));

  await db.transaction(async (tx) => {
    await tx.executeSql("INSERT INTO mesto (nazev, latitude, longitude) VALUES (?, ?, ?)",
      [mesto, souradnice.lat, souradnice.lng]
    );
  });
};

const Seznam = () => {
    const [getMesto, setMesto] = useState('');

    vytvorTabulku();

  return (
    <View>
      <FlatList
        data={dataListu}
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
                          vlozMesto(getMesto);
                          setMesto('');}}}
        title={"přidej"}
      />
    </View>
  );
};

const vytvorMarkery = async () => {
  vytvoreno = false;
  const markery = [];

  await db.transaction(async (tx) => {
    await tx.executeSql("SELECT nazev, latitude, longitude FROM mesto",
    [],
    (tx, results) => {
      var delka = results.rows.length;
      for(var i = 0; i < delka; i++) {
        var mesto = results.rows.item(i).nazev;
        var latitude = results.rows.item(i).latitude;
        var longitude = results.rows.item(i).longitude;
        markery.push([mesto, latitude, longitude]);
      }
    });
  });

  vytvoreno = true;
  return markery;
};

const Mapa = () => {
  const poleMarkeru = vytvorMarkery();

  return (
    <MapView style={styles.mapa}
      initialRegion={{
        latitude: 49.13,
        longitude: 17.55,
        latitudeDelta: 0.1,
        longitudeDelta: 0.4,
    }}>
      {poleMarkeru.map((value) => (
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
