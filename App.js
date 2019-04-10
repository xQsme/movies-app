import React, { Component } from 'react';
import { AppRegistry, ScrollView, Text, TextInput, Image, StyleSheet, View, TouchableOpacity, Button, Keyboard, Alert, Linking } from 'react-native';
import axios from 'react-native-axios';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.search);
    this.state = { text: 'Shawshank Redemption', title: "The Shawshank Redemption", year: " (1994)", director: "Frank Darabont", link: "tt0111161", genre: "Drama", imdb: "9.3", rotten: "91%", details: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", time: "142 min", icon: require("./images/fresh.png"), image: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"};
  }

  search = () => {
    Keyboard.dismiss();
    axios.get('http://www.omdbapi.com/?apikey=17c59968&t=' + this.state.text)
    .then(response => {
      if(response.data != undefined){
        this.setState({
          title: response.data.Title,
	  year:  " (" + response.data.Year + ")",
          director: response.data.Director,
          genre: response.data.Genre,
          imdb: response.data.Ratings[0].Value.split("/")[0],
          rotten: response.data.Ratings[1].Value,
          image: response.data.Poster,
          details: response.data.Plot,
          time: response.data.Runtime,
          link: response.data.imdbID
        });
      if(this.state.rotten.split("%")[0] < 60){
        this.setState({icon: require("./images/rotten.png")});
      }else{
        this.setState({icon: require("./images/fresh.png")});
      }
    }
    });
  }

  show = () => {
    Alert.alert("Plot", this.state.details);
  }

  open = () => {
    Linking.openURL("https://www.imdb.com/title/" + this.state.link);
  }
	
  rotten = () => {
    Linking.openURL("https://www.rottentomatoes.com/m/" + this.state.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_"));
  }

  letterboxd = () => {
    Linking.openURL("https://www.letterboxd.com/film/" + this.state.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"));
  }

  render() {
    return (
      <View style={{backgroundColor: '#444', flex: 1}}>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={{height: 60, fontSize: 20, marginTop: 10, marginLeft: 10, flex: 1, color: '#CCC'}}
            onChangeText={(text) => this.setState({text})}
            placeholder="Movie Name"
            underlineColorAndroid='#CCC'
            placeholderTextColor='#AAA'
          ></TextInput>
          <TouchableOpacity activeOpacity = { .5 } onPress={ this.search }>
            <Image 
              source={require('./images/search.png')}
              style={{width: 30, height: 30, marginTop: 25, marginRight: 10}}>
            </Image>
          </TouchableOpacity>
        </View>
        <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, color: "#CCC"}}>{this.state.title}{this.state.year}</Text>
          <TouchableOpacity activeOpacity = { .5 } onPress={ this.show }>
            <Image
              source={{uri: this.state.image}}
              style={{width: 263, height: 400}}>
            </Image>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, color: "#CCC"}}>{this.state.director} - {this.state.time}</Text>
          <Text style={{ fontSize: 20, color: "#CCC"}}>{this.state.genre}</Text>
          <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity activeOpacity = { .5 } onPress={ this.open }>
            <Image 
              source={require('./images/IMDB.png')}
              style={{width: 30, height: 30}}>
            </Image>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: "#CCC"}}>{this.state.imdb}</Text>
            <TouchableOpacity activeOpacity = { .5 } onPress={ this.rotten }>
                  <Image 
                    source={this.state.icon}
                    style={{width: 30, height: 30, marginLeft: 20}}>
                  </Image>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: "#CCC"}}>{this.state.rotten}</Text>
            <TouchableOpacity activeOpacity = { .5 } onPress={ this.letterboxd }>
            <Image 
              source={require('./images/letterboxd.png')}
              style={{width: 57, height: 30, marginLeft: 20}}>
            </Image>
	    </TouchableOpacity>
          </View>
        </View>
        <Text> </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
