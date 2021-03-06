// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function() {

    $("#images").hide();

    map_data = JSON.parse(mapdata);

    var golden_ratio = 1.61803398875;

    var map_canvas = $("#canvas");
    var ctx = document.getElementById("canvas").getContext("2d");
    var container = $("#app");

    $("#mapname").html(map_data.name);

    var cwidth = container.width();
    var cheight = cwidth / golden_ratio;

    map_canvas.attr("width",cwidth);
    map_canvas.attr("height",cheight);

    $(window).resize(function(){
        cwidth = container.width();
        cheight = cwidth / golden_ratio;
        map_canvas.attr("width",cwidth);
        map_canvas.attr("height",cheight);
        update_canvas(map_data);
    });

    function clear_canvas(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width(), canvas.height());
    }

    function drawLine(line, ctx) {
        linestartx = line.start.x * cwidth;
        linestarty = line.start.y * cheight;
        linectrl1x = line.ctrl1.x * cwidth;
        linectrl1y = line.ctrl1.y * cheight;
        linectrl2x = line.ctrl2.x * cwidth;
        linectrl2y = line.ctrl2.y * cheight;
        lineendx = line.end.x * cwidth;
        lineendy = line.end.y * cheight;
        
        ctx.beginPath();
        ctx.moveTo(linestartx, linestarty);
        ctx.bezierCurveTo(linectrl1x,linectrl1y,
          linectrl2x,linectrl2y,lineendx,lineendy);
        ctx.lineWidth= 7;
        ctx.lineCap ='round';
        ctx.linejoin ="round";
        ctx.strokeStyle = "rgba(0, 153, 255, 0.5)";
        ctx.shadowColor = 'rgba(224,255,255,1)';
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.closePath();
    }

    function drawLandmark(landmark, ctx) {
        var img = document.getElementById(landmark.img);
        var x = landmark.pos.x * cwidth;
        var y = landmark.pos.y * cheight;
        console.log(x + "," + y);
        if (img.complete == true) { // check if image is already loaded
            ctx.drawImage(img, x - 25, y - 25, 50, 50);
        }
        else { // load image first otherwise
            img.onload = function() {
                ctx.drawImage(img, x - 25, y - 25, 50, 50);
            }
        }
        y = y + 40;
        ctx.font = '' + (13) + 'pt Helvetica';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(landmark.landmarkname, x, y);
    }

    function update_canvas(obj) {
        lines = obj.lines;
        landmarks = obj.landmarks;
        clear_canvas(map_canvas, ctx);

        for (var i = 0; i < lines.length; i++) {
            drawLine(lines[i], ctx);
        }
        for (var i = 0; i < landmarks.length; i++) {
            drawLandmark(landmarks[i], ctx);
        }
    }

    var copy_link_button = $('#copyLinkButton');
    copy_link_button.disabled = !document.queryCommandSupported('copy');

    copy_link_button.click(function(){
      var copy_text_area = $('#copyLinkArea');
      copy_text_area.select();

      try{
        var successful = document.execCommand('copy');
        console.log('Copying text was ' +successful);
      }
      catch(err){
        console.log(err);
      }
    });

    var download_low = $('#download_low');
    var download_high = $('#download_high');

    function download_prep(canvas){
      canvas.width = 800;
      canvas.height = 600;
      update_canvas(map_data);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = 'rgba(255,255,255,1)';
      ctx.globalCompositeOperation="destination-over";
      ctx.fillRect(0,0,800,600);

    }

    download_low.click(function(){
      var download_canvas = document.getElementById("canvas");
      download_prep(canvas);
      var lowQuality = download_canvas.toDataURL("image/png", 0.1);
      downloadURI(lowQuality,"quikmap_" + map_data.name +"_l");

      cwidth = container.width();
      cheight = container.height();
      map_canvas.attr("width",cwidth);
      map_canvas.attr("height",cheight);

      update_canvas(map_data);
    });

    download_high.click(function(){
      var download_canvas = document.getElementById("canvas");
      download_prep(canvas);
      var highQuality = download_canvas.toDataURL("image/png", 1);
      downloadURI(highQuality,"quikmap_" + map_data.name +"_h");

      cwidth = container.width();
      cheight = container.height();
      map_canvas.attr("width",cwidth);
      map_canvas.attr("height",cheight);
      update_canvas(map_data);
    });

    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
      link.remove();
    }

    landmark_list = $("#triangle_landmarks");

    $('#no_close').click(function(event){
     event.stopPropagation();
    });

    for(var i =0;i<map_data.landmarks.length;i++){
      to_append = "<div class='checkbox'><label>&nbsp;&nbsp;&nbsp;<input type='checkbox' value='"+map_data.landmarks[i].id+"'>&nbsp;&nbsp;";
      to_append += map_data.landmarks[i].landmarkname;
      to_append += "</label></div>";
      landmark_list.append("<li>"+to_append+"</li>");
    }

    $('#triangle_submit').click(function(event){
          $($(':checkbox')).each(function () {
                 if (this.checked) {
                    //More to be done
                     console.log($(this).val());
                 }
          });
    });
    


    update_canvas(map_data);


});
