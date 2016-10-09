/**
 * Created by Administrator on 2016/10/9.
 */
$(document).ready(function() {
	var sub = $('#sub')
	var activeRow

	function toggleRelMenu(row) {
		var subId = row.data('id')
		var subMenu = $('#' + subId)

		subMenu.toggleClass('none')
	}

	$('#test').on('mouseenter', function(e) {
		sub.removeClass('none')
	}).on('mouseleave', function(e) {
		sub.addClass('none')

		if (activeRow) {
			activeRow.removeClass('active')
			activeRow = null
		}

	}).on('mouseover', 'li', function(e) {
		if (!activeRow) {
			activeRow = $(e.target).addClass('active')
			return
		}

		activeRow.removeClass('active')
		toggleRelMenu(activeRow)

		activeRow = $(e.target)
		activeRow.addClass('active')

		toggleRelMenu(activeRow)
	})
})