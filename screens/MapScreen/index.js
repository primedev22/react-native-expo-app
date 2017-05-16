import React from 'react';
import { View, Text, Platform, StyleSheet, Animated, Image } from 'react-native';
import { Button, Icon, SearchBar } from 'react-native-elements';
import { Header } from 'react-navigation';
import { Permissions, Location, MapView, DangerZone } from 'expo';
// MODULES
import { stylesConfig, colorConfig, SCREEN_WIDTH } from '../../modules/config';
// COMPONENTS
import LoadingScreen from '../../components/LoadingScreen';
import ShopCard from '../../components/ShopCard';
// APOLLO
import client from '../../ApolloClient';
import { userId } from 'meteor-apollo-accounts'
import { FETCH_SHOPS, SEARCH_SHOPS } from '../../apollo/queries';
import { graphql, withApollo } from 'react-apollo';

// CONSTANTS & DESTRUCTURING
// ========================================
const { boldFont, semiboldFont, regularFont, titleStyle, basicHeaderStyle } = stylesConfig;


class MapScreen extends React.Component {
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Map',
		tabBarIcon: ({ tintColor }) => <Icon name="add-location" size={30} color={tintColor} />,
	  	headerTitleStyle: titleStyle,
	  	header: (headerProps) => Platform.OS === 'android' ? null : <Header {...headerProps} />, 
	  	tabBarLabel: Platform.OS === 'android' ? ({ tintColor }) => <Icon name="add-location" size={30} color={tintColor} /> : 'Location',
	  	headerStyle: basicHeaderStyle,
	});
	constructor(props){
		super(props);
		this.state = {
			loadingLocation: false,
			data: [],
			searching: true,
			region: {
	    		longitude: -122,
      			latitude: 37,
		      	longitudeDelta: 0.04,
		      	latitudeDelta: 0.09
		    }
		}
	}
	async componentDidMount() {
	  const { status } = await Permissions.askAsync(Permissions.LOCATION);
	  if (status === 'granted') {
	    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
	    let region = {
	    		longitude: location.coords.longitude || -122,
      			latitude: location.coords.latitude || 37,
		      	latitudeDelta: 0.0922,
      			longitudeDelta: 0.0421,
		    }
	    return this.setState({region})
	  } else {
	    throw new Error('Location permission not granted');
	  }
	}
	onRegionChangeComplete = (region) => {
		this.setState({ region });
	}
	onSearchChange = (value) => {
		//this.setState({searching: true, data: []});
		client.query({
	      query: SEARCH_SHOPS,
	      variables: { string: value }
	    }).then(({ data }) => {
	    	this.setState({data: data.shops, searching: false})
	    }); 
	}
	componentWillMount(){
		client.query({
	      query: FETCH_SHOPS,
	    }).then(({ data }) => {
	    	this.setState({data: data.shops, searching: false})
	    });
	}
	render(){

		if (this.state.searching) {
			return (
				<LoadingScreen loadingMessage='Loading...' />
			);
		}


			return (
				<View style={styles.container}>
					<SearchBar
					  	onChangeText={this.onSearchChange}
					  	placeholder='Search shops...'
					  	lightTheme
					  	inputStyle={{ backgroundColor: '#fff' }}
						containerStyle={{ width: SCREEN_WIDTH }}
					/>
					
					<MapView
			          region={this.state.region}
			          style={{ flex: 1 }}
			          loadingEnabled
			          onRegionChangeComplete={this.onRegionChangeComplete}
			        >
			        	{this.state.data && this.state.data.length > 0 && this.state.data.map( item => {
			        		return (
			        			<MapView.Marker
			        				key={item._id}
			        				title={item.title}
			        				description={item.description}
			        				coordinate={{ latitude: parseFloat(item.location.lat), longitude: parseFloat(item.location.lng) }}
			        			>
				        			<MapView.Callout tooltip>
						        		<ShopCard item={item} navigation={this.props.navigation} />
						        	</MapView.Callout>
					        	</MapView.Marker>
			        		);
			        	})}
			        	
			        </MapView>
				</View>
			);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colorConfig.screenBackground,
	}
});

export default MapScreen
/*export default graphql(FETCH_SHOPS, {
	options: {
		//notifyOnNetworkStatusChange: true,
	}
})(MapScreen);*/