import React, { Component } from 'react';
import { BackHandler, ScrollView, Text, TextInput, Image, StyleSheet, View, TouchableOpacity, Button, Keyboard, Alert, Linking } from 'react-native';
import axios from 'react-native-axios';

export default class UselessTextInput extends Component {
  constructor(props) {
    super(props);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.search);
    this.state = { list: false, results: [], text: 'Shawshank Redemption', title: "The Shawshank Redemption", year: " (1994)", director: "Frank Darabont", link: "tt0111161", genre: "Drama", imdb: "9.3", rotten: "91%", details: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", time: "142 min", icon: require("./images/fresh.png"), image: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"};
  }
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', () => {
        this.setState({list: !this.state.list});
        return true;
    });
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress');
  }

  search = () => {
    Keyboard.dismiss();
    axios.get('http://www.omdbapi.com/?apikey=17c59968&t=' + this.state.text)
    .then(response => {
      if(response.data.Title != undefined){
        this.setState({
          title: response.data.Title,
	        year:  " (" + response.data.Year + ")",
          director: response.data.Director,
          genre: response.data.Genre,
          imdb: response.data.Ratings[0].Value.split("/")[0],
          rotten: response.data.Ratings.length > 1 ? response.data.Ratings[1].Value : "N/A",
          image: response.data.Poster,
          details: response.data.Plot,
          time: response.data.Runtime,
          link: response.data.imdbID,
          list: false
        });
        if(this.state.rotten.split("%")[0] < 60){
          this.setState({icon: require("./images/rotten.png")});
        }else{
          this.setState({icon: require("./images/fresh.png")});
        }
      }
      else
      {
        fetch('https://www.ecosia.org/search?q=' + this.state.text.split(" ").join("+") + "+imdb").then(r => {
            return r.text();
        }).then( data => {
            data = data.split("\n");
            let results = [];
            let key = 0;
            for(let i =0; i < data.length; i++)
            {
                if(data[i].includes("imdb.com"))
                {
                    if(data[i+3].includes(") - IMDb"))
                    {
                        results.push({id: key++, data: data[i+3].split(" - IMDb")[0].trim().replace(/&#(\d+);/g, function(match, dec) {
                          return String.fromCharCode(dec);
                      })});
                    }
                }
            }
            var resultsFilter = [];
            results.forEach(a => {
              let keep = true;
              resultsFilter.forEach(b => {
                if(a.data == b.data){
                  keep = false;
                }
              });
              if(keep)
              {
                resultsFilter.push(a);
              }
            });
            resultsFilter.sort((a,b) => {
              return a.data.split("(")[1] > b.data.split("(")[1];
            });
            this.setState({
              results: resultsFilter,
              list: true
            });
        });
      }
    });
  }

  clear = () => {
    this.setState({text: ""});
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
        <TouchableOpacity activeOpacity = { .5 } onPress={ this.clear }>
            <Image 
              source={require('./images/delete.png')}
              style={{width: 30, height: 30, marginTop: 30, marginLeft: 10}}>
            </Image>
          </TouchableOpacity>
          <TextInput
            value={this.state.text}
            style={{height: 60, fontSize: 20, marginTop: 10, marginLeft: 10, flex: 1, color: '#CCC'}}
            onChangeText={(text) => this.setState({text})}
            placeholder="Movie Name"
            underlineColorAndroid='#CCC'
            placeholderTextColor='#AAA'
          ></TextInput>
          <TouchableOpacity activeOpacity = { .5 } onPress={ this.search }>
            <Image 
              source={require('./images/search.png')}
              style={{width: 30, height: 30, marginTop: 30, marginRight: 10, marginLeft: 10}}>
            </Image>
          </TouchableOpacity>
        </View>
        {this.renderMovie()}
      </View>
    );
  }

  handleClick = (item) => {
    axios.get('http://www.omdbapi.com/?apikey=17c59968&t=' + item.data.split(" (")[0])
    .then(response => {
      if(response.data.Title != undefined){
        this.setState({
          title: response.data.Title,
	        year:  " (" + response.data.Year + ")",
          director: response.data.Director,
          genre: response.data.Genre,
          imdb: response.data.Ratings[0].Value.split("/")[0],
          rotten: response.data.Ratings.length > 1 ? response.data.Ratings[1].Value : "N/A",
          image: response.data.Poster,
          details: response.data.Plot,
          time: response.data.Runtime,
          link: response.data.imdbID,
          list: false
        });
        if(this.state.rotten.split("%")[0] < 60){
          this.setState({icon: require("./images/rotten.png")});
        }else{
          this.setState({icon: require("./images/fresh.png")});
        }
      }
    });
  }

  renderMovie() {
    if(this.state.list)
    {
      if(this.state.results.length > 0)
      {
        return(<ScrollView>
          <Text style={{ fontSize: 20, color: "#CCC"}}>Search Results:</Text>
          <View>
            {
               this.state.results.map((item, index) => (
                  <TouchableOpacity
                     key = {item.id}
                     style = {{padding: 10,
                      marginTop: 3,
                      backgroundColor: '#777',
                      alignItems: 'center',}}
                     onPress = {() => this.handleClick(item)}>
                     <Text style={{ fontSize: 20, color: "#CCC"}}>
                        {item.data}
                     </Text>
                  </TouchableOpacity>
               ))
            }
         </View>
        </ScrollView>);
      }
        return(<ScrollView>
          <Text style={{ fontSize: 20, color: "#CCC"}}>Search Results:</Text>
          <Text style={{ fontSize: 20, color: "#CCC"}}>No Results</Text>
        </ScrollView>);
    }
    return(<ScrollView>
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
          </ScrollView>);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
