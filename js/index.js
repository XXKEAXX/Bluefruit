function encrypt (password, key) {
    var i,
        output = '';

    for (i = 0; i < password.length; i++) {
        var charCode = password.charCodeAt(i),
            keyedCharCode = (charCode - key) & 0xff;

        output += String.fromCharCode(keyedCharCode);
    }

    return output;
}

function decrypt (password, key) {
    return encrypt(password, -key);
}


function NineBytesTimeStamp(){

    var d = new Date();
    var ms = d.getMilliseconds();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    
     if(ms < 10 && ms < 100)
     ms = "00"+ms.toString();
     else
     ms = ms.toString();
     
 
     if(ms >= 10 && ms < 100)
     ms = "0"+ms.toString();
     else
     ms = ms.toString();
  
  
    if(s < 10)
     s = "0"+s.toString();
     else
     s = s.toString();
     
     
     if(m < 10)
     m = "0"+m.toString();
     else
     m = m.toString();
     
     if(h < 10)
     h = "0"+h.toString();
     else
     h = h.toString();
     

  return h+m+s+ms;
}



// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

function unicodeStringToTypedArray(s) {
    var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua.buffer;
}

function ChunkedTransfer(str, size, callback) {
 
    const numChunks = Math.ceil(str.length / size)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    
   	 if(numChunks-1 == i)
         callback( str.substr(o, size), 1, i);
         else
         callback( str.substr(o, size), 0, i);
         
   }
}



var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
function riko_af(transmittereffektniveau, rssi) {
	
    var db_f = transmittereffektniveau - rssi;
     
    var l_f = Math.pow(10, db_f / 10);
       
    return Math.sqrt(l_f);
}

// this is ble hm-10 UART service
/*var blue= {
    serviceUUID: "0000FFE0-0000-1000-8000-00805F9B34FB",
    characteristicUUID: "0000FFE1-0000-1000-8000-00805F9B34FB"
};*/

//the bluefruit UART Service
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var bluetoothList =[];
var BlockInterval = 0;

var ConnDeviceId;
var rssiInterval;
var canConnect = 0;
var deviceList =[];
 
function connectbutton() {
	
	canConnect = 1;
	
	document.getElementById("connectbutton").classList.add("connectbutton");
}	






function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
   
}


function UnBlockInterval(why){
	
  	 BlockInterval = 0;
	 alert("ERROR: " + why); 
}

function HowMany(time) {
    return Math.round((new Date().getTime() / 1000)) - time;
}

function ChallengeGenerator(max) {
  var textResult = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < max; i++)
    textResult += possible.charAt(Math.floor(Math.random() * possible.length));

  return textResult;
}


function onDeviceReady(){

      var encryptionkey = 240429;
      var challange = ChallengeGenerator(11);	
      var encrypteddata = encrypt(challange, encryptionkey);
      var C_ID = NineBytesTimeStamp();
	
      var registered  = 0;

      var sts =  Math.floor(Date.now() / 1000); // timestamps in seconds;
	
	
	
	
	ble.scan([blue.serviceUUID], 5, function(device) {
				
				      if (device.id) {
    					
					      bluetoothList.push(device.id);
				      }

	}, onError);
	
	
	
	
	setInterval(function() {
		 
			if(!BlockInterval){
				
				 if (bluetoothList.length != 0) {
					
					 
					 deviceId= bluetoothList[0];
					 bluetoothList.shift();
					 
					 ble.connect(deviceId,  function() {
					 
					
					 ble.startNotification(deviceId,
						       blue.serviceUUID, 
						       blue.rxCharacteristic, 
						       
						       function(data){
						
						 	var receivedid = bytesToString(data).slice(0,9);
						 
						 	var receivedpayload = decrypt(bytesToString(data).substr(9), encryptionkey);
				 
						 	if(challange ==receivedpayload && C_ID == receivedid ){
						
							
					document.getElementById("ptext").textContent="Klar til registrering!";
									
					document.getElementById("pimg").src="found.png";
							            
								
								
								
	rssiInterval = setInterval(function() {
                ble.readRSSI(deviceId, function(rssi) {

		
			
	              if(riko_af(-59, rssi) <= 0.36  && registered == 0 ||
			 
			 riko_af(-59, rssi) <= 0.36  && HowMany(sts) >= 5.0 ){
			      
			     
			      
			      switch (registered) {
  				 case 0:
					      registered = 2;
   				 break;
				 case 2:
					      registered = 3;
   				 break;
			         case 3:
					      registered = 2;
   				 break;
  
				}

	

			         var payload = ("00000000"+"."+registered.toString()+C_ID+".");
			   
			      
			      
		        	 ble.writeWithoutResponse(deviceId, 
						 		 blue.serviceUUID,
				 		 		 blue.txCharacteristic, 
				 				 stringToBytes(payload), function() {
	
							  		 BlockInterval = 1;
					
							 }, UnBlockInterval);
			      
			      	 		
			       sts = Math.floor(Date.now() / 1000); 
			      
			      
			}
                    }, function(err) {
                        			alert('unable to read RSSI'+err);
                       				 clearInterval(rssiInterval);
                        })
            }, 10);
									
								
							}else{
								if(C_ID == receivedid){
					
									
								alert("DONT MATCH!: "+challange + " == "+receivedpayload);
								
								}
							}
								
						 
						      }, UnBlockInterval);
						 
						 
						 
						 
				ChunkedTransfer(encrypteddata, 8, function(chunk, last, index){
                
			
					     setTimeout(function(payload){
						
							 	 ble.writeWithoutResponse(deviceId, 
						 		 blue.serviceUUID,
				 		 		 blue.txCharacteristic, 
				 				 stringToBytes(payload), function() {
	
							  		 BlockInterval = 1;
					
							 	 }, UnBlockInterval);
							     
						}, index*1200, (chunk+"."+last.toString()+C_ID+".") );
					
					
				});
						 
						 
						
						 
						 

						 
					 
					 }, onError);
					 
					 
					 
					
					
				
				}		
		 }

         }, 250);
		
}




function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}
