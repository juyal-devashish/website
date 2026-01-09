// ========================================
// Neural Network Animation (p5.js)
// Forward pass -> Backprop when reaches output -> Repeat
// ========================================
var network;
var waitingForBackprop = false;
var backpropInProgress = false;
var lastActivityFrame = 0;

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('neural-canvas-container');
    
    network = new Network(width / 2, height / 2);
    
    var layers = [];
    var layerSizes = [5, 15, 7, 19, 11, 9, 12, 12, 3, 1];
    var layerSpacing = 250;
    var startX = -layerSpacing * (layerSizes.length - 1) / 2;
    
    for (var l = 0; l < layerSizes.length; l++) {
        var layer = [];
        var neuronCount = layerSizes[l];
        var verticalSpacing = 100;
        var startY = -verticalSpacing * (neuronCount - 1) / 2;
        
        for (var i = 0; i < neuronCount; i++) {
            var x = startX + l * layerSpacing;
            var y = startY + i * verticalSpacing;
            x += random(-1, 1);
            y += random(-1, 1);
            
            // Same threshold for all layers
            var neuron = new Neuron(x, y, l, random(-0.15, 0.15));
            layer.push(neuron);
            network.addNeuron(neuron);
        }
        layers.push(layer);
    }
    
    network.layers = layers;
    
    for (var l = 0; l < layers.length - 1; l++) {
        connectLayersDense(layers[l], layers[l + 1], network);
    }
    
    frameRate(60);
}

function connectLayersDense(layerA, layerB, network) {
    for (var i = 0; i < layerA.length; i++) {
        var ratioA = i / layerA.length;
        var centerB = Math.floor(ratioA * layerB.length);
        
        var connectionCount = floor(random(4, 7));
        var connected = [];
        
        for (var c = 0; c < connectionCount; c++) {
            var offset = floor(random(-3, 4));
            var j = constrain(centerB + offset, 0, layerB.length - 1);
            
            if (connected.indexOf(j) === -1) {
                connected.push(j);
                network.connect(layerA[i], layerB[j], 1.0); // Equal weight
            }
        }
    }
}

function draw() {
    background(25, 25, 24);
    
    network.update();
    network.display();
    
    // Check if output layer received signal -> trigger backprop
    if (waitingForBackprop && network.outputLayerActivated()) {
        waitingForBackprop = false;
        backpropInProgress = true;
        lastActivityFrame = frameCount;
        network.triggerBackprop();
    }
    
    // Check if backprop is complete -> allow next forward pass
    if (backpropInProgress && network.isIdle()) {
        backpropInProgress = false;
    }
    
    // Timeout: if stuck waiting too long, reset and start fresh
    var timeout = 600; // 5 seconds at 60fps
    if ((waitingForBackprop || backpropInProgress) && frameCount - lastActivityFrame > timeout) {
        waitingForBackprop = false;
        backpropInProgress = false;
    }
    
    // Start new forward pass only when nothing is happening
    if (!waitingForBackprop && !backpropInProgress && network.isIdle()) {
        network.spontaneousActivation();
        waitingForBackprop = true;
        lastActivityFrame = frameCount;
    }
    
    drawVignette();
}

function drawVignette() {
    var cx = width / 2;
    var cy = height / 2;
    var maxDist = max(width, height) * 0.95;
    
    var gradient = drawingContext.createRadialGradient(cx, cy, maxDist * 0.1, cx, cy, maxDist);
    gradient.addColorStop(0, 'rgba(15, 15, 14, 0.5)');
    gradient.addColorStop(0.35, 'rgba(15, 15, 14, 0.6)');
    gradient.addColorStop(0.6, 'rgba(15, 15, 14, 0.7)');
    gradient.addColorStop(0.8, 'rgba(15, 15, 14, 0.8)');
    gradient.addColorStop(1, 'rgba(15, 15, 14, 0.9)');
    
    drawingContext.fillStyle = gradient;
    drawingContext.fillRect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    network.position = createVector(width / 2, height / 2);
}

