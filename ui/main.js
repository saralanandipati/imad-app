console.log('Loaded!');

var button = documnet.getElementById("counter");

button.onclick = function(){
    //create a reqest object
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE){
            
            if(request.state === 200){
                var counter =request.responseText;
                var span = document.getElementById("span");
                span.innerHTML = counter.toString();
                
            }
        }
    }
    
    //make the request
    
    request.open('get', 'http://saralanandipati.imad.hasura-app.io/counter',true);
    request.send(null);
    
};
