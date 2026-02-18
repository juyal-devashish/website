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
    },

    // ---- Papers from reading list (Q&A to be filled in) ----

    {
        date: 'Jan 2025',
        title: 'Small Language Models (SLMs) Can Still Pack a Punch: A Survey',
        authors: 'Gamage, Chathurika, et al.',
        excerpt: 'A comprehensive survey showing that sub-10B models can match or exceed much larger counterparts when trained intelligently — covering architecture choices, data curation, and post-training techniques.',
        tags: ['llm', 'survey'],
        pinned: false,
        link: 'https://arxiv.org/abs/2501.05465',
        qa: []
    },
    {
        date: 'Mar 2022',
        title: 'Training Compute-Optimal Large Language Models',
        authors: 'Hoffmann, Jordan, et al. (Chinchilla)',
        excerpt: 'Shows most LLMs are severely undertrained — optimal compute allocation requires scaling data proportionally with model size, yielding the Chinchilla recipe: 70B params, 1.4T tokens.',
        tags: ['llm', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/2203.15556',
        qa: []
    },
    {
        date: '2025',
        title: 'On the Slow Death of Scaling',
        authors: 'Hooker, Sarah',
        excerpt: 'A critical examination of diminishing returns from scaling compute alone, arguing that continued progress requires architectural innovation, data quality improvements, and algorithmic efficiency gains.',
        tags: ['llm', 'theory', 'survey'],
        pinned: false,
        link: 'https://ssrn.com/abstract=5877662',
        qa: []
    },
    {
        date: '2024',
        title: 'Baguettotron: A 321M Parameter Generative Model',
        authors: 'PleIAs',
        excerpt: 'A 321M-parameter open French generative language model trained from scratch, demonstrating that high-quality small models can be built for non-English languages with modest compute.',
        tags: ['llm'],
        pinned: false,
        link: 'https://huggingface.co/PleIAs/Baguettotron',
        qa: []
    },
    {
        date: 'Jun 2023',
        title: 'Textbooks Are All You Need',
        authors: 'Gunasekar, Suriya, et al.',
        excerpt: 'Trains phi-1, a 1.3B coding LLM, purely on high-quality synthetic "textbook-like" data — demonstrating that data quality can substitute for scale with far fewer tokens than conventional pretraining.',
        tags: ['llm', 'distillation'],
        pinned: false,
        link: 'https://arxiv.org/abs/2306.11644',
        qa: []
    },
    {
        date: 'Jul 2025',
        title: 'Scaling Laws for Optimal Data Mixtures',
        authors: 'Mustafa Shukor, Louis Bethune, Dan Busbridge, David Grangier, Enrico Fini, Alaaeldin El-Nouby, Pierre Ablin',
        excerpt: 'Derives scaling laws for data mixing ratios across domains, showing that the optimal mixture itself shifts with compute budget and cannot be fixed once for all training runs.',
        tags: ['llm', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/2507.09404',
        qa: []
    },
    {
        date: 'Feb 2025',
        title: 'Topic Over Source: The Key to Effective Data Mixing for Language Models Pre-training',
        authors: 'Zhu, Tong, et al.',
        excerpt: 'Finds that grouping pretraining data by topic rather than by source domain leads to substantially more effective mixing strategies, challenging conventional domain-based data curation pipelines.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2502.16802',
        qa: []
    },
    {
        date: 'Feb 2025',
        title: 'SmolLM2 Technical Report',
        authors: 'Allal et al.',
        excerpt: 'HuggingFace\'s family of compact language models (135M–1.7B) trained on carefully curated datasets — a practical and transparent reference point for efficient small-model training.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2502.02737',
        qa: []
    },
    {
        date: '2024',
        title: 'The Smol Training Playbook',
        authors: 'Ben Allal, Loubna, et al.',
        excerpt: 'A practitioner\'s guide from HuggingFace covering the full recipe for training small language models: data curation, architecture choices, training dynamics, and evaluation strategies.',
        tags: ['llm'],
        pinned: false,
        link: 'https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook',
        qa: []
    },
    {
        date: 'Nov 2024',
        title: 'Hymba: A Hybrid-head Architecture for Small Language Models',
        authors: 'NVIDIA Research',
        excerpt: 'Combines Mamba state-space heads with attention heads in the same layer, achieving strong performance with a lower memory footprint than pure-attention models at small scales.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2411.13676',
        qa: []
    },
    {
        date: 'Apr 2024',
        title: 'Eagle and Finch: RWKV with Matrix-Valued States and Dynamic Recurrence',
        authors: 'Peng, Bo, et al.',
        excerpt: 'Extends RWKV with matrix-valued hidden states and dynamic recurrence gating, closing much of the quality gap with transformers while preserving linear-time inference.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2404.05892',
        qa: []
    },
    {
        date: 'Feb 2024',
        title: 'MobiLlama: Towards Accurate and Lightweight Fully Transparent GPT',
        authors: 'Thopilan, Romal, et al.',
        excerpt: 'A fully transparent 0.5B-parameter LLM designed for on-device deployment, using parameter sharing across all transformer layers to dramatically reduce model size without large quality losses.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2402.16840',
        qa: []
    },
    {
        date: 'Apr 2024',
        title: 'OpenELM: An Efficient Language Model Family',
        authors: 'Mehta, Sachin, et al.',
        excerpt: 'Apple\'s open-source model family using layer-wise scaling of attention heads and FFN dimensions, achieving competitive performance with fewer total parameters than uniformly-sized counterparts.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2404.14619',
        qa: []
    },
    {
        date: 'Jan 2026',
        title: 'Conditional Memory via Scalable Lookup: A New Axis of Sparsity for Large Language Models',
        authors: 'Cheng et al.',
        excerpt: 'Replaces dense attention\'s KV cache with a sparse lookup over a large external memory bank, introducing a new axis of sparsity that enables long-context modeling at dramatically lower memory cost.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2601.07372',
        qa: []
    },
    {
        date: 'Jul 2025',
        title: 'FlexOLMo: Open Language Models for Flexible Data Use',
        authors: 'Shi et al.',
        excerpt: 'An OLMo variant demonstrating that flexible data-licensing policies — mixing open and restricted sources with explicit provenance — can be incorporated without degrading model quality.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2507.07024',
        qa: []
    },
    {
        date: 'Oct 2025',
        title: 'Front-Loading Reasoning: The Synergy between Pretraining and Post-Training Data',
        authors: 'NVIDIA & Hugging Face Researchers',
        excerpt: 'Shows that including reasoning-rich data early in pretraining — rather than deferring it to post-training — creates stronger base models that respond more effectively to RLHF and instruction tuning.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2510.03264',
        qa: []
    },
    {
        date: 'Oct 2025',
        title: 'Midtraining Bridges Pretraining and Posttraining Distributions',
        authors: 'Emmy Liu, Graham Neubig, Chenyan Xiong',
        excerpt: 'Introduces a midtraining phase that sits between pretraining and finetuning, reducing the distributional gap between the two and improving both instruction following and domain adaptation.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2510.14865',
        qa: []
    },
    {
        date: '2025',
        title: 'Balancing the Budget: Understanding Trade-offs Between Supervised and Preference-Based Finetuning',
        authors: 'Mohit Raghavendra, Junmo Kang, Alan Ritter',
        excerpt: 'Analyzes the compute tradeoff between SFT and preference-based finetuning (DPO/RLHF) under a fixed budget, finding that SFT-heavy allocations generally outperform preference-heavy ones.',
        tags: ['llm'],
        pinned: false,
        link: 'https://aclanthology.org/2025.acl-long.1248.pdf',
        qa: []
    },
    {
        date: 'Jul 2024',
        title: 'The Llama 3 Herd of Models',
        authors: 'Dubey, Abhimanyu, et al. (Meta AI)',
        excerpt: 'Meta\'s comprehensive report on Llama 3 — covering pretraining data pipeline, architecture decisions, the full post-training stack, and safety work across 8B, 70B, and 405B scales.',
        tags: ['llm', 'survey'],
        pinned: false,
        link: 'https://arxiv.org/abs/2407.21783',
        qa: []
    },
    {
        date: 'Dec 2024',
        title: 'DeepSeek-V3 Technical Report',
        authors: 'DeepSeek AI',
        excerpt: 'A 671B mixture-of-experts model achieving GPT-4-level performance at significantly lower training cost, with innovations in MoE load balancing, multi-token prediction, and FP8 training.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2412.19437',
        qa: []
    },
    {
        date: 'Jun 2024',
        title: 'JEST: Joint Example Selection and Training for Efficient Data Selection',
        authors: 'Mindermann, Sören, et al.',
        excerpt: 'Scores training examples by their joint utility for an entire mini-batch rather than individually, enabling more efficient pretraining convergence with substantially less data.',
        tags: ['llm', 'ml'],
        pinned: false,
        link: 'https://arxiv.org/abs/2406.17711',
        qa: []
    },
    {
        date: '2025',
        title: 'DeepSeek-V3.2-Exp: Boosting Long-Context Efficiency with DeepSeek Sparse Attention',
        authors: 'DeepSeek AI',
        excerpt: 'Extends DeepSeek-V3 with sparse attention patterns that enable efficient long-context processing, reducing KV cache memory and compute without proportional quality losses.',
        tags: ['llm'],
        pinned: false,
        link: 'https://www.ele-yufo.com/wp-content/uploads/2025/10/DeepSeek_V3_2-1.pdf',
        qa: []
    },
    {
        date: 'Sep 2024',
        title: 'OLMoE: Open Mixture-of-Experts Language Models',
        authors: 'Muennighoff, Niklas, et al.',
        excerpt: 'A fully open-sourced sparse MoE language model — releasing weights, training data, and code — establishing a transparency benchmark for mixture-of-experts research.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2409.02060',
        qa: []
    },
    {
        date: 'Feb 2025',
        title: 'Explaining Context Length Scaling and Bounds for Language Models',
        authors: 'Chen, Y., et al.',
        excerpt: 'Derives theoretical bounds on how context length affects LLM performance, providing a principled explanation for the empirical scaling behavior observed in long-context model evaluations.',
        tags: ['llm', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/2502.01481',
        qa: []
    },
    {
        date: 'Nov 2025',
        title: 'Sample-Efficient Language Modeling with Linear Attention and Lightweight Enhancements',
        authors: 'Haller, Patrick, et al.',
        excerpt: 'Combines linear attention with a set of lightweight architectural enhancements to match standard transformer performance while requiring significantly fewer training tokens.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2511.05560',
        qa: []
    },
    {
        date: 'Feb 2025',
        title: 'LIFT: Improving Long Context Understanding via Long Input Fine-Tuning',
        authors: 'Wang, Y., et al.',
        excerpt: 'A fine-tuning approach for extending LLM context windows that trains the model to attend to information spread across long inputs, improving retrieval accuracy and coherence on long-document tasks.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2502.14644',
        qa: []
    },
    {
        date: 'Dec 2024',
        title: 'Phi-4 Technical Report',
        authors: 'Microsoft Research',
        excerpt: 'Microsoft\'s 14B model trained with a heavy emphasis on synthetic data generation and careful data curation, demonstrating again that data quality consistently outpunches raw scale.',
        tags: ['llm', 'distillation'],
        pinned: false,
        link: 'https://arxiv.org/abs/2412.08905',
        qa: []
    },
    {
        date: 'Apr 2024',
        title: 'MiniCPM: Unveiling the Potential of Small Language Models',
        authors: 'Hu, Shengding, et al.',
        excerpt: 'A family of sub-3B models from Tsinghua/ModelBest using scaling-law-guided training decisions — showing the 1-2B regime can be highly competitive with careful hyperparameter and data choices.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2404.06395',
        qa: []
    },
    {
        date: 'Mar 2024',
        title: 'ORPO: Monolithic Preference Optimization without Reference Model',
        authors: 'Hong, Jiwoo, et al.',
        excerpt: 'Eliminates the reference model from preference optimization by incorporating an odds-ratio penalty directly into the SFT loss — a cleaner, cheaper alternative to DPO and PPO.',
        tags: ['llm'],
        pinned: false,
        link: 'https://arxiv.org/abs/2403.07691',
        qa: []
    },
    {
        date: 'Sep 2023',
        title: 'Language Modeling Is Compression',
        authors: 'Delétang, Grégoire, et al.',
        excerpt: 'Formally proves that language modeling and data compression are equivalent — a model\'s perplexity directly determines its compression ratio, unifying the two fields under information theory.',
        tags: ['llm', 'theory'],
        pinned: false,
        link: 'https://arxiv.org/abs/2309.10668',
        qa: []
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
