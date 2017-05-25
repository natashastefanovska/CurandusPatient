var Observable = require('FuseJS/Observable');
var activeUrl = require("Constants/SERVICE_URL.js");
var CameraRoll = require("FuseJS/CameraRoll");
var Camera = require("FuseJS/Camera");
var ImageTools = require("FuseJS/ImageTools");
var Storage = require("FuseJS/Storage");
var myToast = require("myToast");
var imagePath = Observable(); 
var imageName = Observable(); 
var imageSize = Observable(); 
var FirstName = Observable(); 
var LastName = Observable(); 
var ChronicDiseases = Observable();
var Allergies = Observable();
var MedicationsThatRecieves = Observable();
var additionalInnfo = Observable();

var User={}; 
var base64Code={}; 
var flag = Observable("no_picture"); 


this.onParameterChanged(function(param) { 

    Storage.read("patientInfo").then(function(content) { 
        debug_log(content);  
        User = JSON.parse(content);  
        console.log("this is the user: "+JSON.stringify(User));
        FirstName.value = User.FirstName;
        LastName.value = User.LastName;
        ChronicDiseases.value = User.ChronicDiseases;
        Allergies.value = User.Allergies;
        MedicationsThatRecieves.value = User.MedicationsThatRecieves;
       
        if(User.profileImageUrl == "" || User.profileImageUrl == null){
            //User.profileImageUrl = "Assets/placeholder.png";
            console.log("nema slika za ovoj chovek....."+JSON.stringify(User));
           // Storage.write("patientInfo", User); 
        }
        else{

            //ako ima slika
        }
        

    }, function(error) {
        console.log("This user does not exist. In EditProfile page.");
    });
       
    //  Storage.read("userInfoBrojslika").then(function(content) { 
    //     flag.value="storage";
    //         console.log("On onParameterChanged vo Edit Profile page: "+content);
    //         imagePath.value="Assets/placeholder.png";
    //     }, function(error) { 
    //         console.log("nema slika vo storage!"); 
    // }); 

});


 


imagePath.value = "Assets/placeholder.png";

var displayImage = function(image) {
    imagePath.value = image.path;
    imageName.value = image.name;
    imageSize.value = image.width + "x" + image.height; 
}

// dodadeno od moki samo za prikaz na slika bez da zapishuva vo baza (CAMERA)
function takePictureShow() {
    flag.value = "camera"; 
    Camera.takePicture().then(
        function(image) {
            console.log("Vleze vo takepictureShow: "); 
            var args = {
                desiredWidth: 480,
                desiredHeight: 480,
                mode: ImageTools.SCALE_AND_CROP,
                performInPlace: true
            };
            ImageTools.resize(image, args).then(
                function(image) {
                    ImageTools.getBase64FromImage(image)
                        .then(function(image) {

                            base64Code = {
                                "base64": image
                            };
                            //console.log("vleze vo takePictureShow i ova e kodot: "+base64Code.base64.substr(1, 100));
                        });
           
                    displayImage(image);
                }
            ).catch(
                function(reason) {
                    console.log("Couldn't resize image: " + reason);
                }
            );
        }
    ).catch(
        function(reason) {
            console.log("Couldn't get image: " + reason);
        }
    );
};


// dodadeno od moki samo za prikaz na slika bez da zapishuva vo baza (LOAD)
function selectImageShow(){
         
   flag.value = "load";
   // imagePath.value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSba28jhaQEIVyA53dkQLz_NKo9As4-KHa22fxaiRqyfv4C2zw_Kw";
    console.log("Vleze vo selectImageShow: ");
    CameraRoll.getImage().then(
        function(image) {             
            var args = {
                desiredWidth: 480,  
                desiredHeight: 480, 
                mode: ImageTools.SCALE_AND_CROP,  
                performInPlace: true 
            }; 
            ImageTools.resize(image, args).then( 
                function(image) {
                    ImageTools.getBase64FromImage(image) 
                        .then(function(image) {

                            base64Code = { 
                                "base64": image 
                            };
                           //console.log("vleze vo selectImageShow i ova e kodot: "+base64Code.base64.substr(1, 100)); 
                        }
                    ).then(function(err) { 
                        console.log(err); 
                    });

                    displayImage(image);
                }
            ).catch(
                function(reason) {
                    console.log("Couldn't resize image: " + reason);
                }
            );
        }
    ).catch(
        function(reason) {
            console.log("Couldn't get image: " + reason);
            
        }
    );

};


removePicture = function() {
    console.log("Remove picture : "+JSON.stringify(User));
    flag.value = "no_picture";
    var tmp = {
        path: "Assets/placeholder.png"
    };
    

    displayImage(tmp);
}


