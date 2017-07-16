(function(){
var dom = document.getElementById("clock");
// 获取canvas上下文
var ctx = dom.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var r = width / 2;
// 求放大缩小的比例，如外圈宽度原始为10,canvas原始长宽为200,放大缩小后为width与x,则他们放大缩小比例相同，即200/width=10/x，放大缩小后的x=10*width/200=10*(width/200)
// 后面r已经跟width的比例关联，所以不用乘以比例，没关联的才要乘以比例
var rem = width / 200;

// 画时钟背景
function drawBackground() {
	// 与draw的restore相对应，保存画之前的环境，后面每秒重复执行画的动作的时候移中心点等操作需要最初的环境
	ctx.save();
	// 重新映射画布上的 (0,0) 原点位置到正方形的中心。
	ctx.translate(r, r);

	//画外圈
	ctx.beginPath();
	// 设置线条宽度
	ctx.strokeStyle = "#3CC4C4";
	ctx.lineWidth = 10 * rem;
	//圆外圈 原点0, 0, 半径r - 线条宽度的一半, 起始角，结束角，顺时针
	ctx.arc(0, 0, r-ctx.lineWidth/2, 0, 2*Math.PI, false);
	ctx.stroke();

	// 画小时点 用三角函数,也要用到弧度rad，由于arc画圆起始角是顺时针方向3小时的地方0*Math.PI,所以
	var hourNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
	// 设置文本大小字体
	ctx.font = 18 * rem + "px Arial";
	// 文本左右对齐
	ctx.textAlign = "center";
	// 文本上下对齐
	ctx.textBaseline = "middle";
	// 每个小时点的坐标，i为索引
	hourNumbers.forEach(function(number, i) {
		// 一个圆的弧度为2π，12个点平均每个点的弧度就是 2π除以12,对应的每个点的弧度就是平均值乘以索引i
		var rad = 2 * Math.PI / 12 * i;
		// x坐标等于cos的值乘以半径，y坐标等于sin的值乘以半径，由于参数要用到弧度，弧度的作用就用在这里
		// 由于小时数是在内圆，比半径要小一些，所以要减去一些数值
		var x = Math.cos(rad) * (r - 30 * rem);
		var y = Math.sin(rad) * (r - 30 * rem);
		// 在对应的位置填入文本
		ctx.fillText(number, x, y)
	});

	// 画分钟点，i为索引
	for (var i=0;i<60;i++) {
		var rad = 2 * Math.PI / 60 * i;
		var x = Math.cos(rad) * (r - 18 * rem);
		var y = Math.sin(rad) * (r - 18 * rem);
		// 画分钟圆点
		ctx.beginPath();
		// 小时点位置为黑色，其他为灰色
		if (i % 5 === 0) {
			ctx.fillStyle = "#000";
			ctx.arc(x, y, 2 * rem, 0, 2*Math.PI, false);
		} else {
			ctx.fillStyle = "#ccc";
			ctx.arc(x, y, 2 * rem, 0, 2*Math.PI, false);
		}
		// 实心圆
		ctx.fill();
	}
}

// 画时针,传入分针数使时针对应在刻数之间
function drawHour(hour, minute) {
	// 注意线条样式会被之前上面的设置影响,所以要用save保存画之前的初始状态，画完后restore初始状态
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 6 * rem;
	ctx.strokeStyle = "#000";
	ctx.lineCap = "round";
	// 设置旋转弧度，时针对应的刻数位置为，2π除以12等于一刻钟再除以60，表示1分钟在刻数对应的位置
	var rad = 2 * Math.PI / 12 * hour;
	var mrad = 2 * Math.PI / 12 / 60 * minute;
	ctx.rotate(rad + mrad);
	// 开始画
	ctx.moveTo(0, 10 * rem);
	// r已经跟width的比例关联，所以不用乘以比例
	ctx.lineTo(0, - r / 2);
	ctx.stroke();
	// 注意线条样式会被之前上面的设置影响,所以要用save保存画之前的初始状态，画完后restore初始状态
	ctx.restore();
}

// 画分针
function drawMinute(minute) {
	ctx.save();
	ctx.beginPath();
	// 注意线条样式会被之前上面的设置影响
	ctx.lineWidth = 3 * rem;
	ctx.strokeStyle = "#000";
	ctx.lineCap = "round";
	// 设置旋转弧度
	var rad = 2 * Math.PI / 60 * minute;
	ctx.rotate(rad);
	// 开始画
	ctx.moveTo(0, 10 * rem);
	ctx.lineTo(0, - r + 30 * rem);
	ctx.stroke();
	ctx.restore();
}

// 画秒针
function drawSecond(second) {
	ctx.save();
	ctx.beginPath();
	// 注意线条样式会被之前上面的设置影响
	ctx.fillStyle = "#c14543";
	var rad = 2 * Math.PI / 60 * second;
	ctx.rotate(rad);
	// 开始画
	ctx.moveTo(-2 * rem, 20 * rem);
	ctx.lineTo(2 * rem, 20 * rem);
	// 这里x就不乘以比例rem是为了让它更细
	ctx.lineTo(1, -r + 18 * rem);
	ctx.lineTo(-1, -r + 18 * rem);
	ctx.fill();
	ctx.restore();
}

// 画秒针
function drawDot() {
	ctx.beginPath();
	// 注意线条样式会被之前上面的设置影响
	ctx.fillStyle = "#fff";
	ctx.arc(0, 0, 3 * rem, 0, 2*Math.PI, false);
	ctx.fill();
}

function draw() {
	// 每秒执行一次画的过程的时候，需要把之前画的背景清除，这时画背景等函数还未执行，或者后面restore，使原点还是canvas的左上角，清除的是整个canvas画布上的效果
	ctx.clearRect(0, 0, width, height);

	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	drawBackground();
	drawHour(hour, minute);
	drawMinute(minute);
	drawSecond(second);
	drawDot();
	// 与drawBackground的save相对应，还原到画之前的环境，因为画背景的时候移中心点等操作需要
	ctx.restore();
}

// 先执行一次不会有1秒的延迟
draw()
// 每秒执行一次画的过程
setInterval(draw, 1000);
})()