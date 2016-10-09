// 判断符号相同
function sameSign(x, y) {
	return (x >= 0) ^ (y < 0)
}

// 向量叉乘
function vectorProduct(x1, y1, x2, y2) {
	return x1 * y2 - x2 * y1
}

// 用叉乘法判断点在三角内
function isPointInTrangle(p, a, b, c) {
	var pa = {
		x: a.x - p.x,
		y: a.y - p.y
	}

	var pb = {
		x: b.x - p.x,
		y: b.y - p.y
	}

	var pc = {
		x: c.x - p.x,
		y: c.y - p.y
	}

	var t1 = vectorProduct(pa.x, pa.y, pb.x, pb.y)
	var t2 = vectorProduct(pb.x, pb.y, pc.x, pc.y)
	var t3 = vectorProduct(pc.x, pc.y, pa.x, pa.y)

	return sameSign(t1, t2) && sameSign(t2, t3)
}

// 判断是否需要延迟
function needDelay(menuDom, leftCorner, currMousePos, plus) {
	var offset = menuDom.offset()
	var plus = plus === undefined ? 0 : plus

	var topLeft = {
		x: offset.left,
		y: offset.top - plus
	}

	var bottomLeft = {
		x: offset.left,
		y: offset.top + menuDom.height() + plus
	}

	//console.log(leftCorner, topLeft, bottomLeft)

	return isPointInTrangle(currMousePos, leftCorner, topLeft, bottomLeft)
}