import React from 'react';
import { View, ScrollView, Text, Platform, Image, FlatList } from 'react-native';
//MODULES
import { FETCH_SHOP } from '../../apollo/queries';
import { stylesConfig, colorConfig } from '../../modules/config';
import LoadingScreen from '../../components/LoadingScreen';
import ShopCard from '../../components/ShopCard';
import { Icon, Button, Card } from 'react-native-elements';
import { graphql } from 'react-apollo';
import BackButton from '../../components/BackButton';
import { Tabs, WhiteSpace,  } from 'antd-mobile';
import EmptyState from '../../components/EmptyState';


//
// ========================================
const TabPane = Tabs.TabPane;
const { 
	basicHeaderStyle, 
	titleStyle, 
	regularFont, 
	textHeader, 
	textSubHeader, 
	textBody 
} = stylesConfig;


const ItemsList = ({ items, navigation, cardType }) => {

	if (!items || items.length === 0) {
		return (
			<EmptyState 
				imageComponent={
					<Image source={require('../../assets/marketing.png')} style={emptyStateIcon}/>
				}
				pageText={cardType === 'members' ? 'NO MEMBERS YET...' : 'NO MESSAGES YET...' }
			/>
		);
	}

	return (
		<FlatList
		  data={items}
		  keyExtractor={(item, index) => item._id}
		  renderItem={({item}) => {

		  	switch(cardType){
		  		case 'members':
		  			return <ShopCard item={item} navigation={navigation} />;
		  		case 'messages':
		  			return <ShopCard item={item} navigation={navigation} />;
		  		default:
		  			return null
		  	}

		  }}
		/>
	);

}
   

   

class ShopDetail extends React.Component {
	static navigationOptions = ({ navigation, screenProps }) => ({
		title: 'Shop Detail', //`${navigation.state.params.group}`,
		tabBarIcon: ({ tintColor }) => <Icon name="group" size={30} color={tintColor} />,
	  	headerTitleStyle: titleStyle,
	  	headerVisible: Platform.OS !== 'android',
	  	tabBarLabel: 'Groups',
	  	headerStyle: basicHeaderStyle,
	  	tabBarVisible: false,
	  	headerLeft: <BackButton goBack={navigation.goBack} label='' />,
	});
	render(){

		const { data, navigation } = this.props;

		if (data.loading) {
			return <LoadingScreen loadingMessage='Loading Shop...' />
		}

		return (
			<View style={{flex: 1, backgroundColor: colorConfig.screenBackground}}>

				<Card containerStyle={{marginBottom: 25}}>
					<Text style={[textHeader, {textAlign: 'center'}]}>
						{data.shopById.title}
					</Text>
				</Card>

				<Tabs defaultActiveKey="1"
					textColor={colorConfig.darkGrey}
					activeTextColor={colorConfig.business}
					activeUnderlineColor={colorConfig.business} 
					underlineColor={colorConfig.lightGrey}
					barStyle={{backgroundColor: '#fff'}}
				>
			      <TabPane tab="Details" key="1">
			      	<View style={{minHeight: 300}}>
				      	{/*<ItemsList 
				      		items={data.watchgroupById.members} 
				      		navigation={navigation}
				      		cardType='members'
				      	/>*/}
			      	</View>
			      </TabPane>
			      <TabPane tab="Map" key="2">
			      	<View style={{minHeight: 300}}>
				      	{/*<ItemsList 
				      		items={data.watchgroupById.messages} 
				      		navigation={navigation}
				      		cardType='messages'
				      	/>*/}
			      	</View>
			      </TabPane>
			    </Tabs>
			</View>
		);
	}
	
}

export default graphql(FETCH_SHOP, {
  options: (props) => { 
  	let variables = { _id: props.navigation.state.params._id };
  	return { variables } 
  }
})(ShopDetail);