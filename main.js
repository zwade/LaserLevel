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


run = function() {
	f = $("#field")
	for (var i = 0; i < h; i++) {
		for (var a = 0; a < w; a++) {
			f.append("<span class='cell num"+(i*100+a)+"'></span>")
		}
		f.append("<br>")
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
		var deg = act.attr('deg') | 0
		console.log(act,type,deg)
		if (deg>=360) {deg-=360}
		if (type=="mirror" || type=="diag" || type=="oneway" || type=="odiag") {
			act.css("transform", "rotateZ("+(deg+45)+"deg)")
			act.attr('deg',deg+45)
			return
		}
		act.css("transform", "rotateZ("+(deg+90)+"deg)")
		act.attr('deg',deg+90)
		return
	})
	$("#tleft").click(function() {
		var act = $("#"+$(active.html()).attr('id'))
		var type = active.attr('content')
		var deg = act.attr('deg') | 0
		console.log(act,type,deg)
		if (deg<=0) {deg+=360}
		if (type=="mirror" || type=="diag" || type=="oneway" || type=="odiag") {
			act.css("transform", "rotateZ("+(deg-45)+"deg)")
			act.attr('deg',deg-45)
			return
		}
		act.css("transform", "rotateZ("+(deg-90)+"deg)")
		act.attr('deg',deg-90)
		return
	})
	$("#tdel").click(function() {
		active.html("")
		active.attr('content',"")
	})

}

$(document).ready(function() {run()})