// ========================================
// Connection Class (Synapse)
// ========================================
function Connection(from, to, w) {
    this.a = from;
    this.b = to;
    this.weight = w;
    this.sending = false;
    this.sender = null;
    this.signalStrength = 0;
    this.signalProgress = 0;
    this.signalSpeed = 0;
    
    // Backprop properties
    this.backpropSending = false;
    this.backpropSender = null;
    this.backpropStrength = 0;
    this.backpropProgress = 0;
    this.backpropSpeed = 0;

    this.feedforward = function(val) {
        this.signalStrength = val;
        this.sender = this.a.position.copy();
        this.sending = true;
        this.signalProgress = 0;
        this.signalSpeed = 0.006;
    };
    
    this.backpropagate = function(val) {
        this.backpropStrength = val;
        this.backpropSender = this.b.position.copy();
        this.backpropSending = true;
        this.backpropProgress = 0;
        this.backpropSpeed = 0.048; // Faster than forward
    };
    
    this.isActive = function() {
        return this.sending || this.backpropSending;
    };

    this.update = function() {
        // Forward pass
        if (this.sending) {
            const accel = 0.0008;
            this.signalSpeed += accel;
            this.signalProgress += this.signalSpeed;

            const easedProgress = this.easeOutQuad(this.signalProgress);
            this.sender.x = lerp(this.a.position.x, this.b.position.x, easedProgress);
            this.sender.y = lerp(this.a.position.y, this.b.position.y, easedProgress);

            if (this.signalProgress >= 1) {
                this.b.receiveInput(this.signalStrength);
                this.sending = false;
                this.signalSpeed = 0;
            }
        }
        
        // Backward pass - faster
        if (this.backpropSending) {
            const accel = 0.0015; // Faster acceleration
            this.backpropSpeed += accel;
            this.backpropProgress += this.backpropSpeed;

            const easedProgress = this.easeOutQuad(this.backpropProgress);
            this.backpropSender.x = lerp(this.b.position.x, this.a.position.x, easedProgress);
            this.backpropSender.y = lerp(this.b.position.y, this.a.position.y, easedProgress);

            if (this.backpropProgress >= 1) {
                this.a.receiveGradient(this.backpropStrength);
                this.backpropSending = false;
                this.backpropSpeed = 0;
            }
        }
    };

    this.easeOutQuad = function(t) {
        return 1 - (1 - t) * (1 - t);
    };

    this.display = function() {
        // Connection line
        stroke(95, 95, 92, 45);
        strokeWeight(1.5);
        line(this.a.position.x, this.a.position.y, this.b.position.x, this.b.position.y);

        // Forward signal (gold) - same style for both
        if (this.sending) {
            this.drawSignal(this.sender.x, this.sender.y, this.signalStrength, false);
        }
        
        // Backprop signal - same gold style, just going backwards
        if (this.backpropSending) {
            this.drawSignal(this.backpropSender.x, this.backpropSender.y, this.backpropStrength, true);
        }
    };
    
    this.drawSignal = function(x, y, strength, isBackprop) {
        noStroke();
        var intensity = abs(strength);
        
        // Same gold color for both, slightly cyan tint for backprop
        var r = isBackprop ? 180 : 212;
        var g = isBackprop ? 200 : 162;
        var b = isBackprop ? 210 : 122;

        fill(r, g, b, intensity * 40);
        ellipse(x, y, 12 + intensity * 6, 12 + intensity * 6);

        fill(r, g, b, intensity * 80);
        ellipse(x, y, 7 + intensity * 4, 7 + intensity * 4);

        fill(r, g, b, intensity * 150);
        ellipse(x, y, 3 + intensity * 2, 3 + intensity * 2);

        fill(255, 250, isBackprop ? 255 : 230);
        ellipse(x, y, 2 + intensity * 1, 2 + intensity * 1);
    };
}

