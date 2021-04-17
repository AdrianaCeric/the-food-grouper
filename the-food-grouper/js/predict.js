// the link to model provided by Teachable Machine export panel
var url = "https://teachablemachine.withgoogle.com/models/nHLwAj9Zo/"

// make a variable "input" that retrieves id image-selector
var inp = document.getElementById("image-selector");
// make variable "upload" that retrieves class upload-button-wrapper

var upl = document.getElementsByClassName("upload-btn-wrapper")[0];

// Drag and drop

//allowing event dragover to happen (Prevent file from being opened)
upl.addEventListener("dragover", function(event) {
    //Prevent the default handling of the element.
    event.preventDefault();
})

upl.addEventListener("drop", function(event) {
    event.preventDefault();
    // DataTransfer object is used to hold the data that is being dragged during a drag and drop operation
    inp.files = event.dataTransfer.files;
    // access the contents of files that the user has explicitly selected
    let reader = new FileReader();
    //when loads
    reader.onload = function() {
        // A Data URL is a URI scheme that provides a way to inline data in an HTML document.
        //returns file on screen
        let dataURL = reader.result;
        //Set the source attribute of the selected image to the value of dataURL.
        $("#selected-image").attr("src", dataURL);
        //what to show when file is uploaded (button and image w/ container)
        $("#prediction-list").empty();
        $("#explanation-list").empty();
        $("#predict-button").show();
        $(".image-container").show();
        $(".upload-btn-wrapper").show();
        $(".predict").hide();
    }
    
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
    $(".predict-btn-wrapper").show()
})

//upload file
$(async function() {
    // predict button and image container only appear after image is loaded
    await $("#predict-button").hide();
    await $(".image-container").hide();
    $("#image-selector").change(function() {
        $(".upload-btn-wrapper").hide();
        let reader = new FileReader();
        reader.onload = function() {
            let dataURL = reader.result;
            $("#selected-image").attr("src", dataURL);
            //Line 55: get rid of any previous predictions that were being displayed for previous images. 
            $("#prediction-list").empty();
            $("#explanation-list").empty();
            $(".confirmation-text").hide();
            $("#predict-button").show();
            $(".image-container").show();
            $(".predict").hide();
        }
        //Let selector image-selector return property "files"
        // The FileReader is asynchronous. We have to wait for the result with onload before we can display the image.
        let file = $("#image-selector").prop('files')[0];
        reader.readAsDataURL(file);
        $(".predict-btn-wrapper").show();
    });

    // load the model and metadata from Teachable Machine

    //This await key word pauses the execution of this function until the promise is resolved and the model is loaded. 
    model = await tmImage.load(url + "model.json", url + "metadata.json")
    $(".progress").hide();
    maxPredictions = model.getTotalClasses();

    $("#predict-button").click(async function() {
        $(".predict-btn-wrapper").hide()
        //show prediction on screen
        $(".predict").show();
        var prediction = await model.predict(document.getElementById("selected-image"));
        var fails = 0;
        // View prediction on console
        console.log(prediction)
        //for loop
        //Print classification (executing setP function) on screen if prediction is equal or more than 60% accurate
        for (var i = 0; i < prediction.length; i++) {
            console.log(prediction[i.toString()]);
            if (prediction[i.toString()].probability > 0.6) {
                console.log("Prediction Valid");

                if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "M") {
                    setP("<p>Main Course</p>");
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "A") {
                    setP("<p>Appetizer</p>");
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "D") {
                    setP("<p>Dessert</p>");
                } 
                
            } 
        }
        //Runtime error handling
        console.log(fails)
        if (fails == 1) {
            setP("Unable to identify. Please try again with another photo.");
        }
    })
})

//Function to show correct proediction
function setP(a) {
    $(".upload-btn-wrapper").show();
    $("#prediction-list").html(a);
}
