// Helper functions
function showSlide(id) {
  // Hide all slides
	$(".slide").hide();
	// Show just the slide we want to show
	$("#"+id).show();
}

function showAgent(id, orient) {
	$(".agent").hide();
    $(".point_agent_l").hide();
    $(".point_agent_r").hide();
	$("#"+id+"_"+orient).show();
}

function hideAgent() {
  // Hide all slides
	$(".agent").hide();
}

function choiceAgent(id) {
  // Hide all slides
	$(".agent").hide();
	// Show just the agent we want to show
	$("#"+id+"_straight").show();
}

function sourceRightToy(a) {
        document.getElementById("toy_r").src=a;
    };

function sourceRightToy2(a) {
        document.getElementById("toy_r2").src=a;
    };

function sourceLeftToy(b) {
        document.getElementById("toy_l").src=b;
    };

function sourceLeftToy2(b) {
        document.getElementById("toy_l2").src=b;
    };

function showRightToy() {
    document.getElementById('toy_r').style.visibility='visible';
      };

function showRightToy2() {
    document.getElementById('toy_r2').style.visibility='visible';
      };

function showLeftToy() {
    document.getElementById('toy_l').style.visibility='visible';
      };

function showLeftToy2() {
    document.getElementById('toy_l2').style.visibility='visible';
      };

function showEat(id) {
	$(".agent_eat").hide();
	$("#"+id+"_eat").show();
};

function choiceLeftToy(a) {
        document.getElementById("choiceToy_l").src=a;
    };

function choiceLeftToy2(a) {
        document.getElementById("choiceToy_l2").src=a;
    };

function choiceRightToy(a) {
        document.getElementById("choiceToy_r").src=a;
    };

function choiceRightToy2(a) {
        document.getElementById("choiceToy_r2").src=a;
    };

function randomInteger(n) {
	return Math.floor(Math.random()*n);
};

function randomElement(array) {
  return array[randomInteger(array.length)];
};

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function sourceSound(c) {
        document.getElementById("sound").src=c;
    };

function playSound() {
    document.getElementById("sound").play();
      };

function pause(id,time){
      $("#"+id).hide();
      setTimeout(function() {
           $("#"+id).show();    
       }, time); 
    };


// Disabling next button in preview mode
$("#button").click(function() {
    //disable accept button if in turk preview mode
    if (turk.previewMode) {
      showSlide("instructions");
      alert("Please accept HIT to view");
    } else {
      showSlide('training')
    }
});


// Preparing the experiment

// Trial types
var trial = ["train","finTrain",1,2]

// Order of animals in the experiment
var trainAgents = ["Elephant"]
var testAgents = shuffle(["Bunny","Dog"]);
var agents = trainAgents.concat(testAgents);

// Toys used in training and test
var trainToyLeft = ["car"];
var trainToyRight = ["bear"];
var Toys = ["t1","t2","t3","t4"];

// Randomize order and position of toys in test
var testRightToy = Toys.sort(() => .5 - Math.random()).slice(0,2);
var remainingToys = $.grep(Toys, function(value) {
    return $.inArray(value, testRightToy) < 0;});
var testLeftToy = remainingToys.sort(() => .5 - Math.random());

var leftToy = trainToyLeft.concat(testLeftToy);
var rightToy = trainToyRight.concat(testRightToy);

// Variable helping to move through the experiment
var agentOrient = [["straight","down"],["straight","down"],["straight","down"]];

// Randomizing location of target toy
var trainInf = ["left"];
var testInf = shuffle(["left","right"]);
var inf = trainInf.concat(testInf)


// Show the instructions slide .
showSlide("instructions");

