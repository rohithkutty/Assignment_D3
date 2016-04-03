console.log("Hi Rohith");

var fs = require("fs");
var data = '';
var index1;
var index2;
var chunckflag = false;
var headers;
var ctr;
var gdp;
var str_year;
var lst_year;
var output=[];

fs.readFile('json/config.json','utf8', function (err, data) {
    configFile(data);
    console.log(data);
    var readerStream = fs.createReadStream('csv/WDI_Data.csv');
    var writeStream = fs.createWriteStream('json/data3.json');
    readerStream.setEncoding('UTF8');
    // Handle stream events --> data, end, and error
    readerStream.on('data', function(chunk) {
       data = chunk;
       var line =data.split('\r\n');
       var n=line.length;
       if(chunckflag == false){
         console.log(str_year);
         console.log(line[0].split(',').indexOf(str_year));
         index1=line[0].split(',').indexOf(str_year);
         index2=line[0].split(',').indexOf(lst_year);
        //  console.log(index1);
         headers=line[0].split(',');
         chunckflag = true;
       }
          for(i=0;i<n;i++){
           var arr=line[i].split(',');
          if(arr[1]===ctr &&arr[3]=== gdp){
            for(j=index1;j<=index2;j++) {
              var yearValue = {};
               yearValue["Year"] = headers[j];
               yearValue["Value"] = arr[j];
               output.push(yearValue);
            }
            // output.sort(function(a,b) {
            //   return b.value - a.value;
            // });

            writeStream.write(JSON.stringify(output,null,1));
            readerStream.destroy();
            break;
          }
       }
    });
    readerStream.on('end',function(){
    });
    readerStream.on('error', function(err){
       console.log(err.stack);
    });
    console.log("Output Created");

});
function configFile(config) {
  var json=JSON.parse(config);
   ctr = json["Array3"]["1"];
   gdp = json["Array3"]["2"];
   str_year = json["Array3"]["3"];
   console.log(str_year);
   lst_year = json["Array3"]["4"];
   console.log(lst_year);
}
