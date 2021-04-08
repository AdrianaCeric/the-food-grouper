// the link to model provided by Teachable Machine export panel
var url = "https://teachablemachine.withgoogle.com/models/nHLwAj9Zo/"


var inp = document.getElementById("image-selector");
var upl = document.getElementsByClassName("upload-btn-wrapper")[0];
upl.addEventListener("dragover", function(event) {
    event.preventDefault();
})

// Drag and drop
upl.addEventListener("drop", function(event) {
    //By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
    event.preventDefault();
    inp.files = event.dataTransfer.files;
    // access the contents of files that the user has explicitly selected
    let reader = new FileReader();
    reader.onload = function() {
        //returns file on screen
        let dataURL = reader.result;
        //what to show when file is uploaded (button and image w/ container)
        $("#selected-image").attr("src", dataURL);
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
    await $("#predict-button").hide();
    await $(".image-container").hide();
    $("#image-selector").change(function() {
        // $(".upload-btn-wrapper").hide();
        let reader = new FileReader();
        reader.onload = function() {
            let dataURL = reader.result;
            $("#selected-image").attr("src", dataURL);
            $("#prediction-list").empty();
            $("#explanation-list").empty();
            $(".confirmation-text").hide();
            $("#predict-button").show();
            $(".image-container").show();
            $(".predict").hide();
        }
        //Let selector image-selector return property "files"
        let file = $("#image-selector").prop('files')[0];
        reader.readAsDataURL(file);
        $(".predict-btn-wrapper").show();
    });

//retrieves model data
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
            setP("Unable to identify. Please try again with another photo.", 3, "index.html", "index.html", "aaaaa");
        }
        window.scrollTo(0, document.body.scrollHeight);
    })
})


function setP(a) {
    $(".upload-btn-wrapper").show();
    $("#prediction-list").html(a);
}
