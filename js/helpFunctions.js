/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var surveypw="KDSFp99x";

var helpIndex = {}

helpIndex.packedCircle = [
    ["0.1.Einfuehrung.html", "c","Einführung"],
    ["0.15.Inhalte.html", "c","Definitions&shy;inhalte"],
    ["0.2.Einfuehrung2.html", "c","Fenster&shy;übersicht"],
    ["1.Abbildungsflaeche.html", "r","Darstellungs&shy;bereich"],
    ["2.Navigation.html", "r", "Navigation"],
    ["3.Selektionsmodus.html", "r","Fokus"],
    ["4.Alternativen.html", "r","Alternativen"],
    ["5.Argumente.html", "r","Argumente"],
    ["6.Kontextmenu.html", "l","Navigations&shy;menü"],
    ["7.Details.html", "l","Details"],
    ["8.Optionen.html", "l","Optionen"],
    ["10.Abschluss.html", "l","Zurück zur Befragung"]
    
];
helpIndex.colTree = [
    ["0.1.Einfuehrung.html", "c","Einführung"],
    ["0.15.Inhalte.html", "c","Definitions&shy;inhalte"],
    ["0.2.Einfuehrung2.html", "c","Fenster&shy;übersicht"],
    ["1.Abbildungsflaeche.html", "r", "Darstellungs&shy;bereich"],
    ["2.Navigation.html", "r", "Navigation"],
    ["3.Selektionsmodus.html", "r","Fokus"],
    ["4.Alternativen.html", "r","Alternativen"],
    ["5.Argumente.html", "r","Argumente"],
    ["6.Kontextmenu.html", "l","Navigations&shy;menü"],
    ["7.Details.html", "l","Details"],
    ["9.LegendeUndFilter.html", "l","Optionen"],
    ["10.Abschluss.html", "l","Zurück zur Befragung"]
];
helpIndex.process = [
    ["0.Einfuehrung.html", "c","Einführung"],
    ["1.Prozessdarstellung.html", "r","Prozess&shy;darstellung"],
    ["2.Navigation.html", "r", "Navigation"],
    ["3.Expertise.html", "r", "Expertise"],
    ["3.Expertise2.html", "l", "Beteiligte Experten"],
    ["4.Abschluss.html", "l", "Zurück zur Befragung"]
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
    
    if (vismode == 2 && selectedslide == 1)
    {//Treeview:
        activeVisualization = visualization.colTree;
        position = helpIndex.colTree[indexPos][1];
        
    }
    if (vismode == 1 && selectedslide == 1)
    {//Packed Circles:
        activeVisualization = visualization.packedCircles;
        position = helpIndex.packedCircle[indexPos][1];
    }
    if (selectedslide == 0)
    {//processview:
        activeVisualization = visualization.process;
        position = helpIndex.process[indexPos][1];
    }

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
    if (activeVisualization == visualization.colTree)
    {//Treeview:
        loadurl = "helptexts/coltree/" + helpIndex.colTree[indexPos][0];
        if (helpIndex.colTree.length - 1 == indexPos)
        {
            modifyLastTutorialButton(activeVisualization);
            buttonset = true;
        }
    }
    if (activeVisualization == visualization.packedCircles)
    {//Packed Circles:
        loadurl = "helptexts/packedcircle/" + helpIndex.packedCircle[indexPos][0];
        if (helpIndex.packedCircle.length - 1 == indexPos)
        {
            modifyLastTutorialButton(activeVisualization);
            buttonset = true;
        }
    }
    if (activeVisualization == visualization.process)
    {//processview:
        loadurl = "helptexts/process/" + helpIndex.process[indexPos][0];
        if (helpIndex.process.length - 1 == indexPos)
        {
            modifyLastTutorialButton(activeVisualization);
            buttonset = true;
        }
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
    if (!resumed)
        {
    if (activeVisualization == visualization.colTree)
    {//Treeview:

       /* if (indexPos == 4)
        {
            $('#Kerndatensatz-Be0-Be38').d3Click();
        }
        if (indexPos == 5)
        {
            $('#visalternativesvis').d3Click();
        }
        if (indexPos == 6)
        {
            $('#visargumentsvis').d3Click();
        }
        if (indexPos == 7)
        {
            $('#visargumentsvis').d3Click();
        }*/
        if (indexPos == 8)
        {
            recentIDtemp='Kerndatensatz';
            recentID='Kerndatensatz-Be0-Be38-Be2-Be11-Be68-Be19';
            jumpToElementIfSpecified();
           
        }
        if (indexPos == 9)
        {
             recentIDtemp='Kerndatensatz';
            recentID='Kerndatensatz-Be0-Be38-Be2-Be11';
            jumpToElementIfSpecified();
   
        }
        if (indexPos == 11 )
        {
            $('#Kerndatensatz').d3Click();
            //collapse complete tree:
            sessionStorage.setItem('recentID','Kerndatensatz');
            recentID='Kerndatensatz';
            recentIDtemp='Kerndatensatz';
            var d= d3.select('#Kerndatensatz')[0][0].__data__;
            
            if (d.children) {
                d.children.forEach(collapse);

            }
       update(d);
      
        }
    }
   
    if (activeVisualization == visualization.packedCircles)
    {//Packed Circles:
        
        /*if (indexPos == 3)
        {
            var beschaeftigte = d3.select('#Kerndatensatz-Be0')[0][0].__data__;
            zoom2(beschaeftigte);
        }
        if (indexPos == 4)
        {
            $('#Kerndatensatz-Be0-Be38').d3Click();
        }
        if (indexPos == 5)
        {
            $('#visalternativesvis').d3Click();
        }
        if (indexPos == 6)
        {
            $('#visargumentsvis').d3Click();
        }
        if (indexPos == 7)
        {
            $('#visargumentsvis').d3Click();
        }*/
            if (indexPos == 8)
        {
            $('#Kerndatensatz-Be0-Be38-Be2-Be11-Be68-Be19').d3Click();
        }
        if (indexPos == 9)
        {
            $('#Kerndatensatz-Be0-Be38-Be2-Be11').d3Click();
        }
        if (indexPos == 11 )
        {
            $('#Kerndatensatz').d3Click();
        }
    }

   /* if (activeVisualization == visualization.process)
    {//processview:
          if (indexPos == 3 )
        {
            var d=d3.select('#PGD')[0][0].__data__;
            clickProc(d);
        }
    }*/
    }
 sessionStorage.setItem('indexPos', indexPos);
 //now update help menu:
 update_helpmenu(indexPos,activeVisualization);
}

function update_helpmenu(indexPos,activeVisualization){
    //indexpos: position in index
    //ActiveVisualization tree or process or circles
    var currentArray;
    if (activeVisualization==visualization.packedCircles)
    {
        currentArray=helpIndex.packedCircle;
    }
     if (activeVisualization==visualization.colTree)
    {
        currentArray=helpIndex.colTree;
    }
      if (activeVisualization==visualization.process)
    {
        currentArray=helpIndex.process;
    }
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
    $('.helpbuttonleft').unbind();
    $('.helpbuttonleft').html('Ende Tutorial');
    $('.helpbuttonleft').on("click", function () {
        endTutorial(activeVisualization);
    });
    $('.helpbuttoncenter').unbind();
    $('.helpbuttoncenter').html('Ende Tutorial');
    $('.helpbuttoncenter').on("click", function () {
        endTutorial(activeVisualization);
    });
     $('.helpbuttonright').unbind();
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
       
         var linkURL = "";
               if (sessionStorage.getItem("expertise")=="W") {
                   linkURL="https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMByq96GIeqWxWZpumY3j4R9zzOoic0DTS8%3d";
               }else
               {
                   linkURL="https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d";
               }
               
    var surveyTreatment2=sessionStorage.getItem('treatment2');
    if (activeVisualization == visualization.colTree)
    {//Treeview:
       
    //times: starttime       ->      tutorialendtime -> endtime
    //           | prototype_tutorial_time   | prototype_time  
    //check if tutorialendtime has been set already:
    var tutorialendtime=sessionStorage.getItem('tutorialendtime');
    if (tutorialendtime === null) {//has not been set before--> set it!
        var now = +new Date();
        sessionStorage.setItem('tutorialendtime',now);
    }
        $('.surveybutton').on("click", function () {
            //compute prototype end time:
            var endtime = +new Date();
            var starttimenew=sessionStorage.getItem('starttime');
            var tutorialendtimenew=sessionStorage.getItem('tutorialendtime');
            var prototype_tutorial_time=Math.round((tutorialendtimenew-starttimenew)/1000);
            var prototype_time=Math.round((endtime-tutorialendtimenew)/1000);
    // window.location.replace("https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d&urlimport=1&questlist=treatment;prototype_time;prototype_tutorial_time&treatment=2&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
            window.location.replace(linkURL+"&urlimport=1&questlist=treatment;treatment2;prototype_time;prototype_tutorial_time&treatment=5&treatment2="+surveyTreatment2+"&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
        
        }
   
    if (activeVisualization == visualization.packedCircles)
    {//Packed Circles:
       
    //times: starttime       ->      tutorialendtime -> endtime
    //           | prototype_tutorial_time   | prototype_time  
    //check if tutorialendtime has been set already:
    var tutorialendtime=sessionStorage.getItem('tutorialendtime');
    if (tutorialendtime === null) {//has not been set before--> set it!
        var now = +new Date();
        sessionStorage.setItem('tutorialendtime',now);
    }
        $('.surveybutton').on("click", function () {
            //compute prototype end time:
            var endtime = +new Date();
            var starttimenew=sessionStorage.getItem('starttime');
            var tutorialendtimenew=sessionStorage.getItem('tutorialendtime');
            var prototype_tutorial_time=Math.round((tutorialendtimenew-starttimenew)/1000);
            var prototype_time=Math.round((endtime-tutorialendtimenew)/1000);
    // window.location.replace("https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d&urlimport=1&questlist=treatment;prototype_time;prototype_tutorial_time&treatment=2&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
            window.location.replace(linkURL+"&urlimport=1&questlist=treatment;treatment2;prototype_time;prototype_tutorial_time&treatment=6&treatment2="+surveyTreatment2+"&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
      
    }

    if (activeVisualization == visualization.process)
    {//processview:
        
            
    //times: starttime       ->      tutorialendtime -> endtime
    //           | prototype_tutorial_time   | prototype_time  
    //check if tutorialendtime has been set already:
    var tutorialendtime=sessionStorage.getItem('tutorialendtime');
    if (tutorialendtime === null) {//has not been set before--> set it!
        var now = +new Date();
        sessionStorage.setItem('tutorialendtime',now);
    }
        $('.surveybutton').on("click", function () {
            //compute prototype end time:
            var endtime = +new Date();
            var starttimenew=sessionStorage.getItem('starttime');
            var tutorialendtimenew=sessionStorage.getItem('tutorialendtime');
            var prototype_tutorial_time=Math.round((tutorialendtimenew-starttimenew)/1000);
            var prototype_time=Math.round((endtime-tutorialendtimenew)/1000);
    // window.location.replace("https://na1.se.voxco.com/A4Survey.SurveyEngine/?st=pOw6Pcq8eMBFp%2fCX%2fcR%2f8jJieIPcIpZ%2fGIx%2bQXIPvPE%3d&urlimport=1&questlist=treatment;prototype_time;prototype_tutorial_time&treatment=2&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
            window.location.replace(linkURL+"&urlimport=1&questlist=treatment;treatment2;prototype_time;prototype_tutorial_time&treatment=3&treatment2="+surveyTreatment2+"&w="+surveypw+"&prototype_tutorial_time="+prototype_tutorial_time+"&prototype_time=" +prototype_time+ "&p=" + surveyUserId);  });           
    
            
           }
    
   if (   surveyTreatment2!="null")
    {$('.surveybutton').show();}
    $('.tutorialbutton').show();
    sessionStorage.setItem('showsurveybutton', 1);
    sessionStorage.setItem('tutorialmode', 0);
}

