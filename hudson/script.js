(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

hljs.initHighlightingOnLoad();

var HC_SETTINGS = {
  css: {
    activeClass: 'is-active',
    hiddenClass: 'is-hidden'
  }
};

$(function () {
  var $window = $(window);
  var $body = $('body');
  var $topbar = $('[data-topbar]');
  var $scrollToTop = $('[data-scroll-to-top]');
  var $mainMenu = $('[data-menu]');
  var $mobileSandwich = $('[data-toggle-menu]');
  var $overlay = $('<div class="body-overlay"></div>');

  //Parallax for hero elements
  var heroElement = $('.hero__element');
  var evenEl = heroElement.filter(':even');
  var oddEl = heroElement.filter(':odd');
  var VELOCITY = 5;
  var wScrollTop;

  $body.append($overlay[0]);

  $scrollToTop.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1000);
    return false;
  });

  $mobileSandwich.click(function () {
    $(this).add($mainMenu).add($topbar).toggleClass(HC_SETTINGS.css.activeClass);

    $mainMenu.slideToggle(300);
    $body.toggleClass('menu-opened');
  });

  $overlay.on('click', mobileMenuClose);

  $window.on('resize', function () {
    if ($window.width() > 991) {
      mobileMenuClose(null, true);
    }
  });

  function mobileMenuClose(e, desktop) {
    if ($mobileSandwich.hasClass(HC_SETTINGS.css.activeClass)) {
      $mobileSandwich.add($mainMenu).add($topbar).removeClass(HC_SETTINGS.css.activeClass);

      $mainMenu.slideUp(desktop ? 0 : 300);
      $body.removeClass('menu-opened');
    }
  }

  // Social share popups
  $('.share a').click(function (e) {
    e.preventDefault();
    window.open(this.href, '', 'height = 500, width = 500');
  });

  // Toggle the share dropdown in communities
  $('.share-label').on('click', function (e) {
    e.stopPropagation();
    var isSelected = this.getAttribute('aria-selected') == 'true';
    this.setAttribute('aria-selected', !isSelected);
    $('.share-label').not(this).attr('aria-selected', 'false');
  });

  $(document).on('click', function () {
    $('.share-label').attr('aria-selected', 'false');
  });

  $('.dropdown-toggle').on('click', function (e) {
    e.preventDefault();
  });

  // Submit search on select change
  $('#request-status-select, #request-organization-select').on('change', function () {
    search();
  });

  // Submit search on input enter
  $('#quick-search').on('keypress', function (e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $('#quick-search').val(),
      status: $('#request-status-select').val(),
      organization_id: $('#request-organization-select').val()
    });
  }

  $('.image-with-lightbox').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $('.image-with-video-icon').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $('.accordion__item-title').on('click', function () {
    var $title = $(this);
    $title.toggleClass('accordion__item-title--active');
    $title.parents('.accordion__item').find('.accordion__item-content').slideToggle();
  });

  $('.tabs-link').click(function (e) {
    e.preventDefault();
    var $link = $(this);
    var tabIndex = $link.index();
    var $tab = $link.parents('.tabs').find('.tab').eq(tabIndex);
    $link.addClass(HC_SETTINGS.css.activeClass).siblings().removeClass(HC_SETTINGS.css.activeClass);
    $tab.removeClass(HC_SETTINGS.css.hiddenClass).siblings('.tab').addClass(HC_SETTINGS.css.hiddenClass);
  });

  // Fix animated icons
  $('.fa-spin').empty();

  //Video iframe resizer
  function videoIframe() {
    var $allVideos = $('iframe'),
        $fluidEl = $allVideos.parent();

    if ($allVideos.length) {
      $allVideos.each(function () {
        $(this).data('aspectRatio', this.height / this.width).removeAttr('height').removeAttr('width');
      });

      $(window).on('resize', function () {
        var newWidth = $fluidEl.width();

        $allVideos.each(function () {
          var $el = $(this);
          $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
        });
      });

      $(window).trigger('resize');
    }
  }

  videoIframe();

  $window.on('scroll', function () {
    wScrollTop = $window.scrollTop();

    wScrollTop > 400 ? $scrollToTop.addClass(HC_SETTINGS.css.activeClass) : $scrollToTop.removeClass(HC_SETTINGS.css.activeClass);

    if (heroElement.length && $window.width() > 1024) {
      evenEl.css('transform', 'translateY(' + wScrollTop / VELOCITY + 'px)');
      oddEl.css('transform', 'translateY(' + wScrollTop / (VELOCITY * -2) + 'px)');
    }
  });

  //Add asset part to required images
  var assetPart = $('[property]').attr('content'),
      assetElement = $('[data-asset]');

  if (assetPart) {
    assetPart = assetPart.slice(0, -5);
    assetElement.each(function () {
      var $this = $(this),
          link = $this.data('asset');

      $this.attr('src', assetPart + link).css('opacity', 1);
    });
  }

  // Underline
  $('[data-underline]').each(function () {
    var $text = $(this),
        word = $text.data('underline'),
        html = $text.html();

    $text.html(html.replace(new RegExp(word, 'g'), '<span class="underline">' + word + '</span>'));
  });

  $('img.custom-block__image').each(function () {
    var $img = $(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src') + '?reset';

    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = $(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
  });

  // Category tree
  $('[data-tree]').each(function (i, element) {
    var $item = $(element),
        $link = $item.find('[data-tree-link]'),
        $box = $item.find('[data-tree-box]');

    $link.on('click', function (e) {
      e.preventDefault();
      $link.add($item).add($box).toggleClass(HC_SETTINGS.css.activeClass);
      $box.slideToggle(300);
    });
  });
});

},{}]},{},[1]);