// the actual experiment
var experiment = {
  // Parameters for this sequence.
    trial: trial,
    agents: agents,
    agentOrient: agentOrient,
    rightToy: rightToy,
    leftToy: leftToy,
    inf: inf,
    data: [],
    toyPosition: [],
    toyPosition2: [],

    // end of the training   
    endTraining: function() {
        showSlide("training2");
    },   
    // end of the experiment 
    end: function() {
    // Show the finish slide.
        showSlide("finished");
        setTimeout(function() { turk.submit(experiment) }, 5000);
    },
    // Moving on within a trial
    next: function() { 
        // when training is over show sinished training slide 
        if (experiment.trial[0] == "finTrain"){
            experiment.endTraining();
            experiment.trial.shift();
            return;
        };
        // when no more trials are left, end experiment    
        if (experiment.trial.length == 0){
            setTimeout(function() {experiment.end() }, 0);
            return;
        };  
      
        showSlide("stage");       
        // after agent said hello, move to choice      
        if (experiment.agentOrient[0][0] == "down") {
            setTimeout(function() {experiment.choice() }, 0);
            return;
        };  
    
        // show agent
      showAgent(agents[0],experiment.agentOrient[0][0]);
    
    // play hello sound and write name of agent
      if (experiment.agentOrient[0][0] == "straight") { 
          pause("next",1600); 
          sourceSound("sound/"+agents[0]+"_hello.mp3");
          playSound();
      }; 
     
        // Display obejcts on table depending on training and test condition
        if (experiment.trial[0] == "train"){
            sourceLeftToy("images/"+leftToy[0]+".png");
            showLeftToy(); 
            sourceLeftToy2("images/empty.png");
            showLeftToy2(); 
            
            sourceRightToy("images/"+rightToy[0]+".png");
            showRightToy();
            sourceRightToy2("images/empty.png");
            showRightToy2(); 
        
        } else {
        
            if (experiment.inf[0] == "left") {
                sourceLeftToy("images/"+experiment.toyPosition[0]+".png");
                showLeftToy(); 
                sourceLeftToy2("images/"+experiment.toyPosition.filter(function(x) { return x !== experiment.toyPosition[0]; })+".png");
                showLeftToy2(); 
                
                sourceRightToy("images/"+rightToy[0]+".png");
                showRightToy();
                sourceRightToy2("images/empty.png");
                showRightToy2();
            
            } else { 
        
                sourceLeftToy("images/"+leftToy[0]+".png");
                showLeftToy(); 
                sourceLeftToy2("images/empty.png");
                showLeftToy2(); 
    
                sourceRightToy("images/"+experiment.toyPosition[0]+".png");
                showRightToy();
                sourceRightToy2("images/"+experiment.toyPosition.filter(function(x) { return  x !== experiment.toyPosition[0]; })+".png");
                showRightToy2(); 
            };
        };
        // move on to next phase of exposure
        experiment.agentOrient[0].shift(); 
    },

 
    choice: function(event) {
    
        showSlide("choice"); 
    
        $("#text").text("Click on the toy")
    
        // Specify what is shown on the tables depending on training and test condition
        if (experiment.trial[0] == "train"){
      
            showAgent(agents[0],"choice");
         
            choiceLeftToy("images/"+leftToy[0]+".png");
            choiceLeftToy2("images/empty.png");
      
            choiceRightToy("images/"+rightToy[0]+".png");     
            choiceRightToy2("images/empty.png");
        
        } else {
          
            if (experiment.inf[0] == "left") {
           
                showAgent(agents[0],"point_l")
                
                choiceLeftToy("images/"+experiment.toyPosition[0]+".png");
                choiceLeftToy2("images/"+experiment.toyPosition.filter(function(x) { return x !== experiment.toyPosition[0]; })+".png");
                 
                choiceRightToy("images/"+rightToy[0]+".png"); choiceRightToy2("images/empty.png");   
                
                $("#choiceToy_l").animate({width: "180px",opacity: '0.3', queue: false, duration: 1000});
                $("#choiceToy_l").animate({width: "130px",opacity: '1', queue: false, duration: 1000});
                $("#choiceToy_l2").animate({width: "180px",opacity: '0.3', queue: false, duration: 1000});
                $("#choiceToy_l2").animate({width: "130px",opacity: '1', queue: false, duration: 1000});
                    
            } else { 
                
                showAgent(agents[0],"point_r")
             
                choiceLeftToy("images/"+leftToy[0]+".png");
                choiceLeftToy2("images/empty.png");
      
                choiceRightToy("images/"+experiment.toyPosition[0]+".png"); 
                choiceRightToy2("images/"+experiment.toyPosition.filter(function(x) { return x !== experiment.toyPosition[0]; })+".png");
                
                
                $("#choiceToy_r").animate({width: "180px",opacity: '0.3'});
                $("#choiceToy_r").animate({width: "130px",opacity: '1'});
                
                $("#choiceToy_r2").animate({width: "180px",opacity: '0.3'});
                $("#choiceToy_r2").animate({width: "130px",opacity: '1'});
            };
        };

      
    // play choice sound
    
    sourceSound("sound/"+agents[0]+"_choice.mp3");
    playSound(); 
      
    // choice can be made by clicking the objects after - possible after 9.5s
        setTimeout(function() {
            if (experiment.trial[0] == "train") {
                $(".toy_l").bind("click", experiment.eat);
            
                $(".toy_r").bind("click", experiment.eat);
            
            } else { 
            
                if (experiment.inf[0] == "left") {
                    $(".toy_l").bind("click", experiment.eat);
                    $(".toy_l2").bind("click", experiment.eat);
                } else {  
                    $(".toy_r").bind("click", experiment.eat);
                    $(".toy_r2").bind("click", experiment.eat);
                };
            };
        }, 00);
    },
      
    eat: function(event) {

      showSlide("eat");
    
        sourceSound("sound/end.mp3");
      playSound();
   
      showEat(agents[0])
   
      $("#text").text("Click on the animal to continue")
  
      // Correct object
      if (inf[0]=="left") {
          var corrToy = leftToy[0];
      } else {
          var corrToy = rightToy[0]
            };
      
      // Chosen object  
      var pick = event.target.src
       
        // Code correct: does name of chosen object contain the name of the correct object
        if (pick.indexOf(corrToy) > -1) {
            var correct =1
            } else {
                var correct = 0
                };

      // data to be collected  
      data = {
          condition: "nosub_example",
          trial: trial[0],
          agent: agents[0],
          leftToy: leftToy[0],
          rightToy: rightToy[0],
          inf: inf[0],
          pick: pick,
          correct: correct,
      };
       
      experiment.data.push(data);
        
      $(".agent_eat").bind("click", experiment.newtrial);     
    },
    
   
    newtrial: function() {
    // Unbind and shift variables between trials    
        $(".agent_eat").unbind("click"); 
        $(".toy_r").unbind("click");
        $(".toy_l").unbind("click");
        $(".toy_r2").unbind("click");
        $(".toy_l2").unbind("click");
        $("#text").text("");
   
        sourceLeftToy("images/empty.png");
        showLeftToy(); 
        sourceRightToy("images/empty.png");
        showRightToy();
        sourceLeftToy2("images/empty.png");
        showLeftToy(); 
        sourceRightToy2("images/empty.png");
        showRightToy();
 
        experiment.trial.shift();   
        experiment.agentOrient.shift();   
        experiment.agents.shift();
        experiment.inf.shift();
        experiment.rightToy.shift();
        experiment.leftToy.shift();
        
        // Randomly determine the location of each toy on the table (inner or outer position) 
        experiment.toyPosition = shuffle([leftToy[0],rightToy[0]]);
        experiment.toyPosition2 = shuffle([leftToy[0],rightToy[0]]);

        // Move on with the experiment  
        experiment.next()
    }
};
    
    