function updateProfile(brojSlika){
    // console.log("User.patientid "+User.patientId);
    // console.log("brojSlika "+brojSlika);
    // api insert / update patient http://localhost:8080/curandusproject/webapi/api/insertpatient
    //var url = activeUrl.URL+"/curandusproject/webapi/api/updateProviderImageUrl/"+User.providerId+"&&"+brojSlika+"&&"+User.firstName+"&&"+User.lastName
   // http://192.168.0.111:8080/curandusproject/webapi/api/inserttreatmentitemimage
    var url = "http://192.168.0.111:8080/curandusproject/webapi/api/insertpatient" ;
     console.log(" cel user pred update : "+JSON.stringify(User));
    console.log(" pred update additionalInnfo: "+additionalInnfo.value+" broj slika: "+brojSlika);
     var tmp2 ={
            "state":null,
            "createdBy":0,
            "modifiedBy":0,
            "lastName":User.LastName,
            "chatId":User.chatId,
            "modified":null,
            "phone":User.phone,
            "middleInitial":null,
            "city":null,
            "firstName":User.FirstName, // tuka vneseno
            "patientId":User.patientid,
            "created":null,
            "allergies":User.Allergies,
            "zip":null,
            "streetAddress":null,
            "medicationsThatRecieves":User.MedicationsThatRecieves,
            "profileImageUrl":JSON.stringify(brojSlika), // tuka se zapishuva brojot na slika za toj pacient
            "activationCode":User.activationCode,
            "additionalInnfo":"ovaaaa",
            "chronicDiseases":User.ChronicDiseases
        }
        Storage.write("patientInfo",tmp);
    
    if(brojSlika != ""){ // ako se pravi update na user koj nema postaveno slika
        console.log(" update - ova e brojot na slika:"+brojSlika);
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            dataType: 'json',
            body: JSON.stringify(tmp2) 
        }).then(function(response) {
            status = response.status; // Get the HTTP status code 
            response_ok = response.ok; // Is response.status in the 200-range? 
            return response.json(); // This returns a promise 
        }).then(function(responseObject) {
            console.log("odgovor od update na url: " + JSON.stringify(responseObject));                 

        }).catch(function(err) {
           // console.log("Error pri update na pole vo baza za editprofileImage", err.message);
            
        });
    }
    
    else{ // ako se pravi update na user koj ima postaveno slika
        console.log("update - user koj ima postaveno slika ova e brojot na slika: " + brojSlika);
       

       
    }
        
} // end of function updateProfile()

