(function() {
	var obtn = document.getElementById("ui-backtotop-btn");
	var timer = null;
	var isTop = true;
	var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

	// 每次滚动都会有个滚动事件
	window.onscroll = function() {
		var osTop = document.documentElement.scrollTop || document.body.scrollTop;

		// 大于或等于一屏的高度，则隐藏
		if (osTop >= clientHeight) {
			obtn.style.display = "block";
		} else {
			obtn.style.display = "none";
		};

		// 滚动过程中拖动则清除计时器
		if (!isTop) {
			clearInterval(timer);
		}
		isTop = false;
	}

	obtn.onclick = function() {
		// 设置滚动及滚动速度
		timer = setInterval(function() {
			var osTop = document.documentElement.scrollTop || document.body.scrollTop;
			var ispeed = Math.floor(-osTop / 5);
			document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
			isTop = true;
			if (osTop == 0) {
				clearInterval(timer);
			}
		}, 30)

	}
})()