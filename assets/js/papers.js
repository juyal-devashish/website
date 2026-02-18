// ========================================
// Reading Notes — Paper Data & Rendering
//
// To add a new paper, append an object to the `papers` array.
// Fields: date, title, authors, excerpt, tags[], pinned, link, qa[]
// qa items: { q: "question", a: "answer" }
// ========================================

const papers = [
    {
        date: 'Jan 15, 2026',
        title: 'Attention Is All You Need',
        authors: 'Vaswani et al., NeurIPS 2017',
        excerpt: 'The transformer architecture dispenses with recurrence and convolutions entirely, relying solely on attention mechanisms — a deceptively simple idea that reshaped the entire field.',
        tags: ['llm', 'nlp'],
        pinned: true,
        link: 'https://arxiv.org/abs/1706.03762',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'Proposes the Transformer — a sequence-to-sequence architecture built entirely on self-attention, with no RNNs or CNNs. Encoder and decoder stacks of multi-head attention + feedforward layers, connected by residual paths and layer norms.'
            },
            {
                q: 'Why is it important?',
                a: 'It became the backbone of BERT, GPT, and virtually every modern LLM. By removing recurrence, training became fully parallelizable — making it practical to scale to massive datasets and model sizes.'
            },
            {
                q: 'How did they do it?',
                a: 'Multi-head self-attention lets each token attend to all others simultaneously. Positional encodings inject sequence order. The encoder maps inputs to a continuous representation; the decoder generates outputs autoregressively attending to both.'
            },
            {
                q: 'What is the most important result?',
                a: 'SOTA BLEU on WMT\'14 English-German and English-French translation, trained in a fraction of the time of prior RNN/CNN models. The quality-to-compute tradeoff was just different enough to shift the whole paradigm.'
            }
        ]
    },
    {
        date: 'Jan 22, 2026',
        title: 'A Watermark for Large Language Models',
        authors: 'Kirchenbauer et al., ICML 2023',
        excerpt: 'Embeds a statistical signal into LLM outputs by partitioning the vocabulary into "green" and "red" lists at each token step — elegant in its simplicity, and surprisingly robust to paraphrasing attacks.',
        tags: ['llm', 'security'],
        pinned: true,
        link: 'https://arxiv.org/abs/2301.10226',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'Introduces a practical watermarking scheme for LLM-generated text. At generation time, the model is biased to favor tokens from a "green list" derived by hashing the previous token. A z-test on the green-token fraction detects the watermark.'
            },
            {
                q: 'Why is it important?',
                a: 'Provides the first practical, model-agnostic method to detect AI-generated text without model access. Directly relevant to AI misuse, academic integrity, and provenance tracking. Sparked a whole subfield.'
            },
            {
                q: 'How did they do it?',
                a: 'Before sampling each token, they hash the previous token ID to seed a PRNG, then partition the vocab into a green list (50%) and red list. At generation, logits for green tokens get a soft boost δ. Detection is a one-sided z-test on green-token proportion.'
            },
            {
                q: 'What is the most important result?',
                a: '>95% detection power on sequences of 200+ tokens with a false positive rate near 0.01%, and less than 1% perplexity degradation. The watermark survives moderate paraphrasing, which was the surprising part.'
            }
        ]
    },
    {
        date: 'Feb 3, 2026',
        title: 'Distilling Step-by-Step!',
        authors: 'Hsieh et al., ACL Findings 2023',
        excerpt: 'Uses chain-of-thought rationales from large models as a supervision signal for smaller ones — a clever way to transfer reasoning capabilities, not just final answers.',
        tags: ['llm', 'distillation'],
        pinned: false,
        link: 'https://arxiv.org/abs/2305.02301',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'A knowledge distillation framework where a large teacher LLM generates chain-of-thought rationales that then serve as auxiliary supervision for a small student model. The student learns to predict both the label and the reasoning chain.'
            },
            {
                q: 'Why is it important?',
                a: 'Shows that a 770M-parameter model trained this way outperforms a 540B teacher (PaLM) on several benchmarks — using orders of magnitude less data than standard fine-tuning. Challenges the assumption that task performance requires scale.'
            },
            {
                q: 'How did they do it?',
                a: 'Multi-task learning: the student has one head predicting the label, another predicting the rationale. Both losses are optimized together. The teacher (PaLM 540B) provides rationales via few-shot prompting at dataset construction time, not at inference.'
            },
            {
                q: 'What is the most important result?',
                a: 'Outperforms standard fine-tuning and distillation baselines across NLI, commonsense QA, and arithmetic tasks, with significantly less labeled data. The rationale supervision is the differentiating factor — labels alone don\'t close the gap.'
            }
        ]
    },
    {
        date: 'Feb 10, 2026',
        title: 'Invariant Risk Minimization',
        authors: 'Arjovsky et al., 2019',
        excerpt: 'Proposes learning data representations where the optimal classifier is invariant across training environments — a principled approach to OOD generalization that fundamentally challenged ERM assumptions.',
        tags: ['ml', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/1907.02893',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'Introduces IRM, a learning paradigm that finds a feature representation Φ such that the optimal classifier on top of Φ is the same across all training environments. This forces the model to rely on causal, not spurious, features.'
            },
            {
                q: 'Why is it important?',
                a: 'ERM (standard training) exploits any correlation in the training data, including spurious ones that don\'t hold at test time. IRM is a principled attempt to do causal learning from observational data — directly relevant to robustness and fairness.'
            },
            {
                q: 'How did they do it?',
                a: 'Bi-level optimization: minimize ERM loss while also penalizing the gradient of a fixed dummy classifier (a scalar 1.0 on Φ). If the gradient is nonzero, it means the classifier isn\'t optimal everywhere — a sign of non-invariance. IRMv1 relaxes this as a penalty term.'
            },
            {
                q: 'What is the most important result?',
                a: 'Recovers causal features on ColoredMNIST (a spurious-correlation benchmark) where ERM completely fails. However, real-world results (e.g., WILDS benchmarks) are mixed, and later work showed IRM underperforms ERM in many practical settings. Important caveat.'
            }
        ]
    },
    {
        date: 'Feb 14, 2026',
        title: 'Sequential Change-Point Detection via Online Convex Optimization',
        authors: 'Hazan et al., 2023',
        excerpt: 'Frames change-point detection as an online learning problem, achieving near-optimal detection delay with clean regret-style guarantees — a refreshing new lens on a classical statistics problem.',
        tags: ['statistics', 'theory'],
        pinned: false,
        link: '#',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'Reformulates sequential change-point detection as an instance of online convex optimization (OCO). The CUSUM statistic emerges naturally from an online mirror descent update, allowing regret analysis to bound detection delay.'
            },
            {
                q: 'Why is it important?',
                a: 'Classical CUSUM theory requires parametric assumptions (known pre/post distributions). OCO framing enables data-adaptive, nonparametric detection with rigorous delay guarantees — a cleaner theoretical foundation for modern applications.'
            },
            {
                q: 'How did they do it?',
                a: 'Define a loss function tied to the log-likelihood ratio. Run online mirror descent on this sequence of losses. Show that the cumulative loss until a stopping rule triggers has O(log T) regret relative to the optimal fixed-threshold strategy.'
            },
            {
                q: 'What is the most important result?',
                a: 'Near-optimal expected detection delay under Gaussian mean shift, matching the Lorden lower bound up to log factors. The connection to OCO also gives a clean modular way to plug in different divergences or loss structures.'
            }
        ]
    },
    {
        date: 'Feb 17, 2026',
        title: 'Language Models are Few-Shot Learners',
        authors: 'Brown et al., NeurIPS 2020',
        excerpt: 'GPT-3 demonstrates that scale alone unlocks emergent few-shot behavior — raising more questions about what "learning" really means than it actually answers.',
        tags: ['llm', 'survey'],
        pinned: false,
        link: 'https://arxiv.org/abs/2005.14165',
        qa: [
            {
                q: 'What does this paper do?',
                a: 'Trains GPT-3 (175B parameters) on a massive diverse text corpus and evaluates it in zero-, one-, and few-shot settings — where "few-shot" means in-context examples in the prompt, no gradient updates.'
            },
            {
                q: 'Why is it important?',
                a: 'Demonstrated that large-scale pretraining alone produces a model capable of adapting to arbitrary tasks via prompting. Spawned the prompt engineering era and raised deep questions about generalization, memorization, and what in-context learning actually is.'
            },
            {
                q: 'How did they do it?',
                a: 'Standard autoregressive LM training on ~300B tokens from Common Crawl, WebText, Books, and Wikipedia. Evaluation is purely inference-time: condition on k examples (k=0,1,few) and score the model\'s completion. No fine-tuning whatsoever.'
            },
            {
                q: 'What is the most important result?',
                a: 'Few-shot GPT-3 matches or beats fine-tuned SOTA on SuperGLUE tasks. Performance scales smoothly and predictably with model size, context length, and data — the scaling laws paper companion made this quantitative.'
            }
        ]
    }
];

