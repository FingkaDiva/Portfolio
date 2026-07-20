/**
 * Gambar Kerja Detail Page Engine
 * Fingka Amara Diva Portfolio
 * Loads and displays AutoCAD sheet images for Arsitek, Struktur, or MEP with lazy loading and zoom features.
 */

(function() {
  'use strict';

  // ─── Data: Gambar Kerja ────────────────────────────────────────────────────
  var gambarKerjaData = {
    arsitek: {
      title: "Gambar Kerja Arsitektur",
      category: "AutoCAD 2D / Arsitektural",
      dir: "projek/Gambar Kerja/Arsitek",
      images: [
        "Arsitek_page-0001.jpg",
        "Arsitek_page-0004.jpg",
        "Arsitek_page-0005.jpg",
        "Arsitek_page-0006.jpg",
        "Arsitek_page-0007.jpg",
        "Arsitek_page-0008.jpg",
        "Arsitek_page-0009.jpg",
        "Arsitek_page-0010.jpg"
      ]
    },
    struktur: {
      title: "Gambar Kerja Struktur",
      category: "AutoCAD 2D / Struktur Bangunan",
      dir: "projek/Gambar Kerja/Struktur",
      images: [
        "Struktur_page-0001.jpg",
        "Struktur_page-0002.jpg",
        "Struktur_page-0003.jpg",
        "Struktur_page-0004.jpg",
        "Struktur_page-0005.jpg",
        "Struktur_page-0007.jpg"
      ]
    },
    mep: {
      title: "Gambar Kerja MEP",
      category: "AutoCAD 2D / MEP & Utilitas",
      dir: "projek/Gambar Kerja/MEP",
      images: [
        "MEP_page-0001.jpg",
        "MEP_page-0002.jpg",
        "MEP_page-0003.jpg",
        "MEP_page-0004.jpg",
        "MEP_page-0005.jpg",
        "MEP_page-0006.jpg",
        "MEP_page-0007.jpg",
        "MEP_page-0008.jpg",
        "MEP_page-0010.jpg",
        "MEP_page-0011.jpg",
        "MEP_page-0012.jpg"
      ]
    }
  };

  // ─── Encoding path helper ──────────────────────────────────────────────────
  function encodeImgPath(path) {
    return path.split('/').map(function(seg) {
      return encodeURIComponent(seg);
    }).join('/');
  }

  // ─── Escape HTML ───────────────────────────────────────────────────────────
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Responsive/Natural Image Titles ───────────────────────────────────────
  function formatImageTitle(filename) {
    var name = filename.substring(0, filename.lastIndexOf('.')) || filename;
    name = name.replace(/[_-]/g, ' ');
    name = name.replace(/page\s*0*(\d+)/i, 'Lembar $1');
    return name;
  }

  // ─── Query Param Parser ─────────────────────────────────────────────────────
  function getQueryParam(param) {
    var search = window.location.search.substring(1);
    var vars = search.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === param) {
        return decodeURIComponent(pair[1]);
      }
    }
    return null;
  }

  var categoryKey = getQueryParam('category');
  var catData = null;

  if (categoryKey && gambarKerjaData.hasOwnProperty(categoryKey)) {
    catData = gambarKerjaData[categoryKey];
  }

  document.addEventListener('DOMContentLoaded', function() {
    var gridContainer = document.getElementById('drawing-detail-grid');
    if (!gridContainer) return;

    if (!catData) {
      gridContainer.innerHTML = '<div class="col-md-12"><h3 style="color:#d9534f;">Kategori tidak ditemukan.</h3><p><a href="drawings.html">Kembali ke Drawings</a></p></div>';
      var headingEl = document.getElementById('drawing-category-heading');
      if (headingEl) headingEl.textContent = 'Kategori Tidak Ditemukan';
      return;
    }

    // Set Headings
    var titleEl = document.getElementById('drawing-category-heading');
    if (titleEl) titleEl.textContent = catData.title;

    var metaEl = document.getElementById('drawing-category-meta');
    if (metaEl) metaEl.textContent = catData.category;

    var baseDir = catData.dir;
    var images = catData.images;
    var imgHtml = '';

    images.forEach(function(imgName, idx) {
      var imgSrc = baseDir + '/' + imgName;
      var encoded = encodeImgPath(imgSrc);
      var title = formatImageTitle(imgName);

      imgHtml += [
        '<div class="col-md-4 col-sm-6 animate-box item-animate fadeIn animated">',
        '  <div class="project zoom-trigger" data-src="' + encoded + '" style="cursor:pointer; height:250px; background-color:#1a1a1a; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.12); position:relative; margin-bottom:30px; border: 1px solid #2e2e2e; display: flex; align-items: center; justify-content: center; padding: 15px;">',
        '    <img loading="lazy" class="lazy-img" data-src="' + encoded + '" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'250\'/%3E"',
        '      alt="' + escapeHtml(catData.title) + ' - ' + escapeHtml(title) + '"',
        '      style="max-width:100%; max-height:100%; object-fit:contain; transition:opacity 0.3s, transform 0.4s; opacity:0; z-index:0; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 1px solid #333;" />',
        '    <div class="desc" style="z-index: 1; transition: opacity 0.3s;">',
        '      <div class="con" style="height: 100%; display: flex; flex-direction: column; justify-content: center;">',
        '        <h3 style="color:#ffffff; font-size:16px;">' + escapeHtml(title) + '</h3>',
        '        <span style="color:#FFC300;">' + escapeHtml(catData.category) + '</span>',
        '        <p class="icon" style="margin-top: 15px;">',
        '          <span style="color:#FFC300; font-size: 13px;"><i class="icon-eye"></i> Klik untuk memperbesar</span>',
        '        </p>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    });

    gridContainer.innerHTML = imgHtml;

    // Trigger intersection observers
    initLazyLoading();
    initZoomTriggers();
  });

  // ─── Lazy Loading ──────────────────────────────────────────────────────────
  function initLazyLoading() {
    var lazyImgs = document.querySelectorAll('img.lazy-img');

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
          img.removeAttribute('data-src');
        }
      });
    }
  }

  // ─── Image Zoom Lightbox ───────────────────────────────────────────────────
  function initZoomTriggers() {
    var triggers = document.querySelectorAll('.zoom-trigger');
    triggers.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        var src = this.getAttribute('data-src');
        if (src) {
          openZoom(src);
        }
      });

      // Subtle scale effect on hover
      var img = trigger.querySelector('.lazy-img');
      if (img) {
        trigger.addEventListener('mouseenter', function() {
          img.style.transform = 'scale(1.05)';
        });
        trigger.addEventListener('mouseleave', function() {
          img.style.transform = 'scale(1)';
        });
      }
    });
  }

  function openZoom(src) {
    var ov = document.getElementById('image-zoom-overlay');
    var img = document.getElementById('zoom-img');
    if (ov && img) {
      img.src = src;
      ov.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    }
  }

  function closeZoom() {
    var ov = document.getElementById('image-zoom-overlay');
    var img = document.getElementById('zoom-img');
    if (ov && img) {
      ov.classList.remove('active');
      img.src = '';
      document.body.style.overflow = ''; 
    }
  }

  // Listeners for zoom overlay click & keydown
  document.addEventListener('DOMContentLoaded', function() {
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

})();
