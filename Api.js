import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ListItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.listItemContainer}>
      <Image style={styles.avatar} source={{ uri: item.urlFoto }} />
      <View>
        <Text style={styles.name}>{item.nome}</Text>
        <Text>{`Partido: ${item.siglaPartido}`}</Text>
        <Text>{`Estado: ${item.siglaUf}`}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const App = () => {
  const [deputados, setDeputados] = useState([]);

  useEffect(() => {
    const fetchDeputadosData = async () => {
      try {
        const response = await axios.get(
          'https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome'
        );
        const deputadosData = response.data.dados;
        setDeputados(deputadosData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeputadosData();
  }, []);

  const handlePress = async (deputado) => {
    try {
      const response = await axios.get(
        `https://political-api.vercel.app/presenca?deputado=${encodeURIComponent(
          deputado.nome
        )}`
      );
      const { partido, estado, presencas, ausencias_justificadas, ausencias_nao_justificadas } =
        response.data[0];

      // Aqui você pode exibir as informações adicionais do deputado
      console.log('Partido:', partido);
      console.log('Estado:', estado);
      console.log('Presenças:', presencas);
      console.log('Ausências Justificadas:', ausencias_justificadas);
      console.log('Ausências Não Justificadas:', ausencias_nao_justificadas);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={deputados}
        renderItem={({ item }) => <ListItem item={item} onPress={handlePress} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
