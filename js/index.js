(function() {


	// var html = "<button type='button' class='btn btn-default'>测试</button>";
	// var html = "<img src='../img/1.png'></img>";


	/*构造函数模式*/
	function ProjectShow() {
		console.log('test');
		this.init();
		var flickr = document.getElementById('project');
		var html = "<img src='../img/1.png' style='width:50px;height:50px;'></img>";
		var html = html + "<img src='../img/2.png' style='width:50px;height:50px;'></img>"
		flickr.innerHTML = html;

	}
	ProjectShow.prototype = {
		init: function() {
			/*初始化*/
		},
		ConstructHTML: function() {
			/*构造HTML*/
			var img = ['../img/1.png', '../img/2.png'];

		}
	}
	document.addEventListener("DOMContentLoaded", function() {
		var project = new ProjectShow();

	});
})();