save = function() {

    //// zachuvaj vo storage 
    var tmp = {
            "state":null,
            "createdBy":0,
            "modifiedBy":0,
            "LastName":LastName,
            "chatId":User.chatId,
            "modified":null,
            "Phone":User.phone,
            "middleInitial":null,
            "city":null,
            "FirstName":FirstName, // tuka vneseno
            "PatientId":User.patientid,
            "created":null,
            "Allergies":Allergies,
            "zip":null,
            "streetAddress":null,
            "MedicationsThatRecieves":MedicationsThatRecieves,
            "profileImageUrl":"",  /// za slika da se dopravi
            "ActivationCode":User.activationCode,
            "additionalInnfo":additionalInnfo,
            "ChronicDiseases":ChronicDiseases
        }

        console.log("LastName: "+LastName.value+" - FirstName: "+FirstName + " - Allergies:"+Allergies+" - MedicationsThatRecieves:"+MedicationsThatRecieves+ " - additionalInnfo:"+additionalInnfo+" - ChronicDiseases:"+ChronicDiseases);
        Storage.write("patientInfo", tmp); 


// od tuka 
    if(flag.value == "no_picture"){
        // update vo storage so novo vneseni podatoci pri edit
        var tmp ={
            "state":null,
            "createdBy":0,
            "modifiedBy":0,
            "LastName":LastName,
            "chatId":User.chatId,
            "modified":null,
            "Phone":User.phone,
            "middleInitial":null,
            "city":null,
            "FirstName":FirstName, // tuka vneseno
            "PatientId":User.patientid,
            "created":null,
            "Allergies":Allergies,
            "zip":null,
            "streetAddress":null,
            "MedicationsThatRecieves":MedicationsThatRecieves,
            "profileImageUrl":activeUrl.URL+"\/curandusImages"+"\/"+"Assets"+"\/"+"placeholder.png",   /// za slika da se dopravi
            "ActivationCode":User.activationCode,
            "additionalInnfo":additionalInnfo,
            "ChronicDiseases":ChronicDiseases
        }

        console.log("LastName: "+LastName.value+" - FirstName: "+FirstName + " - Allergies:"+Allergies+" - MedicationsThatRecieves:"+MedicationsThatRecieves+ " - additionalInnfo:"+additionalInnfo+" - ChronicDiseases:"+ChronicDiseases);
        Storage.write("patientInfo", tmp); 
        updateProfile(""); // update api 
    }
    else{
            
        ////////////// zachuvaj na server slika ////////////////////////////
             //console.log("THIS IS THE USER: "+JSON.stringify(User));
                   // console.log("ova e base64 na slikata: "+base64Code.base64.substr(1,100));
                    var tmp1 = {
                         "name":"edit profile",
                        "duration":"3",
                        "status":"1",
                        "createdBy":0,
                        "modifiedBy":0,
                        "created":null,
                        "modified":null,
                        "typeT":"ACK",
                        "renderingInfo":JSON.stringify(base64Code),
                        "repeatT":"5",
                        "subtreatmentid":18
                    };
                   // console.log("The tmp is created " + tmp);
                    //var url1 = activeUrl.URL+"/curandusproject/webapi/api/inserttreatmentitemimage";
                    var url1 = "http://192.168.0.111:8080/curandusproject/webapi/api/inserttreatmentitemimage";
                    fetch( url1, {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        dataType: 'json',
                        body: JSON.stringify(tmp1) 
                    }).then(function(response) { 
                        status = response.status; // Get the HTTP status code
                        console.log('status', status);
                        response_ok = response.ok; // Is response.status in the 200-range?
                        return response.json(); // This returns a promise
                        
                        
                    }).then(function(responseObject) {
                        flag.value="storage";
                        console.log("broj na slika: " + responseObject); 
                       
                       // zapishuvanje vo local storage broj na slika 
                        if(responseObject != 0){
                                imagePath.value = activeUrl.URL+"\/curandusImages"+"\/"+responseObject+".jpg"; 
                                Storage.write("userInfoBrojslika", imagePath.value); 
                                console.log("napraveno save i imagepath.value= "+imagePath.value);
                            
                            // Storage.read("userInfoBrojslika").then(function(content) { 
                            //     console.log("pri save i povlekuvanje od storage imagevalue: "+content); 
                            //     }, function(error) { 
                            //     console.log("nema slika vo storage!"); 
                            //     });
                            updateProfile(responseObject);  
                        }
                        else{
                            console.log("ne pominuva update:");
                        }                   

                    }).catch(function(err) {                    
                        console.log("ova vo error", err.message);                              
                    });
        /////////////////// end ////////////////////



        //// od storage napravi update vo baza 
        var tmp = {};
        Storage.read("patientInfo").then(function(content) { 
            debug_log(content);
            User = JSON.parse(content);
            FirstName.value = User.FirstName;
            LastName.value = User.LastName;
            ChronicDiseases.value = User.ChronicDiseases;
            Allergies.value = User.Allergies;
            MedicationsThatRecieves.value = User.MedicationsThatRecieves;
            tmp = {
                "state":null,
                "createdBy":0,
                "modifiedBy":0,
                "LastName":User.LastName,
                "chatId":User.chatId,
                "modified":null,
                "Phone":User.phone,
                "middleInitial":null,
                "city":null,
                "FirstName":User.FirstName, // tuka vneseno
                "PatientId":User.patientid,
                "created":null,
                "Allergies":User.Allergies,
                "zip":null,
                "streetAddress":null,
                "MedicationsThatRecieves":User.MedicationsThatRecieves,
                "profileImageUrl":activeUrl.URL+"\/curandusImages"+"\/"+"Assets"+"\/"+"placeholder.png",  /// za slika da se dopravi
                "ActivationCode":User.activationCode, 
                "additionalInnfo":User.additionalInnfo, 
                "ChronicDiseases":User.ChronicDiseases 
            }   
        });
        // START POVIK UPDATE VO BAZA
        fetch(activeUrl.URL + "/curandusproject/webapi/api/insertpatient", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            dataType: 'json',
            body: JSON.stringify(tmp)

        }).then(function(response) {
            status = response.status; // Get the HTTP status code
            return response.json(); // This returns a promise

        }).then(function(responseObject) {
            console.log("Success on update patient, and this is the updated: "+ JSON.stringify(responseObject));
            Storage.write("patientInfo", JSON.stringify(responseObject));
            //goToMain();

        }).catch(function(err) {
            console.log("Error PRI UPDATE NA PACIENT", err.message);
        });

    }//end else
    
    router.goBack();

/// do tuka

} // end of function save()


function deleteStorage() {
    var success = Storage.deleteSync("patientInfo");
    if (success) {
        console.log("Deleted file");
    } else {
        console.log("An error occured!");
    }
}


module.exports = {
    selectImageShow: selectImageShow,
    imagePath : imagePath,
    imageName : imageName,
    imageSize : imageSize,
    takePictureShow : takePictureShow,
    removePicture: removePicture,
    FirstName : FirstName,
    LastName : LastName,
    ChronicDiseases:ChronicDiseases,
    Allergies : Allergies,
    MedicationsThatRecieves : MedicationsThatRecieves,
    additionalInnfo : additionalInnfo,
    save : save,
    flag : flag,
    deleteStorage : deleteStorage
};