// ========================================
// Network Class
// ========================================
function Network(x, y) {
    this.neurons = [];
    this.connections = [];
    this.position = createVector(x, y);
    this.layers = [];

    this.addNeuron = function(n) {
        this.neurons.push(n);
    };

    this.connect = function(a, b, weight) {
        var c = new Connection(a, b, weight);
        a.addConnection(c);
        b.addIncomingConnection(c);
        this.connections.push(c);
    };

    this.spontaneousActivation = function() {
        if (this.layers.length > 0) {
            // Only first layer
            var inputLayer = this.layers[0];
            var numToActivate = floor(random(1, 3));
            
            for (var i = 0; i < numToActivate; i++) {
                var idx = floor(random(inputLayer.length));
                inputLayer[idx].receiveInput(1.0);
            }
        }
    };
    
    this.triggerBackprop = function() {
        if (this.layers.length > 0) {
            var outputLayer = this.layers[this.layers.length - 1];
            for (var i = 0; i < outputLayer.length; i++) {
                outputLayer[i].startBackprop(1.0); // Equal strength
            }
        }
    };
    
    this.outputLayerActivated = function() {
        if (this.layers.length > 0) {
            var outputLayer = this.layers[this.layers.length - 1];
            for (var i = 0; i < outputLayer.length; i++) {
                if (outputLayer[i].justFired) {
                    outputLayer[i].justFired = false;
                    return true;
                }
            }
        }
        return false;
    };
    
    this.isIdle = function() {
        // Check if any connections are active
        for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].isActive()) {
                return false;
            }
        }
        return true;
    };

    this.update = function() {
        for (var i = 0; i < this.neurons.length; i++) {
            this.neurons[i].update();
        }
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].update();
        }
    };

    this.display = function() {
        push();
        translate(this.position.x, this.position.y);
        
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].display();
        }
        
        for (var i = 0; i < this.neurons.length; i++) {
            this.neurons[i].display();
        }
        pop();
    };
}

