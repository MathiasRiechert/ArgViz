/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
  window.onresize = function(){ location.reload(); }
var surveypw="KDSFp99x";
var starttime = +new Date();
    if (sessionStorage.getItem('starttime')=== null) {sessionStorage.setItem('starttime',starttime);}
var helpIndex = {}

helpIndex.table = [
    ["0.Einfuehrung.html", "c","Einführung"],
    ["1.Ueberblicksverzeichnis.html", "r", "Überblicks&shy;verzeichnis"],
    ["2.Protokollansicht.html", "r", "Protokoll&shy;ansicht"],
    ["4.Abschluss.html", "r","Abschluss"]
   
];

     var visualization = {};
    visualization.packedCircles = 1;
    visualization.colTree = 2;
    visualization.process = 3;
    
    
function advanceTutorial(indexPos,resumed)
{
    resetTutorialButton();
  //  parameter:
            // path: path to the html text to be shown
            // 
            // 
       
    var activeVisualization; // 
// position: determines, if help text is to be shown "r"-right, "c"-centered, or "l"-left
    var position;
    
    
        position = helpIndex.table[indexPos][1];
    

    //first, determine which of the help windows is already shown:
    if ($(".helpoverlayright").is(":visible"))
    {
        if (position != "r")
        {//it is shown but position is not "r" --> hide
            $(".helpoverlayright").hide();
        }
    }
    else
    {
        if (position == "r")
        {//it is not shown but position is  "r" --> show
            $(".helpoverlayright").show();
        }
    }
    if ($(".helpoverlaycenter").is(":visible"))
    {
        if (position != "c")
        {//it is shown but position is not "r" --> hide
            $(".helpoverlaycenter").hide();
            //$(".helpoverlaycenter").css("opacity","0");
        }
    }
    else
    {
        if (position == "c")
        {//it is not shown but position is  "r" --> show
            $(".helpoverlaycenter").show();
        }
    }
    if ($(".helpoverlayleft").is(":visible"))
    {
        if (position != "l")
        {//it is shown but position is not "r" --> hide
            $(".helpoverlayleft").hide();
        }
    }
    else
    {
        if (position == "l")
        {//it is not shown but position is  "r" --> show
            $(".helpoverlayleft").show();
        }
    }

    //determine, which help area is to be loaded:
    var loadurl;
    var buttonset = false;
   
        loadurl = "helptexts/" + helpIndex.table[indexPos][0];
        if (helpIndex.table.length - 1 == indexPos)
        {
            modifyLastTutorialButton(activeVisualization);
            buttonset = true;
        }
    

    //now the right tutorial window should be shown --> show text:

    if (position == "l") {
        $(".helptextleft").load(loadurl);
        if (!buttonset) {
            $('.helpbuttonleft').off()
            $('.helpbuttonleft').on("click", function () {
                advanceTutorial(indexPos + 1);
            });
        }
    }
    if (position == "c") {
        $(".helptextcenter").load(loadurl);
        if (!buttonset) {
            $('.helpbuttoncenter').off()
            $('.helpbuttoncenter').on("click", function () {
                advanceTutorial(indexPos + 1);
            });
        }
    }
    if (position == "r") {
        $(".helptextright").load(loadurl);
        if (!buttonset) {
            $('.helpbuttonright').off()
            $('.helpbuttonright').on("click", function () {
                advanceTutorial(indexPos + 1);
            });
        }
    }
    //special actions for the tutorial:
    
   
    
 sessionStorage.setItem('indexPos', indexPos);
 //now update help menu:
 update_helpmenu(indexPos,activeVisualization);
}

function update_helpmenu(indexPos,activeVisualization){
    //indexpos: position in index
    //ActiveVisualization tree or process or circles
    var currentArray=helpIndex.table;
    
    var resulthtml="<h2>Inhalt Tutorial</h2><ul>";
    for (inti=0;inti<=currentArray.length-1;inti++)
    {   
        resulthtml+="<li "
        if (inti<=indexPos){resulthtml+="class='visited'";}
        resulthtml+="><a onclick='advanceTutorial("+inti+")'>"+currentArray[inti][2]+"</a></li>"

        
    }
    resulthtml+="</ul>";
    $('.helpmenu').html(resulthtml);
}

function resetTutorialButton() {
    $('.helpbuttonleft').html('Weiter');
    $('.helpbuttonright').html('Weiter');
    $('.helpbuttoncenter').html('Weiter');
}

function modifyLastTutorialButton(activeVisualization) {
    $('.helpbuttonleft').html('Ende Tutorial');
    $('.helpbuttonleft').on("click", function () {
        endTutorial(activeVisualization);
    });
    $('.helpbuttoncenter').html('Ende Tutorial');
    $('.helpbuttoncenter').on("click", function () {
        endTutorial(activeVisualization);
    });
    $('.helpbuttonright').html('Ende Tutorial');
    $('.helpbuttonright').on("click", function () {
        endTutorial(activeVisualization);
    });
}

function endTutorial(activeVisualization) {
    $('.helpoverlaycenter').hide();
    $('.helpoverlayright').hide();
    $('.helpoverlayleft').hide();

    
   
    
    var surveyUserId=sessionStorage.getItem('userID');
    $('.tutorialbutton').on("click", function () {
            $('.surveybutton').hide();
            $('.tutorialbutton').hide();
        sessionStorage.setItem('showsurveybutton', 0);
        sessionStorage.setItem('tutorialmode', 1);
        advanceTutorial(0,false);
    });
    
    var expertise = sessionStorage.getItem('expertise');
            if (expertise == null) {
                expertise = gup("expertise")
                sessionStorage.setItem('expertise',expertise);
            }
            ;
    //times: starttime       ->      tutorialendtime -> endtime
    //           | prototype_tutorial_time   | prototype_time  
    //check if tutorialendtime has been set already:
    var tutorialendtime=sessionStorage.getItem('tutorialendtime');
    if (tutorialendtime === null) {//has not been set before--> set it!
        var now = +new Date();
        sessionStorage.setItem('tutorialendtime',now);
    }
      var surveyTreatment2=sessionStorage.getItem('treatment2');
        $('.surveybutton').on("click", function () {
            //compute prototype end time:
            var endtime = +new Date();
            var starttimenew=sessionStorage.getItem('starttime');
            var tutorialendtimenew=sessionStorage.getItem('tutorialendtime');
            var prototype_tutorial_time=Math.round((tutorialendtimenew-starttimenew)/1000);
            var prototype_time=Math.round((endtime-tutorialendtimenew)/1000);
    // window.location.replace("https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d&urlimport=1&questlist=treatment;prototype_time;prototype_tutorial_time&treatment=2&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
      var linkURL = "";
               if (sessionStorage.getItem("expertise")=="W") {
                   linkURL="https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMByq96GIeqWxWZpumY3j4R9zzOoic0DTS8%3d";
               }else
               {
                   linkURL="https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d";
               }
            window.location.replace(linkURL+"&urlimport=1&questlist=treatment;treatment2;prototype_time;prototype_tutorial_time&treatment=2&treatment2="+surveyTreatment2+"&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
   
    if (   surveyTreatment2!="null")
    {$('.surveybutton').show();}
    $('.tutorialbutton').show();
    sessionStorage.setItem('showsurveybutton', 1);
    sessionStorage.setItem('tutorialmode', 0);
}

