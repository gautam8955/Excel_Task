const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
let alert = require('alert'); 

const bodyParser = require('body-parser');
const dashboard = require('./routes/dashboard');
var multer = require('multer');
var Excel = require('exceljs');
const mappedData = require('./models').mappedData;
const models = require('./models');

const app = express();
var filePath, filePath1;
var excelFileNames = [];
var wb = new Excel.Workbook();


//Setting Paths.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(express.static(path.join(__dirname, 'public')));    

app.use(express.static(__dirname + '/views'));

app.use(express.static(__dirname + '/public'));

//using router file.
app.use(dashboard);

//Syncing Sequelize model.
models.sequelize.sync().then(function() {
    console.log('Nice! Database is working');
})
.catch(function(err) {
    console.log(err, "Something went wrong.");
});



//Uploading excel file using multer.
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        // var datetimestamp = Date.now();
        if(!file.originalname.match(/\.(xls|xlsx)$/)) {
            return cb(new Error('Only xls|xlsx file type  are allowed!'), false);
        }
        cb(null, file.originalname)
    }
    //,
    // allowedFiles: function (req, file, cb){
    //     if(!file.originalname.match(/\.(xls|xlsx)$/)) {
    //         return cb(new Error('Only xls|xlsx file type  are allowed!'), false);
    //     }
    //     cb(null, true);
    // }
});





//storing files in local storage 2 files at a time.
var upload = multer({
                storage: storage
            }).array('file', 2);

//Route for uploading of file.            
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
            alert("Only xls|xlsx file type are allowed!");
            //console.log("Only xls|xlsx file type are allowed!");
            res.redirect('/');
            //res.send('Not Uploaded successfully');
            return;
        }
        readFileName();
        res.redirect('/home');
    });
});

//setting directory path of uploads.
const directoryPath = path.join(__dirname, './uploads');

//Reading file names which are present in uploads folder. 
const readFileName = () => {
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            excelFileNames.push(file);
            //console.log(file); 
        });
        //console.log(excelFileNames);
        excelFiles(excelFileNames);
        // return excelFileNames;
    });

}

    
    
//Setting Excel File Paths.
const excelFiles = (excelFileNames) => {
    //console.log(excelFileNames);
    filePath = path.join(__dirname,'./uploads/' + excelFileNames[0]);
    filePath1 = path.join(__dirname,'./uploads/' + excelFileNames[1]);
    //console.log(filePath);
    //console.log(filePath1);  
}


//Reading the data of excel-1.
const readExcel1 = () => {
    return wb.xlsx.readFile(filePath).then(function(){

        var sh = wb.getWorksheet("Sheet1");
        var table = [];
        var row = [];
        for (let i = 1; i <= sh.rowCount; i++) {
            for( let j = 1; j <= sh.actualColumnCount; j++){
                if(sh.getRow(i).getCell(j).value && sh.getRow(i).getCell(j).value.text) {
                    row[j-1] = sh.getRow(i).getCell(j).value.text;    
                }
                else{
                    row[j-1] = sh.getRow(i).getCell(j).value;
                }
                
            }
            table.push(row);
            row = [];
        }
        return table;
    });
}



//Reading the data of excel-2.
const readExcel2 = () => {
    return wb.xlsx.readFile(filePath1).then(function(){

        var sh = wb.getWorksheet("Sheet1");
        var table = [];
        var row = [];
        for (let i = 1; i <= sh.rowCount; i++) {
            for( let j = 1; j <= sh.actualColumnCount; j++){
                if(sh.getRow(i).getCell(j).value && sh.getRow(i).getCell(j).value.text) {
                    row[j-1] = sh.getRow(i).getCell(j).value.text;    
                }
                else{
                    row[j-1] = sh.getRow(i).getCell(j).value;
                }
                
            }
            table.push(row);
            row = [];
        }
        return table;
    });
}


//Mapping of data according given names of column by user.
const mapping = (excel1, excel2, column1, column2, res) => {
    // console.log("excel1", excel1 );
    // console.log("excel2", excel2 );
    let row1 = excel1.length;
    let row2 = excel2.length;
    let col1 = excel1[0].length;
    let col2 = excel2[0].length;
    // console.log(col1);
    // console.log(row1);
    // console.log(row2);
    let index1=-1, index2=-1;
    for(let i = 0; i < col1; i++) {
        if(excel1[0][i] === column1){
            index1 = i;
            // console.log(index1);
        }
    }
    if(index1 === -1){
        alert("Enter Correct Name of Column-1");
        res.redirect('/home');
    }
    
    for(let i = 0; i < col2; i++) {
        if(excel2[0][i] === column2){
            index2 = i;
            // console.log(index2);
        }
    }
    if(index2 === -1){
        alert("Enter Correct Name of Column-2");
        res.redirect('/home');
    }

    var data = {};
    let k=0;
    var result = [];
    for(let i = 1; i < row1; i++){
        for(let j = 1; j < row2; j++){
            if(excel1[i][index1] === excel2[j][index2]){
                // console.log(excel1[i]);
                // console.log(excel2[j]);
                data = {
                    excel1: excel1[i],
                    excel2: excel2[j]
                }
                
                result[k] =  data;
                k++;
            }
        }
    }
    //console.log(result);
    return result;

}


//Routing for storing the mapped data into mysql database.
app.post('/excelData', (req, res) => {
    
    // console.log(req.body.column1);
    // console.log(req.body.column2);
    var column1 = req.body.column1;
    var column2 = req.body.column2;

    const excelData1 = readExcel1();
    excelData1.then(function(result) {
        //console.log(result);
        var excel1 = result;
        const excelData2 = readExcel2();
        excelData2.then(function(result1) {
            var excel2 = result1;
            //console.log(result1);
            var excel = mapping(excel1, excel2, column1, column2, res);
            // console.log(excel[0].excel1[0]);



            let i = 0;
           
            for(i = 0; i < excel.length; i++){
                mappedData.create({
                    Customer_ID: excel[i].excel1[0],
                    Customer_Name: excel[i].excel1[1],
                    Customer_Email: excel[i].excel1[2],
                    Customer_Phone: excel[i].excel1[3],
                    Product_ID: excel[i].excel2[0],
                    Product_Name: excel[i].excel2[1],
                    Product_Amount: excel[i].excel2[2] 
                })
                // .then(mappedData => res.status(201).send(mappedData))
                // .catch(error => res.status(400).send(error));
            }

            if(i > 0){
                alert("Data Successfully Mapped");
                res.redirect('deleteFiles');
            }
            
            

        })
    })
})


//Route for deleting the excel files after mapping and storing it to database.
app.get('/deleteFiles', (req, res) => {
    const pathToFile = filePath;
    const pathToFile1 = filePath1;
    // console.log(filePath);

    fs.unlink(pathToFile, function(err) {
        if (err) {
            throw err
        } else {
            console.log("Successfully deleted the file.")
        }
    })

    fs.unlink(pathToFile1, function(err) {
        if (err) {
            throw err
        } else {
            console.log("Successfully deleted the file.")
        }
    })
    res.redirect('/');
})




module.exports = app;