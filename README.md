# BB-smart-banking
A smart banking app feature that will minimise overdraft fees by automatically transferring money from the savings account to the current account

Instructions
Before starting please make sure you have nodejs installed, you can download the windows exe here: http://nodejs.org/#download

Next open up your terminal and cd into the project file BB-smart-banking. Install Papa Parse by entering the command 'npm install papaparse' into the console.

After installation is complete, to run the app enter 'Node fee-minimiser' into the console.

After entering the command you should see a print out of the transactions before any minimisations. 
After this you should see the log 'minimising overdraft fees.......'.
After this log is a print out of the transactions, including the new ones transfering money to the savings

You will also find a new file in the project called customer-1234567-ledger-new.csv. 

This should also work with other ledgers of the same structure and fileds. To use a different file adjust the file names and paths if needed on lines 4 and 5


Dev thought process

In this secton I will record my assumptions and though process whilst developing.

For this task I have chosen to use JavaScript due to my preference to front end development. I will also be uising Node.js File parser module along with th csv parser 'Papa Parse'

I will go about this task in an iterative way, starting small and building upon it. The first thing I will do it to access the csv file line by line and print to the console.

After the first commit, it now parses the file. the file is located by creating a read stream using the NodeJS module FS. The CSV file is then parsed using Papa Parse. The parse function takes in two paramenters, the file to parse and then a config object. Inside the config is where I set the headers to true which tells the parse that the CSV file has a header row. This then changes the result data into objects rather than just an array. Also in the config is where you can dictate what happens after every row of data and when the parsing is complete. 
I have set it so that after every row, that row or record of data is turned into a transaction object. 

The next I will create the minimiser function, which will iterate through each record object, and create two transactions every time the current account balance goes below 0 to transfer the money from savings, as long as there is sufficient funds in the savings. 

To complete the overdraft fee minimisation I first needed to iterate through each transaction record and record the totals for both the savings and the current account. Thankfully JavaScript can deal with negative numbers whilst using them in sums so there was no need for me to get rid of the minus sign. 
After I had a running total going for each account, I then put in a conditional system so that when any amount of money is taken out of the current account, if the customer goes into their overdraft and if there is enough money in the savings account, then the needed amount of money to put the current account balance to £0, and add in the two transaction records into the positions in front of that record. 

I was then able to convert the transactions array into JSON and parse that back to a csv file. 


Links Used: 
https://stackoverflow.com/questions/6737824/how-to-run-a-hello-js-file-in-node-js-on-windows/6738741
https://www.papaparse.com/docs#local-files
https://nodejs.org/docs/latest/api/fs.html#fs_fs_writefile_file_data_options_callback
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setSeconds
https://www.papaparse.com/docs#unparse-config-default