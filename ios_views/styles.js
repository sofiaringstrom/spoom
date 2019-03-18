import { StyleSheet, Dimensions } from 'react-native';

const bgGradientOne = '#159957';
const bgGradientTwo = '#155799';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export default (styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#191414'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSplit: {
    flex: 1,
    flexDirection: 'column'
  },
  containerTop: {
    width: width,
    height: 200,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 100,
    paddingRight: 100
  },
  containerBottom: {
    width: width,
    flex: 1,
    alignSelf: 'stretch'
  },
  containerPlayer: {
    flex: 1
  },
  backgroundImagePlayer: {
    flex: 1
  },
  title: {
    fontSize: 70,
    color: '#fff',
    marginBottom: 40
  },
  login: {
    fontSize: 50,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
    marginBottom: 40
  },
  description: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40
  },
  trackName: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20
  },
  artist: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10
  },
  userText: {
    fontSize: 30,
    color: '#fff',
  },
  loginInput: {
    height: 80,
    width: 600,
    fontSize: 40,
    marginTop: 20,
    textAlign: 'center'
  },
  button: {
    height: 80,
    width: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 40,
  },
  animationContainer: {
    flex: 1,
  }
}));