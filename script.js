function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


function isInViewport(el) {
	if (el instanceof jQuery) {
		el = el.get(0);
	}
    var bounding = el.getBoundingClientRect();
    return (
        (bounding.top >= 0 && bounding.top <= window.innerHeight) ||
        (bounding.bottom >= 0 && bounding.bottom <= window.innerHeight) ||
        (bounding.top < 0 && bounding.bottom > window.innerHeight)
    );
};
function throttle(func, wait, options) {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = {};
	var later = function() {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		var now = Date.now();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		previous = now;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};
$(function () {

    var winScrollTop = $(window).scrollTop();
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    // Define scene classes.
    var sceneClass = 'scene';
    var sceneActiveClass = sceneClass + '--active';
    var sceneEndedClass = sceneClass + '--ended';

    $(window).on('resize', function () {
        winHeight = window.innerHeight;
        winWidth = window.innerWidth;
    });

    function setScene($el) {

        var bounding = $el.data('elDom').getBoundingClientRect();

        if (bounding.top > winHeight) {
 $el.find('.scene').removeClass(sceneActiveClass);
            $el.find('.scene').removeClass(sceneEndedClass);

        } else if (bounding.bottom < 0) {

           
            $el.find('.scene').addClass(sceneEndedClass);
            $el.find('.scene').removeClass(sceneActiveClass);

        } else {

     
            if (bounding.top <= 0) {
                $el.find('.scene').addClass(sceneActiveClass);
            }

            if (bounding.top > 0) {
                $el.find('.scene').removeClass(sceneActiveClass);
            }

    
            if (bounding.bottom <= (winHeight)) {
                $el.find('.scene').addClass(sceneEndedClass);
            }

    
            if (bounding.bottom > (winHeight)) {
                $el.find('.scene').removeClass(sceneEndedClass);
            }
        }
    }

 
    function setUpHorizontalScroll($el) {

        var sectionClass = $el.attr('class');

    
        var $contentWrapper = $el.find('.' + sectionClass + '__content-wrapper');
        var contentWrapperDom = $contentWrapper.get(0);
        $el.data('contentWrapper', $contentWrapper);
        $el.data('contentWrapperDom', contentWrapperDom);

        var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);

        var rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        var rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

        $el.data('initalized', false);

        $el.css('height', $el.data('contentWrapperScrollWidth'));

        $el.data('outerHeight', $el.outerHeight());

        $el.data('offsetTop', $el.offset().top);

        $el.data('initalized', true);

        $el.data('transformX', '0');

        $el.addClass($el.attr('class') + '--init');
    }

    function resetHorizontalScroll($el) {
   
    
      var contentWrapperScrollWidth = $el.data('contentWrapperDom').scrollWidth;
        $el.data('contentWrapperScrollWidth', contentWrapperScrollWidth);

        rightMax = $el.data('contentWrapperScrollWidth') - winWidth;
        rightMaxMinus = -(rightMax);
        $el.data('rightMax', Number(rightMaxMinus));

   
        $el.css('height', $el.data('contentWrapperScrollWidth'));

  
        $el.data('outerHeight', $el.outerHeight());

     
        $el.data('offsetTop', $el.offset().top);

       
        if ($el.data('transformX') <= $el.data('rightMax')) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('rightMax') + 'px, 0, 0)',
            });
        }
    }

    var $horizontalScrollSections = $('.horizontal-scroll-section');
    var $horizontalScrollSectionsTriggers = $horizontalScrollSections.find('.trigger');

    $horizontalScrollSections.each(function (i, el) {
      
        var $thisSection = $(this);

        $(this).data('elDom', $(this).get(0));

   
        setUpHorizontalScroll($(this));

    
        setScene($(this));

        $(window).on('resize', function () {
           
            resetHorizontalScroll($thisSection);
            setScene($thisSection);
        });

    });

    function setupHorizontalTriggers($el, section) {
        var parent = $el.parent();
        var positionLeft = parent.position().left;
        var positionLeftMinus = -(positionLeft);
        var triggerOffset = $el.data('triggerOffset');
        triggerOffset = !triggerOffset ? 0.5 : triggerOffset = triggerOffset;
        $el.data('triggerOffset', triggerOffset);
        $el.data('triggerPositionLeft', positionLeftMinus);
        $el.data('triggerSection', section);
    }

    function useHorizontalTriggers($el) {
        if ($el.data('triggerSection').data('transformX') <= ($el.data('triggerPositionLeft') * $el.data('triggerOffset'))) {
            $el.data('triggerSection').addClass($el.data('class'));
        } else {
            if ($el.data('remove-class') !== false) {
                $el.data('triggerSection').removeClass($el.data('class'));
            }
        }
    }

    $horizontalScrollSectionsTriggers.each(function (i, el) {
        setupHorizontalTriggers($(this), $(this).closest('.horizontal-scroll-section'));
    });

    function transformBasedOnScrollHorizontalScroll($el) {

        var amountScrolledContainer = winScrollTop - $el.data('offsetTop');
        var amountScrolledThrough = (amountScrolledContainer / ($el.data('outerHeight') - (winHeight - winWidth)));

    
        var toTransform = (amountScrolledThrough * $el.data('contentWrapperScrollWidth'));

  
        var toTransformMinus = -(toTransform);

   
        toTransformMinus = Math.min(0, toTransformMinus);

        toTransformMinus = Math.max(toTransformMinus, $el.data('rightMax'));

     
        $el.data('transformX', Number(toTransformMinus));

     
        if ($el.data('initalized') == true) {
            $el.data('contentWrapper').css({
                'transform': 'translate3d(' + $el.data('transformX') + 'px, 0, 0)'
            });
        }
    }

    $(window).on('scroll', function(){
             winScrollTop = $(window).scrollTop();

    
        $horizontalScrollSections.each(function (i, el) {
            transformBasedOnScrollHorizontalScroll($(this));
            setScene($(this));
        });

        $horizontalScrollSectionsTriggers.each(function (i, el) {
            useHorizontalTriggers($(this));
        });
                 
    });

});