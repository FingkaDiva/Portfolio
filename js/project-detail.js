/**
 * Project Detail Engine
 * Fingka Amara Diva Portfolio
 */

(function() {
  'use strict';

  function encodeImgPath(path) {
    return path.split('/').map(function(seg) {
      return encodeURIComponent(seg);
    }).join('/');
  }

  function getQueryParam(param) {
    var search = window.location.search.substring(1);
    var vars = search.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == param) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  var pid = getQueryParam('id');
  var proj = null;
  
  if (pid && typeof projectsData !== 'undefined') {
    proj = projectsData.find(function(p) { return p.id === pid; });
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!proj) {
      document.getElementById('project-detail-grid').innerHTML = '<div class="col-md-12"><h3 style="color:#d9534f;">Proyek tidak ditemukan.</h3><p><a href="work.html">Kembali ke Portofolio</a></p></div>';
      var titleEls = document.querySelectorAll('.colorlib-heading');
      if (titleEls.length > 0) titleEls[0].textContent = 'Proyek Tidak Ditemukan';
      return;
    }

    // Update headings
    var mainHeading = document.querySelector('.colorlib-heading');
    if (mainHeading) mainHeading.textContent = proj.title;
    
    var subHeading = document.querySelector('.heading-meta');
    if (subHeading) subHeading.textContent = proj.category;

    var gridBtn = document.getElementById('project-detail-grid');

    var imgHtml = '';
    proj.images.forEach(function(imgSrc, idx) {
      var encoded = encodeImgPath(imgSrc);
      imgHtml += [
        '<div class="col-md-4 col-sm-6 animate-box item-animate fadeIn animated">',
        '  <div class="project" style="height:250px; overflow:hidden; border-radius:4px; margin-bottom:30px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">',
        '    <img loading="lazy" data-src="' + encoded + '" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'250\'/%3E"',
        '      alt="' + escapeHtml(proj.title) + ' foto ' + (idx + 1) + '"',
        '      style="width:100%;height:100%;object-fit:cover;transition:opacity 0.3s, transform 0.4s;opacity:0;cursor:zoom-in;"',
        '      class="lazy-img zoom-trigger" />',
        '  </div>',
        '</div>'
      ].join('\n');
    });

    gridBtn.innerHTML = imgHtml;

    requestAnimationFrame(function() {
      initLazyImages(gridBtn);
    });

    var imgs = gridBtn.querySelectorAll('.zoom-trigger');
    imgs.forEach(function(img) {
      img.addEventListener('click', function() {
        var src = this.getAttribute('data-src') || this.src;
        openZoom(src);
      });
      img.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
      });
      img.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
      });
    });
  });

  function openZoom(src) {
    var ov = document.getElementById('image-zoom-overlay');
    var img = document.getElementById('zoom-img');
    img.src = src;
    ov.classList.add('active');
  }

  function closeZoom() {
    var ov = document.getElementById('image-zoom-overlay');
    ov.classList.remove('active');
    document.getElementById('zoom-img').src = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Zoom overlay events
    var zoomOv = document.getElementById('image-zoom-overlay');
    if (zoomOv) {
      zoomOv.addEventListener('click', function(e) {
        if (e.target === zoomOv || e.target.classList.contains('image-zoom-close')) {
          closeZoom();
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeZoom();
      }
    });
  });

  function initLazyImages(container) {
    var lazyImgs = container.querySelectorAll('img.lazy-img');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            var src = img.getAttribute('data-src');
            if (src) {
              img.onload = function() {
                img.style.opacity = '1';
              };
              img.src = src;
              img.removeAttribute('data-src');
            }
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '100px', threshold: 0.01 });

      lazyImgs.forEach(function(img) {
        observer.observe(img);
      });
    } else {
      lazyImgs.forEach(function(img) {
        var src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.style.opacity = '1';
        }
      });
    }
  }

})();
