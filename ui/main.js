console.log('Loaded!');

var button = documnet.getElementById("counter");

alert("buttonvalue");

button.onclick = function(){
    //create a reqest object
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            alert("inside readystate");
            if(request.state === 200){
                alert("inside readystate 200");
                var counter = request.responseText;
                var span = document.getElementById("count");
                span.innerHTML = counter.toString();
                
            }
        }
    }
    
    //make the request
    
    request.open('GET', 'http://saralanandipati.imad.hasura-app.io/counter',true);
    request.send(null);
    
};
