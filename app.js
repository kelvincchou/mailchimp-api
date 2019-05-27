const express = require("express"); //web server
const bodyParser = require("body-parser"); //help express handle post request, req.body
const request = require("request"); //simplified http client

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(".")); //images and css folder are in the same level of app.js

app.listen(process.env.PORT||3000, () => {
	console.log("Express listen on port 3000");
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
	var firstName = req.body.fName;
        var lastName = req.body.lName;
        var email = req.body.email;
        console.log(firstName, lastName, email);
	
	var data = {
		members: [{
                	email_address:email, status:"subscribed", merge_fields: {FNAME: req.body.fName, LNAME: lastName}
                }]    //[] represent array, but now only one element; use req.body.fName/firstName are ok
       	}; //end data	
    	
        var jsonData = JSON.stringify(data);

        var options = {
        	url: "https://us20.api.mailchimp.com/3.0/lists/95c2701909",
		method: "POST",
		headers: {
                        //Add you API key here:   								
			"Authorization": "anything ab197f03e9c5dxxxxxxxxxxxxxxxxxxxxx"
		},
        	body: jsonData		
        } //end options
        
	request(options, (error, response, body) => {
 		if(error) {
				console.log(error);
				//res.send("Something Wrong, Please try again! "); 
 				res.sendFile(__dirname + "/failure.html");
		} else {
			console.log(response.statusCode);
                        if (response.statusCode == 200) {
				//res.send("Congrulations! You are subscribed");
				res.sendFile(__dirname + "/success.html");
			} else {
                               	//res.send("Something Wrong, Please try again! ");
				 res.sendFile(__dirname + "/failure.html");
			}						                            
		} //end if    	

	});  //end or request 	
}); //end or post


app.post("/success", (req, res) => {
   	res.redirect("/");
});


