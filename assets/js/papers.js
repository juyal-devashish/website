// ========================================
// Reading Notes — Paper Data & Rendering
//
// To add a new paper, append an object to the `papers` array below.
// Fields: date, title, authors, excerpt, tags (array), pinned (bool), link
// ========================================

const papers = [
    {
        date: 'Jan 15, 2026',
        title: 'Attention Is All You Need',
        authors: 'Vaswani et al., NeurIPS 2017',
        excerpt: 'The transformer architecture dispenses with recurrence and convolutions entirely, relying solely on attention mechanisms — a deceptively simple idea that reshaped the entire field.',
        tags: ['llm', 'nlp'],
        pinned: true,
        link: 'https://arxiv.org/abs/1706.03762'
    },
    {
        date: 'Jan 22, 2026',
        title: 'A Watermark for Large Language Models',
        authors: 'Kirchenbauer et al., ICML 2023',
        excerpt: 'Embeds a statistical signal into LLM outputs by partitioning the vocabulary into "green" and "red" lists at each token step — elegant in its simplicity, and surprisingly robust to paraphrasing attacks.',
        tags: ['llm', 'security'],
        pinned: true,
        link: 'https://arxiv.org/abs/2301.10226'
    },
    {
        date: 'Feb 3, 2026',
        title: 'Distilling Step-by-Step!',
        authors: 'Hsieh et al., ACL Findings 2023',
        excerpt: 'Uses chain-of-thought rationales from large models as a supervision signal for smaller ones — a clever way to transfer reasoning capabilities, not just final answers.',
        tags: ['llm', 'distillation'],
        pinned: false,
        link: 'https://arxiv.org/abs/2305.02301'
    },
    {
        date: 'Feb 10, 2026',
        title: 'Invariant Risk Minimization',
        authors: 'Arjovsky et al., 2019',
        excerpt: 'Proposes learning data representations where the optimal classifier is invariant across training environments — a principled approach to OOD generalization that fundamentally challenged ERM assumptions.',
        tags: ['ml', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/1907.02893'
    },
    {
        date: 'Feb 14, 2026',
        title: 'Sequential Change-Point Detection via Online Convex Optimization',
        authors: 'Hazan et al., 2023',
        excerpt: 'Frames change-point detection as an online learning problem, achieving near-optimal detection delay with clean regret-style guarantees — a refreshing new lens on a classical statistics problem.',
        tags: ['statistics', 'theory'],
        pinned: false,
        link: '#'
    },
    {
        date: 'Feb 17, 2026',
        title: 'Language Models are Few-Shot Learners',
        authors: 'Brown et al., NeurIPS 2020',
        excerpt: 'GPT-3 demonstrates that scale alone unlocks emergent few-shot behavior — raising more questions about what "learning" really means than it actually answers.',
        tags: ['llm', 'survey'],
        pinned: false,
        link: 'https://arxiv.org/abs/2005.14165'
    }
];

// ========================================
// Tag metadata — label shown to users and CSS class applied
// ========================================
const TAG_META = {
    llm:          { label: 'LLMs',          css: 'tag-llm' },
    nlp:          { label: 'NLP',           css: 'tag-nlp' },
    ml:           { label: 'ML',            css: 'tag-ml' },
    statistics:   { label: 'Statistics',    css: 'tag-statistics' },
    survey:       { label: 'Survey',        css: 'tag-survey' },
    theory:       { label: 'Theory',        css: 'tag-theory' },
    distillation: { label: 'Distillation',  css: 'tag-distillation' },
    security:     { label: 'Security',      css: 'tag-security' },
};

// ========================================
// State
// ========================================
var activeTag = null;

// ========================================
// Rendering
// ========================================
function renderPapers(tag) {
    var feed = document.getElementById('papers-feed');
    var filtered = tag ? papers.filter(function(p) { return p.tags.indexOf(tag) !== -1; }) : papers;

    if (filtered.length === 0) {
        feed.innerHTML = '<p class="papers-empty">No papers tagged with this yet.</p>';
        return;
    }

    feed.innerHTML = filtered.map(function(paper) {
        var pinHtml = paper.pinned ? '<span class="pin-icon" title="Pinned">📌</span>' : '';
        var titleHtml;
        if (paper.link && paper.link !== '#') {
            titleHtml = '<a href="' + paper.link + '" target="_blank" rel="noopener noreferrer">' + paper.title + '</a>';
        } else {
            titleHtml = paper.title;
        }
        var tagsHtml = paper.tags.map(function(t) {
            var meta = TAG_META[t] || { label: t, css: '' };
            return '<button class="tag-pill ' + meta.css + '" data-tag="' + t + '">' + meta.label + '</button>';
        }).join('');

        return [
            '<article class="paper-entry">',
            '  <time class="paper-date">' + paper.date + '</time>',
            '  <div class="paper-title-row">',
            '    ' + pinHtml,
            '    <h2 class="paper-title">' + titleHtml + '</h2>',
            '  </div>',
            '  <p class="paper-authors">' + paper.authors + '</p>',
            '  <p class="paper-excerpt">&ldquo;' + paper.excerpt + '&rdquo;</p>',
            '  <div class="paper-tags-row">' + tagsHtml + '</div>',
            '</article>'
        ].join('\n');
    }).join('\n');

    // Wire tag pill clicks
    feed.querySelectorAll('.tag-pill').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var t = btn.dataset.tag;
            setActiveTag(activeTag === t ? null : t);
        });
    });
}

function renderSidebar() {
    var counts = {};
    papers.forEach(function(p) {
        p.tags.forEach(function(t) {
            counts[t] = (counts[t] || 0) + 1;
        });
    });

    var sorted = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; });

    var container = document.getElementById('sidebar-tags');
    container.innerHTML = sorted.map(function(tag) {
        var meta = TAG_META[tag] || { label: tag, css: '' };
        return [
            '<button class="sidebar-tag-item" data-tag="' + tag + '">',
            '  <span class="tag-pill ' + meta.css + '">' + meta.label + '</span>',
            '  <span class="sidebar-tag-count">' + counts[tag] + '</span>',
            '</button>'
        ].join('\n');
    }).join('\n');

    container.querySelectorAll('.sidebar-tag-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var t = btn.dataset.tag;
            setActiveTag(activeTag === t ? null : t);
        });
    });
}

function setActiveTag(tag) {
    activeTag = tag;
    renderPapers(tag);

    // Sync sidebar active states
    document.querySelectorAll('.sidebar-tag-item').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderSidebar();
    renderPapers(null);

    // Mobile nav toggle
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // "View all" clears the active filter
    document.getElementById('show-all').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveTag(null);
    });
});
