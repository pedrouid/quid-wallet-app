import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { shortAddress } from 'quid-wallet/app/utils';
import { toFixed } from 'quid-wallet/app/utils';
import DateFormatted from 'quid-wallet/app/views/components/DateFormatted';
import { Icon } from 'react-native-elements';


const styles = StyleSheet.create({
	separator: {
	},
	transactionRow: {
		flex: 1,
		flexDirection: 'row',
		height: 100,
		justifyContent: 'space-between',
		paddingTop: 15,
		paddingLeft: 25,
		paddingRight: 15
	},
	arrow: {
	    marginRight: 25,
	    marginTop: 5
	}
});


const TransactionRow = ({ tx, navigator, asset }) => {
	return (
		<TouchableOpacity onPress={() => {
		      navigator.push({
			  screen: 'quidwallet.home.wallet.history.TransactionRecordScreen',
			  passProps: { tx: tx, asset: asset },
			  navigatorStyle: {		      
			      tabBarHidden: true
			  },
			  title: 'Transaction Record', // navigation bar title of the pushed screen (optional)
			  backButtonTitle: "" // override the back button title (optional)		    
		      });
		  }}>
		  
		  <View style={styles.transactionRow}>
		    <View style={{ flexDirection: "row" }}>
		      <Image
			 source={tx.direction === "OUT" ? require('quid-wallet/app/views/assets/icons/arrow-out.png') : require('quid-wallet/app/views/assets/icons/arrow-in.png')}
			 style={styles.arrow}
			 />
		      <View>
			<View style={{flexDirection: 'row'}}>
			  { (tx.status !== 1) ? <Icon name='error' color='#E33E59' size={16}/> : null }
			  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{shortAddress(tx.counterpartyAddress, 4)}</Text>
			</View>
			<DateFormatted style={{ color: "grey", }} timestamp={tx.timestamp * 1000} />
		      </View>
		    </View>
		    <View>
		      <View style={{ alignSelf: 'flex-end' }}>
			<Text style={{ fontSize: 20 }}>{toFixed(tx.value, 4)}</Text>			
		      </View>
		    </View>
		  </View>
		</TouchableOpacity>

	);
}


export default TransactionRow;