// ========================================
// Tag metadata
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
// Level system
// ========================================
const LEVELS = [
    { min: 0,   name: 'Curious Reader',   emoji: '👀' },
    { min: 4,   name: 'Grad Student Mode', emoji: '📚' },
    { min: 10,  name: 'Paper Chaser',      emoji: '🔬' },
    { min: 20,  name: 'Arxiv Addict',      emoji: '🤓' },
    { min: 35,  name: 'PhD Candidate',     emoji: '⚗️'  },
    { min: 60,  name: 'Certified Nerd',    emoji: '🧠' },
];

function getLevel(count) {
    var level = LEVELS[0];
    var levelIdx = 0;
    for (var i = 0; i < LEVELS.length; i++) {
        if (count >= LEVELS[i].min) { level = LEVELS[i]; levelIdx = i; }
    }
    var next = LEVELS[levelIdx + 1] || null;
    var pct = next
        ? Math.round(((count - level.min) / (next.min - level.min)) * 100)
        : 100;
    var hint = next ? (next.min - count) + ' more to next level' : 'Max level reached';
    return { level: level, pct: pct, hint: hint };
}

// ========================================
// State
// ========================================
var activeTag = null;

// ========================================
// Counter
// ========================================
function renderCounter() {
    var total = papers.length;
    var tagSet = {};
    papers.forEach(function(p) { p.tags.forEach(function(t) { tagSet[t] = true; }); });
    var tagCount = Object.keys(tagSet).length;
    var lvl = getLevel(total);

    var el = document.getElementById('papers-counter');
    el.innerHTML = [
        '<div class="counter-stat">',
        '  <span class="counter-num">' + total + '</span>',
        '  <span class="counter-label">Papers Read</span>',
        '</div>',
        '<div class="counter-level">',
        '  <span class="level-badge">' + lvl.level.emoji + ' ' + lvl.level.name + '</span>',
        '  <div class="level-progress-bar"><div class="level-progress-fill" style="width:' + lvl.pct + '%"></div></div>',
        '  <span class="level-hint">' + lvl.hint + '</span>',
        '</div>',
        '<div class="counter-stat counter-stat-right">',
        '  <span class="counter-num">' + tagCount + '</span>',
        '  <span class="counter-label">Tags Explored</span>',
        '</div>',
    ].join('\n');
}

