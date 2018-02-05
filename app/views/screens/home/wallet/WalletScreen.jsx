import React from 'react';
import { connect } from 'react-redux';
import { View, Platform, RefreshControl } from 'react-native';
import styles from './styles';
import components from './components';
const { WalletHeader, WalletAssetsContainer } = components;
import { fetchAddressAssets } from 'quid-wallet/app/actions/wallet';
import { fetchMarketData } from 'quid-wallet/app/actions/market';
import wrapWithCurrencySwitcher from 'quid-wallet/app/views/components/currency-switcher';
import CollapsibleToolbar from 'quid-wallet/app/views/components/CollapsibleToolbar';
import TransparentNavBar from 'quid-wallet/app/views/components/TransparentNavBar';
var Fabric = require('react-native-fabric');
var { Answers } = Fabric;


class WalletScreen extends React.PureComponent {    
    static navigatorStyle = {
	statusBarTextColorSchemeSingleScreen: 'light',	
	navBarHidden: true,	
	screenBackgroundColor: '#fff'
    }
    
   componentDidMount() {
    	this._fetchData();
   }
    
    _fetchData() {	
	const { fetchAddressAssets, fetchMarketData,
		activeWallet, navigator } = this.props;
	
	Promise.all([
	    fetchAddressAssets(activeWallet.address),
	    fetchMarketData()
	]).catch(() =>{
	    navigator.showInAppNotification({
		screen: "quidwallet.components.Notification", // unique ID registered with Navigation.registerScreen
		passProps: {}, // simple serializable object that will pass as props to the lightbox (optional)
		autoDismissTimerSec: 3 // auto dismiss notification in seconds
	    });		
	});
    }

    
    renderContent() {		
	return (<WalletAssetsContainer navigator={this.props.navigator}/>);
    }

    renderNavbar() {
	return (
	    <View style={styles.androidBottomMargin}> 
	      <TransparentNavBar title="Wallet" navigator={this.props.navigator}/>
	    </View>
	);
    }

    renderToolbar() {
	return (<WalletHeader navigator={this.props.navigator}/>);
    }

    _pullRefresh() {
	// firebase analytics 
	Answers.logCustom("REFRESH", {screen: 'quidwallet.home.wallet.WalletScreen'});
	
	this._fetchData();
    }
    
    render() {	
	const component = this;
	return (
	    <View style={styles.container}>
	      <View style={styles.assets}>
		<CollapsibleToolbar
		   refreshControl={<RefreshControl onRefresh={() => component._pullRefresh()}
							     refreshing={this.props.fetchingData}/>}
		renderContent={this.renderContent.bind(this)}
		renderNavBar={this.renderNavbar.bind(this)}
		renderToolBar={this.renderToolbar.bind(this)}
		collapsedNavBarBackgroundColor='#242836'
		translucentStatusBar={Platform.Version >= 21}
		toolBarHeight={245} />		  
	      </View>
	    </View>
	);
    }
}


export default connect(state => ({
    fetchingData: state.refreshers.fetchingAddressAssets
}), {
    fetchAddressAssets,
    fetchMarketData,    
})(wrapWithCurrencySwitcher(
    WalletScreen,
    true, // withDrawer,
    'WalletScreen',
    false
));
