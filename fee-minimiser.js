const fs = require('fs');
const papa = require('papaparse'); 

const file = fs.createReadStream('customer-1234567-ledger.csv');//This will be the customer ledger used, change this file path to use a different csv.
const newFile = "customer-1234567-ledger-new.csv";
const transactions = []; // array to hold transaction objects

var count = 0; // cache the running count

//constructor for tranaction object
function addTransaction(id, accType, initiator, date, tValue, pos){
	//create transaction record object, pos represents the position the record shall be inserted
	var record = {
		'AccountID': id,
		'AccountType' : accType,
		'InitiatorType' : initiator,
		'DateTime' : new Date(date),
		'TransactionValue': parseFloat(tValue)
	}
	//add record
	if(pos == 0){
		transactions.push(record);
	}
	else{
		//insert at position
		transactions.splice(pos, 0, record);
	}
	
}

//Parse the csv file into objects
papa.parse(file, {
    header: true, //When header is set to true, results appear as an object not an array
    step: function(results, parser) {
        //add result as object to transactions list
      	addTransaction(results.data[0].AccountID, results.data[0].AccountType, results.data[0].InitiatorType, results.data[0].DateTime, results.data[0].TransactionValue, 0);
        count++;
        //console.log(transactions.length);
    },
    complete: function(results, file) {
        console.log('parsing complete read', count, 'records before minimising overdraft fees.');
        for(var i = 0; i < transactions.length; i++){
        	console.log(transactions[i]);
        }
        minimiseFees();
    }
});

// function to minimise overdraft fees 
function minimiseFees(){
	var currentTotal = 0.0;
	var savingsTotal = 0.0;

	console.log("------------------------------")
	console.log("Minimising Overdraft Fees.....")
	console.log("------------------------------")
	for(var i = 0; i < transactions.length; i++){
		if(transactions[i].AccountType == "CURRENT"){
			console.log(transactions[i]);
			//if the transactionValue is positive
			if(Math.sign(transactions[i].TransactionValue) == 1){
				currentTotal = transactions[i].TransactionValue + currentTotal; //add to total
				console.log("current account total: ", currentTotal.toFixed(2));
			 } 
			 else{ //if negative
			 	currentTotal = transactions[i].TransactionValue + currentTotal;
			 	console.log("current account total: ", currentTotal.toFixed(2));
			 	//if in overdraft ------ Overdraft minimising functionality -------
			 	if(currentTotal < 0){
			 		//if have enough savings
					if(savingsTotal >= Math.abs(currentTotal)){
						console.log("Transferring funds from savings...");
						//get time of transaction and add on seconds to it
						var dt = transactions[i].DateTime;
						dt.setSeconds( dt.getSeconds() + 10 );
						//add transaction - money from savings
						addTransaction('123', 'SAVINGS', 'ACCOUNT-HOLDER', dt, currentTotal.toFixed(2), (i + 1));
						dt.setSeconds( dt.getSeconds() + 20 );
						//add transaction money - into current
						addTransaction('789', 'CURRENT', 'ACCOUNT-HOLDER', dt, Math.abs(currentTotal).toFixed(2), (i + 2) );
					}
				}
			 }
		}
		else if(transactions[i].AccountType == "SAVINGS") {
			console.log(transactions[i]);
			if(Math.sign(transactions[i].TransactionValue) == 1){
				savingsTotal = transactions[i].TransactionValue + savingsTotal;
				console.log("savings total: ", savingsTotal.toFixed(2));
			 } 
			 else{
			 	savingsTotal = transactions[i].TransactionValue + savingsTotal;
			 	console.log("savings total: ", savingsTotal.toFixed(2));
			 }
		}
	}

	console.log("parsing json to csv file");

	//change objects to json
	const stringTransactions = JSON.stringify(transactions);

	//parse JSON to csv string
	var csv = papa.unparse(stringTransactions, {
		header: true,
		quotes: true
	});

	//Write to file
	fs.writeFile(newFile, csv, (err) => {
	  if (err) throw err;
	  console.log('The file has been saved!');
	});

}


