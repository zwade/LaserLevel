var w = 20
var h = 10

var active
var listOfImages = [
'mirror',
'oneway',
'diag',
'odiag',
'prism',
'wall',
'receiver',
'receiver_red',
'receiver_green',
'receiver_blue',
'nub',
'emitter',
]

/**var template = "{\
	name:\"<<name>>\",\
	active:<<active>>,\            //array of active obj e.g [mirror,mirror,prism]
	emit:<<emit>>,\	              //obj of emitter e.g. {x:10,y:5,dir:2}
	static:<<static>>,\                      //list of static obj e.g. [{x:2,y:3,dir:4,type:prism}] 
	receive:<<receive>>\           //list of receive objects e.g. [{x:4,y:4,dir:0,color:"green"},{isNub:true,x:6,y:3,dir:2,color:"white"}]
}" **/
var template = "{\"name\":\"<<name>>\",\"active\":<<active>>,\"emit\":<<emit>>,\"static\":<<static>>,\"receive\":<<receive>>}" 

run = function() {
	f = $("#field")
	for (var i = 0; i < h; i++) {
		for (var a = 0; a < w; a++) {
			f.append("<span class='cell' id='x"+a+"y"+i+"'></span>")
		}
		f.append("<br>")
	}
	f.append("<br><br><br>")
	for (var a = 0; a < w; a++) {
		f.append("<span class='cell' id='bank"+a+"'></span>")
	}
	s = $("#sidecont")
	for (var i = 0; i < listOfImages.length; i++) {
		s.append("<div content='"+listOfImages[i]+"' id='side-"+listOfImages[i]+"' class='sideimage' style='background-image: url(\""+listOfImages[i]+".svg\")'></div>")
		if (i%2==1) {
			s.append("<br>")
		}
	}
	s.append("<div class='sideaction' style='background-image: url(\"left.png\")' id='tleft'></div>")
	s.append("<div class='sideaction' style='background-image: url(\"right.png\")' id='tright'></div>")
	s.append('<br>')
	s.append("<div class='sideaction' style='background-image: url(\"delete.png\")' id='tdel'></div>")

	$(".cell").click(function(obj) {
		$(".cell").css("background","#06f")
		$(this).css("background","#59f")
		active = $(this)
	})
	$(".sideimage").click(function(obj) {
		if (!active) {
			return
		}
		var d = new Date()
		active.html("<img src='"+$(this).attr('content')+".svg' id='"+d.getTime()+"' class='active'></img>")
		active.attr("content",$(this).attr('content'))
	})
	$("#tright").click(function() {
		var act = $("#"+$(active.html()).attr('id'))
		var type = active.attr('content')
		var deg = active.attr('deg') | 0
		if (deg>=360) {deg-=360}
		if (type=="mirror" || type=="diag" || type=="oneway" || type=="odiag") {
			act.css("transform", "rotateZ("+(deg+45)+"deg)")
			active.attr('deg',deg+45)
			return
		}
		act.css("transform", "rotateZ("+(deg+90)+"deg)")
		active.attr('deg',deg+90)
		return
	})
	$("#tleft").click(function() {
		var act = $("#"+$(active.html()).attr('id'))
		var type = active.attr('content')
		var deg = parseInt(active.attr('deg')) | 0
		if (deg<=0) {deg+=360}
		if (type=="mirror" || type=="diag" || type=="oneway" || type=="odiag") {
			act.css("transform", "rotateZ("+(deg-45)+"deg)")
			active.attr('deg',deg-45)
			return
		}
		act.css("transform", "rotateZ("+(deg-90)+"deg)")
		act.attr('deg',deg-90)
		return
	})
	$("#tdel").click(function() {
		active.html("")
		active.attr('content',"")
		active.attr('deg',0)
	})
	$("#gjson").click(function() {
		console.log($("#jsongen"))
		$("#jsongen").val("\""+JSONClean(makeJSON())+"\"")
	})

}
function theta(obj) {
	return (parseInt(obj.attr('deg'))|0)/90
}
function makeJSON() { 
	var active = []
	var emit = {}
	var staticl = []
	var receive = []
	for (var y = 0; y < h; y++) {	
		for (var x = 0; x < w; x++) {
			act = $("#x"+x+"y"+y)
			switch (act.attr('content')) {
			case "mirror":
			case "odiag":
			case "diag":
			case "oneway":
			case "prism":
			case "wall":
				staticl[staticl.length] = {
					x:x,
					y:y,
					dir:theta(act),
					type:"<<"+act.attr('content')+">>",
				}
				break
			case "emitter":
				emit= {
					x:x,
					y:y,
					dir:theta(act)
				}
				break
			case "receiver":
			case "receiver_red":
			case "receiver_blue":
			case "receiver_green":
				receive[receive.length] = {
					x:x,
					y:y,
					dir:theta(act),
					color: (act.attr('content').split("_").length==2) ? act.attr('content').split("_")[1] : 'white',
				}
				break
			case "nub":
				receive[receive.length] = {
                                        x:x,
                                        y:y,
                                        dir:theta(act),
					color: 'white',
					isNub: true
                                }
                                break
			}
		}
	}
	for (var x = 0; x < w; x++) {
		var bank = $("#bank"+x)
		att = bank.attr('content')
		if (!att) {
			break
		}
		active[active.length] = "<<"+att+">>"
	}	
		
	var tmp = template.replace("<<active>>",JSON.stringify(active))
	tmp = tmp.replace("<<emit>>",JSON.stringify(emit))
	tmp = tmp.replace("<<static>>",JSON.stringify(staticl))
	tmp = tmp.replace("<<receive>>",JSON.stringify(receive))
	
	tmp = tmp.replace("<<name>>",$("#textbase").val())
	return tmp
}


function JSONClean(a) {
	//a = a.split("\"<<").join("")
	//a = a.split(">>\"").join("")
	return a.split("\"").join("\\\"")
}
$(document).ready(function() {run()})
