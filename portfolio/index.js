$( document ).ready(function() {

    /* ------------------------------------------------------------------------------
        Image slider
    ------------------------------------------------------------------------------ */

    const divs = $("#slides > div");
    var i = 0;

    function update_text(currDiv) {
        var sliderText =  $("#slider_text");
        sliderText.css("opacity", 0);

        setTimeout(function () {
            sliderText.html(
                currDiv.find(".description").text()
            );
            sliderText.css("opacity", 1);
        },200);
    }

    function next_image(){
        $("#image_box > div").appendTo("#slides");
        var currDiv = $("#slides > div").eq(0);
        currDiv.appendTo("#image_box");

        update_text(currDiv)
    }

    function last_image(){
        var currDiv = $("#slides > div").eq(-1);
        $("#image_box > div").prependTo("#slides");
        currDiv.appendTo("#image_box");

        update_text(currDiv)

    }

    next_image();

    $("#right_arrow").on("click", next_image);
    $("#left_arrow").on("click", last_image)

    /* ------------------------------------------------------------------------------
        Video loader
    ------------------------------------------------------------------------------ */

    const videoFiles = {
            "globe_co2" : [
                [500, "media/co2-globe/400.mp4"],
                [1080, "media/co2-globe/1080.mp4"],
                [1920, "media/co2-globe/1920.mp4"]
            ],
            "co2_volumetric" : [
                [1080, "media/co2-volumetric/1080.mp4"],
                [1920, "media/co2-volumetric/1920.mp4"]
            ]
    };

    var videoSize = $("#video_size").width();
    console.log("X resolution: "+videoSize);

    $("video").each(function (i, video) {
        var resolutions = videoFiles[video.id];

        if(!resolutions){
            return;
        }

        var source = null;

        for(i=0; i<resolutions.length; i++){
            source = resolutions[i];

            if(source[0] >= videoSize){
                break;
            }
        }

        $(video).append("<source type='video/mp4' src='" + source[1] + "' />");
    })
});