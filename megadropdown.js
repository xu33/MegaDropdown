/**
 * Created by Administrator on 2016/10/9.
 */
$(document)
.ready(function() {
	var sub = $('#sub')
	var activeRow
	var activeMenu
	var timer = null
	var mouseX = mouseY = 0
	var mouseTrack = []

	var moveHandler = function(e) {
		mouseX = e.pageX
		mouseY = e.pageY

		mouseTrack.push({
			x: mouseX,
			y: mouseY
		})

		if (mouseTrack.length > 3) {
			mouseTrack.shift()
		}
	}

	$('#test')
	.on('mouseenter', function(e) {
		sub.removeClass('none')

		$(document).bind('mousemove', moveHandler)
	})

	.on('mouseleave', function(e) {
		sub.addClass('none')

		if (activeRow) {
			activeRow.removeClass('active')
			activeRow = null
		}

		if (activeMenu) {
			activeMenu.addClass('none')
			activeMenu = null
		}

		$(document).unbind('mousemove', moveHandler)
	})

	.delegate('li', 'mouseenter', function(e) {
		if (!activeRow) {
			activeRow = $(e.target).addClass('active')
			activeMenu = $('#' + activeRow.data('id'))
			activeMenu.removeClass('none')
			return
		}

		if (timer) {
			clearTimeout(timer)
		}

		var leftCorner = mouseTrack[mouseTrack.length - 2]
		var currMousePos = mouseTrack[mouseTrack.length - 1]

		if (!leftCorner) {
			leftCorner = currMousePos
		}

		var delay = (currMousePos.x > leftCorner.x) && needDelay(sub, leftCorner, currMousePos, 10)

		if (delay) {
			console.log('delay fire')
			timer = setTimeout(function() {
				var currentMouseOverTarget = document.elementFromPoint(mouseX, mouseY)

				// console.log(currentMouseOverTarget, activeMenu[0])

				if (currentMouseOverTarget == activeMenu[0] || activeMenu[0].contains(currentMouseOverTarget)) {
					return
				}

				activeRow.removeClass('active')
				activeMenu.addClass('none')

				activeRow = $(e.target)
				activeRow.addClass('active')
				activeMenu = $('#' + activeRow.data('id'))
				activeMenu.removeClass('none')

				timer = null
			}, 300)
		} else {
			var prevActiveRow = activeRow
			var prevActiveMenu = activeMenu
			
			activeRow = $(e.target)
			activeMenu = $('#' + activeRow.data('id'))

			prevActiveRow.removeClass('active')
			prevActiveMenu.addClass('none')

			activeRow.addClass('active')
			activeMenu.removeClass('none')
		}
	})
})