// ========================================
// Neuron Class
// ========================================
function Neuron(x, y, layerIndex, bias) {
    this.position = createVector(x, y);
    this.connections = [];
    this.incomingConnections = [];
    this.layerIndex = layerIndex || 0;
    
    this.bias = bias;
    this.membranePotential = 0;
    this.threshold = 1;
    this.restingPotential = 0;
    this.refractoryPeriod = 0;
    
    this.gradient = 0;
    this.backpropRefractoryPeriod = 0;
    
    this.r = 18;
    this.baseR = 18;
    this.glowIntensity = 0.08;
    this.backpropGlow = 0;
    this.lastFiringStrength = 0;
    this.justFired = false;

    this.addConnection = function(c) {
        this.connections.push(c);
    };
    
    this.addIncomingConnection = function(c) {
        this.incomingConnections.push(c);
    };

    this.receiveInput = function(value) {
        if (this.refractoryPeriod <= 0) {
            this.membranePotential += value;
        }
    };
    
    this.receiveGradient = function(value) {
        if (this.backpropRefractoryPeriod <= 0) {
            this.gradient += value;
        }
    };
    
    this.startBackprop = function(errorSignal) {
        this.gradient = errorSignal;
        this.propagateGradient();
    };
    
    this.propagateGradient = function() {
        if (this.gradient > 0.1 && this.backpropRefractoryPeriod <= 0) {
            this.backpropGlow = 0.6 + this.gradient * 0.4;
            
            for (var i = 0; i < this.incomingConnections.length; i++) {
                // Fixed strength - no accumulation
                this.incomingConnections[i].backpropagate(1.0);
            }
            
            this.gradient = 0;
            this.backpropRefractoryPeriod = 6;
        }
    };

    this.update = function() {
        if (this.refractoryPeriod > 0) {
            this.refractoryPeriod--;
        }
        
        if (this.backpropRefractoryPeriod > 0) {
            this.backpropRefractoryPeriod--;
        }

        const effectiveThreshold = this.threshold + this.bias;

        // All layers fire the same way - 100% when threshold exceeded
        if (this.membranePotential > effectiveThreshold && this.refractoryPeriod <= 0) {
            this.fire();
        }
        
        if (this.gradient > 0.1) {
            this.propagateGradient();
        }

        this.membranePotential = lerp(this.membranePotential, this.restingPotential, 0.04);
        this.gradient = lerp(this.gradient, 0, 0.1);
    };

    this.fire = function() {
        this.lastFiringStrength = min(this.membranePotential, 1.8);
        
        this.r = this.baseR + this.lastFiringStrength * 6;
        this.glowIntensity = 0.5 + this.lastFiringStrength * 0.5;
        
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].feedforward(1.0); // Equal strength
        }
        
        this.membranePotential = 0;
        this.refractoryPeriod = 5;
        this.justFired = true;
    };

    this.display = function() {
        noStroke();

        var displayIntensity = max(this.glowIntensity, this.membranePotential * 0.7);
        var backpropIntensity = this.backpropGlow;
        var maxIntensity = max(displayIntensity, backpropIntensity);

        // Glow - same style, slight color shift for backprop
        if (maxIntensity > 0.1) {
            var glowR = backpropIntensity > displayIntensity ? 180 : 212;
            var glowG = backpropIntensity > displayIntensity ? 200 : 162;
            var glowB = backpropIntensity > displayIntensity ? 210 : 122;
            
            fill(glowR, glowG, glowB, maxIntensity * 50);
            ellipse(this.position.x, this.position.y, this.r * 1.8, this.r * 1.8);
        }

        // Neuron body
        stroke(105, 105, 100, 45 + maxIntensity * 55);
        strokeWeight(1.5);

        var baseGray = 38;
        var r = lerp(baseGray, backpropIntensity > displayIntensity ? 180 : 225, maxIntensity);
        var g = lerp(baseGray, backpropIntensity > displayIntensity ? 210 : 175, maxIntensity);
        var b = lerp(baseGray, backpropIntensity > displayIntensity ? 220 : 135, maxIntensity);

        fill(r, g, b);
        ellipse(this.position.x, this.position.y, this.r, this.r);

        // Bright center
        if (maxIntensity > 0.35) {
            noStroke();
            fill(255, 252, backpropIntensity > displayIntensity ? 255 : 235, maxIntensity * 200);
            ellipse(this.position.x, this.position.y, this.r * 0.35, this.r * 0.35);
        }

        this.r = lerp(this.r, this.baseR, 0.05);
        this.glowIntensity = lerp(this.glowIntensity, 0.08, 0.035);
        this.backpropGlow = lerp(this.backpropGlow, 0, 0.04);
    };
}

// ========================================
// Page Interactions
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const typingTexts = [
        'ML (pushing F1 score on Kaggle \u{1F600})',
        'NLP (another torch size mismatch \u{1F62D})',
        'LLMs (job queued on the cluster \u{1F973})',
        'Python (trying to get it done in O(1) \u{1F913})'
    ];

    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    function typeText() {
        if (!typingElement) return;
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        // Get the substring, but handle emoji as single unit
        let displayText = '';
        let count = 0;
        for (const char of currentText) {
            if (count >= charIndex) break;
            displayText += char;
            count++;
        }
        
        typingElement.textContent = displayText;
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        // Count actual characters (emoji = 1)
        const textLength = [...currentText].length;
        
        if (!isDeleting && charIndex >= textLength) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typeSpeed = 500;
        }
        setTimeout(typeText, typeSpeed);
    }
    setTimeout(typeText, 1000);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.skill-card, .project-card, .about-content, .about-image').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        nav.style.background = window.pageYOffset > 100 ? 'rgba(25, 25, 24, 0.95)' : 'rgba(25, 25, 24, 0.9)';
    });
});