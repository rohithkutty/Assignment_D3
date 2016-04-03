console.log('Hi Rohith');

var fs=require('fs');
var data='';
var index;
var chunckflag=false;
var output=[];
var map=[];
var temp={};
var gdpc;
var gnic;
var ref_year;

fs.readFile('json/config.json', function (err, data) {
    configFile(data);
});
function configFile(config) {
  var json=JSON.parse(config);
   gdpc = json["Array2"]["1"];
   gnic = json["Array2"]["2"];
   ref_year= json["Array2"]["3"]
}

var data1=fs.readFileSync('csv/countries.csv','utf8');
var line1=data1.split('\n');
var n=line1.length;
for(j=1;j<n-1;j++){
   var cnt=line1[j].split(',');
    map.push(cnt[4].split(' ')[1]);
 }
//console.log(map);
// Create a readable stream
var readerStream = fs.createReadStream('csv/WDI_Data.csv');
var writeStream= fs.createWriteStream('json/data2.json');
// Set the encoding to be utf8.
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {
   data = chunk;
   var line2=data.split('\n');
   var m=line2.length;
   if(chunckflag==false){
     index=line2[0].split(',').indexOf("2005");
     chunckflag= true;
   }
   for(i=0;i<m;i++){
       var arr=line2[i].split(',');
       //console.log(arr[1]);
       if(map.indexOf(arr[1]) != -1){
         var index_gdpc=arr.indexOf(gdpc)+index-3;
         var index_gnic=arr.indexOf(gnic)+index-3;
         if(index_gdpc >= index){
           temp['GDPc']=arr[index];
         }
         else if(index_gnic >= index){
           temp['GNIc']=arr[index];
           temp['Country']=arr[0];
           output.push(temp);
           temp={};
         }
       }
    }
  // console.log(output);
});

readerStream.on('end',function(){
    var byGdpc = output.slice(0);
    byGdpc.sort(function(a,b) {
        return b.GDPc - a.GDPc;
    });
    var temp2=byGdpc.slice(0,15);
    writeStream.write(JSON.stringify(temp2, null,2));
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("Program Ended");
