(function() {


	// var html = "<button type='button' class='btn btn-default'>测试</button>";
	// var html = "<img src='../img/1.png'></img>";


	/*构造函数模式*/
	function ProjectShow() {
		console.log('test');
		this.init();
		var flickr = document.getElementById('project');
		var html = '<a href="https://daisyhawen.github.io/React-gallery">react实现图片画廊</a>';
		html += '<br><a href="https://daisyhawen.github.io/html5-canvas-clock/">HTML5-实现倒计时效果</a>';
		console.log(html);
		// flickr.innerHTML = html;

	}
	ProjectShow.prototype = {
		init: function() {
			/*初始化*/
		},
		ConstructHTML: function() {
			/*构造HTML*/
			var img = ['{{ site.baseurl }}/img/1.png', '{{ site.baseurl }}../img/2.png'];

		}
	}
	document.addEventListener("DOMContentLoaded", function() {
		var project = new ProjectShow();

	});
})();