// ========================================
// Card expand/collapse
// ========================================
function toggleCard(card) {
    var qa = card.querySelector('.paper-qa');
    var expanded = card.classList.toggle('expanded');
    qa.style.maxHeight = expanded ? qa.scrollHeight + 'px' : '0';
}

// ========================================
// Rendering
// ========================================
function renderPapers(tag) {
    var feed = document.getElementById('papers-feed');
    var filtered = tag
        ? papers.filter(function(p) { return p.tags.indexOf(tag) !== -1; })
        : papers;

    if (filtered.length === 0) {
        feed.innerHTML = '<p class="papers-empty">No papers tagged with this yet.</p>';
        return;
    }

    feed.innerHTML = filtered.map(function(paper) {
        var pinHtml = paper.pinned ? '<span class="pin-icon" title="Pinned">📌</span>' : '';
        var titleHtml = (paper.link && paper.link !== '#')
            ? '<a href="' + paper.link + '" target="_blank" rel="noopener noreferrer">' + paper.title + ' <i class="fas fa-external-link-alt"></i></a>'
            : paper.title;

        var tagsHtml = paper.tags.map(function(t) {
            var meta = TAG_META[t] || { label: t, css: '' };
            return '<button class="tag-pill ' + meta.css + '" data-tag="' + t + '">' + meta.label + '</button>';
        }).join('');

        var qaHtml = '';
        if (paper.qa && paper.qa.length) {
            qaHtml = [
                '<div class="paper-qa">',
                '  <div class="paper-qa-inner">',
                paper.qa.map(function(item) {
                    return [
                        '<div class="qa-item">',
                        '  <p class="qa-question">' + item.q + '</p>',
                        '  <p class="qa-answer">' + item.a + '</p>',
                        '</div>'
                    ].join('\n');
                }).join('\n'),
                '  </div>',
                '</div>'
            ].join('\n');
        }

        return [
            '<article class="paper-card" data-tags="' + paper.tags.join(',') + '">',
            '  <div class="paper-card-header">',
            '    <div class="paper-card-main">',
            '      <time class="paper-date">' + paper.date + '</time>',
            '      <div class="paper-title-row">' + pinHtml + '<h2 class="paper-title">' + titleHtml + '</h2></div>',
            '      <p class="paper-authors">' + paper.authors + '</p>',
            '      <p class="paper-excerpt">&ldquo;' + paper.excerpt + '&rdquo;</p>',
            '      <div class="paper-tags-row">' + tagsHtml + '</div>',
            '    </div>',
            paper.qa && paper.qa.length
                ? '    <span class="paper-expand-icon"><i class="fas fa-chevron-down"></i></span>'
                : '',
            '  </div>',
            qaHtml,
            '</article>'
        ].join('\n');
    }).join('\n');

    // Wire card expand (exclude clicks on links and tag pills)
    feed.querySelectorAll('.paper-card').forEach(function(card) {
        var header = card.querySelector('.paper-card-header');
        if (!card.querySelector('.paper-qa')) return;
        header.addEventListener('click', function(e) {
            if (e.target.closest('a') || e.target.closest('.tag-pill')) return;
            toggleCard(card);
        });
    });

    // Wire tag pill clicks
    feed.querySelectorAll('.tag-pill').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var t = btn.dataset.tag;
            setActiveTag(activeTag === t ? null : t);
        });
    });
}

function renderSidebar() {
    var counts = {};
    papers.forEach(function(p) {
        p.tags.forEach(function(t) { counts[t] = (counts[t] || 0) + 1; });
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
    document.querySelectorAll('.sidebar-tag-item').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
}

// ========================================
// Init
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    renderCounter();
    renderSidebar();
    renderPapers(null);

    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    document.getElementById('show-all').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveTag(null);
    });
});
