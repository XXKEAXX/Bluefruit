// Based on an example:
//https://github.com/don/cordova-plugin-ble-central


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
        bleDeviceList.addEventListener('touchstart', conn, false); // assume not scrolling
}



function onDeviceReady(){
	
		ble.scan([blue.serviceUUID], 5, function(device) {
				
				  
				      
				      if (device.id) {
    					
					      bluetoothList.push(device.id);
				      }

		}, onError);
	
	
	
	
	var test= setInterval(function() {
		 
	
				 if (bluetoothList.length != 0) {
					
					 ConnDeviceId = bluetoothList[0];
					 
					 ble.connect(bluetoothList[0],  function() {
					 
					
						  ble.writeWithoutResponse(bluetoothList[0], 
						  blue.serviceUUID,
				 		  blue.txCharacteristic, 
				 		  stringToBytes("hello ble"), function() {
	
						  }, onError);
						 
					 
					 }, onConnError);
					 
					 
					 
					 bluetoothList.shift();
	
						 clearInterval(test);
				}		
		 

         }, 250);
		
}

	 



function onDiscoverDevice(device){
    //Make a list in html and show devises
    var listItem = document.createElement('li'),
    html = device.name+ "," + device.id;
    listItem.innerHTML = html;
    document.getElementById("bleDeviceList").appendChild(listItem);
}


function conn(){
	
	var  deviceTouch= event.srcElement.innerHTML;
	document.getElementById("debugDiv").innerHTML =""; // empty debugDiv
	var deviceTouchArr = deviceTouch.split(",");
	ConnDeviceId = deviceTouchArr[1];
	//for debug:
	document.getElementById("debugDiv").innerHTML += "<br>"+deviceTouchArr[0]+"<br>"+deviceTouchArr[1];
	ble.connect(ConnDeviceId, onConnect, onConnError);
 }
 
function onConnect(){
	
	 rssiInterval = setInterval(function() {
                ble.readRSSI(ConnDeviceId, function(rssi) {
		
	
			document.getElementById("statusDiv").innerHTML = " Status: Connected: "+riko_af(-59, rssi);
			
		        
			
                    }, function(err) {
                        		alert('unable to read RSSI'+err);
                       		 clearInterval(rssiInterval);
                        })
            }, 20);
	
	
	
	document.getElementById("statusDiv").innerHTML = " Status: Connected";
	document.getElementById("bleId").innerHTML = ConnDeviceId;
	ble.startNotification(ConnDeviceId, blue.serviceUUID, blue.rxCharacteristic, onData, onError);
	 // ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
}

function onConnError(){
	alert("Problem connecting");
	document.getElementById("statusDiv").innerHTML = " Status: Disonnected";
}

 function onData(data){ // data received from Arduino
	document.getElementById("receiveDiv").innerHTML =  "Received: " + bytesToString(data) + "<br/>";
}

function data(txt){
	messageInput.value = txt;
}	

function sendData() { // send data to Arduino
	 var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}
	
function onSend(){
	document.getElementById("sendDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}

function disconnect() {
	ble.disconnect(deviceId, onDisconnect, onError);
}

function onDisconnect(){
	document.getElementById("statusDiv").innerHTML = "Status: Disconnected";
}
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}

	
