// the link to model provided by Teachable Machine export panel
// a variable (var) will be able to be reused throughout the whole program
// declaring variable var url and assigning variable url to link (= is assignment operator)
var url = "https://teachablemachine.withgoogle.com/models/nHLwAj9Zo/"

//To help manipulate the image and the file upload, save those two DOM elements into some variables.
// make a variable "input" that retrieves id image-selector
var inp = document.getElementById("image-selector");

// Drag and drop
// male variable "upload" that retrieves class upload-button-wrapper
var upl = document.getElementsByClassName("upload-btn-wrapper")[0];
//allowing event dragover to happen (Prevent file from being opened)
upl.addEventListener("dragover", function(event) {
    event.preventDefault();
})

upl.addEventListener("drop", function(event) {
    //By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
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
        //what to show when file is uploaded (button and image w/ container)
        //The attr() method sets or returns attributes and values of the selected elements. 
        //When this method is used to set attribute values, it sets attribute (src) and value pairs (dataURL) for the set of matched elements.
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
        $("#explanation-list").empty();
        $("#predict-button").show();
        $(".image-container").show();
        $(".upload-btn-wrapper").show();
        $(".predict").hide();
    }
    // let can only be used within the scope of where you declare this
    //The FileReader is asynchronous. We have to wait for the result with onload before we can display the image
    //we get the selected file from the image-selector, and load the image by calling readAsDataURL on reader and passing in the selected image file.
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
    $(".predict-btn-wrapper").show()
})

//upload file
$(async function() {
    await $("#predict-button").hide();
    await $(".image-container").hide();
    $("#image-selector").change(function() {
        $(".upload-btn-wrapper").hide();
        let reader = new FileReader();
        reader.onload = function() {
            let dataURL = reader.result;
            $("#selected-image").attr("src", dataURL);
            //get rid of any previous predictions that were being displayed for previous images. 
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
    // tf.loadLayersModel() returns a Promise. Meaning that this function promises to return the model at some point in the future.


    //This await key word pauses the execution of this wrapping function until the promise is resolved and the model is loaded. This is why we use the async keyword when defining this function... Because if we want to use the await keyword, then it has to be contained within an async function.
    model = await tmImage.load(url + "model.json", url + "metadata.json")
    $(".progress").hide();
    maxPredictions = model.getTotalClasses();

    $("#predict-button").click(async function() {
        $(".predict-btn-wrapper").hide()
        //show prediction on screen
        $(".predict").show();
        /*$(".progress").html("<h5>Classifying food...</h5>");*/
        var prediction = await model.predict(document.getElementById("selected-image"));
        var fails = 0;
        //Print classification on screen if prediction is equal or more than 60% accurate
        // View prediction in console
        console.log(prediction)
        for (var i = 0; i < prediction.length; i++) {
            console.log(prediction[i.toString()]);
            if (prediction[i.toString()].probability > 0.6) {
                console.log("ITS THISSSS");

                if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "M") {
                    setP("<p>Main Course</p>", 0);
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "A") {
                    setP("<p>Appetizer</p>", 1);
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "D") {
                    setP("<p>Dessert</p>", 2);
                } 
                
            } else {
                fails++;
            }
        }
        //Runtime error handling
        console.log(fails)
        if (fails == 4) {
            setP("Unable to identify. Please try again with another photo.");
        }
        window.scrollTo(0, document.body.scrollHeight);
    })
})


function setP(a) {
    $(".upload-btn-wrapper").show();
    $("#prediction-list").html(a);
}
