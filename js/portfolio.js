/**
 * Portfolio Gallery Engine
 * Fingka Amara Diva Portfolio
 * Dynamic project grid with filter, lightbox & lazy loading
 */

(function() {
  'use strict';

  // ─── Render project grid ──────────────────────────────────────────────────
  function encodeImgPath(path) {
    // URL-encode only the path segments, keep slashes
    return path.split('/').map(function(seg) {
      return encodeURIComponent(seg);
    }).join('/');
  }

  function renderGrid(filter) {
    var container = document.getElementById('portfolio-grid');
    if (!container) return;

    var filtered = filter === 'all'
      ? projectsData
      : projectsData.filter(function(p) { return p.filter === filter; });

    var isHomepage = window.location.pathname.endsWith('index.html') || window.location.pathname.match(/\/$/);
    var maxItems = isHomepage ? 6 : filtered.length;
    var toRender = filtered.slice(0, maxItems);

    if (toRender.length === 0) {
      container.innerHTML = '<div class="col-md-12" style="text-align:center;padding:40px 0;color:#999;">Tidak ada proyek dalam kategori ini.</div>';
      return;
    }

    var html = '';
    toRender.forEach(function(proj) {
      var thumbSrc = encodeImgPath(proj.thumbnail);
      html += [
        '<div class="col-md-4 col-sm-6 portfolio-tile">',
        '  <div class="project portfolio-card" style="background-image: url(\'' + thumbSrc + '\'); cursor:pointer;" data-project-id="' + proj.id + '">',
        '    <div class="desc">',
        '      <div class="con">',
        '        <h3 style="color:#ffffff;">' + escapeHtml(proj.title) + '</h3>',
        '        <span style="color:#FFC300;">' + escapeHtml(proj.category) + '</span>',
        '        <p class="icon">',
        '          <span><i class="icon-eye"></i> ' + proj.images.length + ' foto</span>',
        '          <span class="open-lightbox-btn" style="color:#FFC300;font-size:13px;cursor:pointer;">',
        '            <i class="icon-folder-open"></i> Lihat Semua',
        '          </span>',
        '        </p>',
        '      </div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    });

    container.innerHTML = html;

    // Re-attach click events
    var cards = container.querySelectorAll('.portfolio-card');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var pid = this.getAttribute('data-project-id');
        window.location.href = 'project-detail.html?id=' + pid;
      });
    });

    var moreBtn = document.getElementById('portfolio-more-btn');
    if (moreBtn) {
      if (isHomepage && filtered.length > 6) {
        moreBtn.style.display = 'block';
      } else {
        moreBtn.style.display = 'none';
      }
    }
  }

  // ─── Utility ─────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Filter buttons ───────────────────────────────────────────────────────
  function initFilters() {
    var btns = document.querySelectorAll('.filter-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        btns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        renderGrid(filter);
      });
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    renderGrid('all');
    initFilters();
  });

})();
