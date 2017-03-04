var document = null;

      var lastElement = null;
      var overlayvisible=false;

function getTargetText(evt) {
      var targetElement = evt.currentTarget;
        // if ( lastElement !== targetElement )
         //{
            var targetId = targetElement.getAttributeNS(null, 'id');
            targetId=targetId.replace(/[.]/g,"\\.");
            var tipId = 'tooltip\\.' + targetId;
            //tipGroup = document.getElementById(tipId);
            var elements=d3.selectAll("#" +tipId+ " text")[0];
            var resulttext="";
            for (i=0;i<=elements.length-1;i++)
                {
                    if (elements[i].innerHTML.trim()!==""){
                    if (resulttext==="") {resulttext="<ul><li>"+elements[i].innerHTML;} else {resulttext=resulttext + "</li><li>" + elements[i].innerHTML;}
                    }
                }
             if (resulttext!=="")  { resulttext=resulttext+"</li></ul>";}
    return resulttext;
}
      function HideTooltip( evt )
      {
          d3.select("#processDetails").html(""); 
      
      };
      function ShowTooltip( evt )
      {
                var resulttext=getTargetText(evt);
       
                d3.select("#processDetails").html(resulttext); 
                
          
       
         
      };
