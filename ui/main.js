console.log('loaded!');

var button = document.getElementById("counter");
console.log('loaded12!');


button.onclick = function(){
    //create a reqest object
    var request = new XMLHttpRequest();
    console.log('loaded123!');

    
    request.onreadystatechange = function(){
        console.log('loaded1234!');

        if (request.readyState === XMLHttpRequest.DONE){
           console.log('loaded12345!');

            if(request.status === 200){
           console.log('loaded123456!');

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
