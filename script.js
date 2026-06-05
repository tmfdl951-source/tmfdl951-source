/* ── 페이지 전환 ── */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (!target) return;
  target.classList.add('active');
  document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
  if (pageId === 'home') { resetHeroAnim(); runHeroAnim(); }
  if (pageId === 'services') popProdCards();
  if (pageId === 'reference') refRunAnim('refBlockRestaurant');
  document.getElementById('navMenu').classList.remove('open');
  window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-page]');
  if (!el) return;
  e.preventDefault();
  showPage(el.dataset.page);
});

/* ── 히어로 와이프 애니메이션 ── */
const heroTimings = [
  { sel: '.tl-label',  delay: 100  },
  { sel: '.tl-main',   delay: 550  },
  { sel: '.tl-accent', delay: 1050 },
  { sel: '.tl-sub',    delay: 1750 },
  { sel: '.tl-stats',  delay: 2300 },
  { sel: '.tl-btns',   delay: 2750 },
];

function resetHeroAnim() {
  heroTimings.forEach(({ sel }) => {
    const el = document.querySelector(sel);
    if (el) el.classList.remove('go');
  });
}

function runHeroAnim() {
  heroTimings.forEach(({ sel, delay }) => {
    setTimeout(() => {
      const el = document.querySelector(sel);
      if (el) el.classList.add('go');
    }, delay);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  const prevPage = sessionStorage.getItem('prevPage');

  if (hash && document.getElementById('page-' + hash)) {
    /* 해시 진입 (예: index.html#services, index.html#reference) */
    showPage(hash);
    history.replaceState(null, '', window.location.pathname);
    sessionStorage.removeItem('prevPage');
  } else if (prevPage && document.getElementById('page-' + prevPage)) {
    /* 상세페이지에서 뒤로가기로 진입 → 이전 섹션 복원 */
    showPage(prevPage);
    sessionStorage.removeItem('prevPage');
  } else {
    /* 직접 접속 / 새로고침 → 홈 히어로 */
    setTimeout(runHeroAnim, 150);
  }
});

/* ── 상품소개 카드 팝 애니메이션 ── */
function popProdCards() {
  const cards = document.querySelectorAll('#page-services .pcard');
  cards.forEach(c => c.classList.remove('popped', 'settled'));
  cards.forEach((c, i) => {
    setTimeout(() => {
      c.classList.add('popped');
      c.addEventListener('animationend', () => {
        c.classList.remove('popped');
        c.classList.add('settled');
      }, { once: true });
    }, i * 180);
  });
}

/* ── 헤더 스크롤 ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

/* ── 햄버거 ── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});

/* ── FAQ 아코디언 ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.faq-q');
  if (!btn) return;
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
});

/* ── 레퍼런스 탭 ── */
const REF_DELAY = 150;

function refRunAnim(listId) {
  const blocks = document.querySelectorAll('#' + listId + ' .ref-block');
  blocks.forEach(b => b.classList.remove('show'));
  blocks.forEach((b, i) => setTimeout(() => b.classList.add('show'), i * REF_DELAY));
}

document.addEventListener('click', e => {
  const tab = e.target.closest('.ref-tab');
  if (!tab) return;
  document.querySelectorAll('.ref-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ref-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  const key = tab.dataset.ref;
  document.getElementById('ref-' + key).classList.add('active');
  const listMap = { restaurant: 'refBlockRestaurant', medical: 'refBlockMedical', general: 'refBlockGeneral' };
  if (listMap[key]) refRunAnim(listMap[key]);
});

/* ── 레퍼런스 블록 확대 ── */
document.addEventListener('click', e => {
  const block = e.target.closest('#page-reference .ref-block');
  if (block) {
    const isExpanded = block.classList.contains('expanded');
    document.querySelectorAll('#page-reference .ref-block').forEach(b => b.classList.remove('expanded'));
    if (!isExpanded) block.classList.add('expanded');
  } else if (!e.target.closest('[data-page]') && !e.target.closest('.ref-tab')) {
    document.querySelectorAll('#page-reference .ref-block').forEach(b => b.classList.remove('expanded'));
  }
});

/* ── 모바일: 카드 탭 시 오버레이 토글 ── */
document.addEventListener('click', e => {
  if (window.innerWidth > 768) return; // PC는 CSS hover로 처리

  /* 상세페이지 버튼 탭 → 링크 이동만, 오버레이 토글 없음 */
  if (e.target.closest('.btn-pf-detail')) return;

  const card = e.target.closest('#page-services .pcard');

  /* 카드 밖 탭 → 모든 오버레이 닫기 */
  if (!card) {
    document.querySelectorAll('#page-services .pcard.mobile-active')
      .forEach(c => c.classList.remove('mobile-active'));
    return;
  }

  const isActive = card.classList.contains('mobile-active');
  document.querySelectorAll('#page-services .pcard.mobile-active')
    .forEach(c => c.classList.remove('mobile-active'));
  if (!isActive) card.classList.add('mobile-active');
});

/* ── 문의 폼 ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '전송 중...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ 전송 완료! 곧 연락드리겠습니다.';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; e.target.reset(); }, 3000);
  }, 1000);
});
