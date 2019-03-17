const fs = require('fs');
const papa = require('papaparse'); 


const file = fs.createReadStream('customer-1234567-ledger.csv');//This will be the customer ledger used, change this file path to use a different csv. 
var count = 0; // cache the running count

//constructor for tranaction object
function addTransaction(id, accType, initiator, date, tValue){
	//create transaction record object
	var record = {
		'AccountID': id,
		'AccountType' : accType,
		'InitiatorType' : initiator,
		'DateTime' : date,
		'TransactionValue': tValue
	}
	//add record
	transactions.push(record);
}

const transactions = [];

function minimizeFees(transactions){
	var currentTotal = 0;
	var savingsTotal = 0;
	for(var i = transactions.length; i > 0; i--){
		
	}
}
papa.parse(file, {
    header: true, //When header is set to true, results appear as an object not an array
    step: function(results, parser) {
        //add result as object to transactions list
      	addTransaction(results.data[0].AccountID, results.data[0].AccountType, results.data[0].InitiatorType, results.data[0].DateTime, results.data[0].TransactionValue);
        count++;
        //console.log(transactions.length);
    },
    complete: function(results, file) {
        console.log('parsing complete read', count, 'records before minimizing overdraft fees.');
        //minimizeFees(transactions);

        for(var i = transactions.length; i > 0; i--){
        	console.log(transactions[i]);
        }
    }
});

