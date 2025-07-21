

class AdvancedHeroBackground {
  constructor(container) {
    this.container = container;
    this.isLoaded = false;
    this.animationIds = [];
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  async init() {
   
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      await Promise.all([
        this.createWebGLSphere(),
        this.createParticleSystem(),
        this.createNeuralNetwork(),
        this.createDynamicLighting(),
        this.createAudioVisualizer(),
      ]);

      this.isLoaded = true;
      this.setupMouseInteraction();
    } catch (error) {
      console.warn("Advanced background initialization failed:", error);
    }
  }

  createWebGLSphere() {
    return new Promise((resolve) => {
      const canvas = this.createElement("canvas", "hero-canvas");
      const gl =
        canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) || 
        canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });

      if (!gl) {
        resolve();
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Vertex shader source
      const vertexShaderSource = `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        attribute vec2 aTexCoord;
        
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uTime;
        uniform vec2 uMouse;
        
        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec3 vPosition;
        
        // Simple noise function
        float noise(vec3 pos) {
          return sin(pos.x) * sin(pos.y) * sin(pos.z);
        }
        
        void main() {
          vec3 position = aPosition;
          
          // Add displacement based on noise and time
          float displacement = noise(position * 3.0 + uTime * 0.1) * 0.1;
          position += aNormal * displacement;
          
          // Mouse interaction
          float mouseInfluence = length(uMouse) * 0.3;
          position += aNormal * mouseInfluence * 0.05;
          
          vNormal = aNormal;
          vTexCoord = aTexCoord;
          vPosition = position;
          
          gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(position, 1.0);
        }
      `;

      // Fragment shader source
      const fragmentShaderSource = `
        precision mediump float;
        
        uniform float uTime;
        uniform vec2 uMouse;
        
        varying vec3 vNormal;
        varying vec2 vTexCoord;
        varying vec3 vPosition;
        
        void main() {
          vec3 color1 = vec3(0.29, 0.56, 0.89); // Blue
          vec3 color2 = vec3(0.56, 0.27, 0.68); // Purple
          vec3 color3 = vec3(0.31, 0.78, 0.47); // Green
          
          float mixFactor = sin(vPosition.x * 2.0 + uTime) * 0.5 + 0.5;
          vec3 color = mix(mix(color1, color2, mixFactor), color3, sin(uTime * 0.5) * 0.5 + 0.5);
          
          // Add some glow effect
          float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));
          color += glow * 0.2;
          
          gl_FragColor = vec4(color, 0.7);
        }
      `;

      // Compile shader
      function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      }

      // Create shader program
      const vertexShader = compileShader(
        gl,
        vertexShaderSource,
        gl.VERTEX_SHADER,
      );
      const fragmentShader = compileShader(
        gl,
        fragmentShaderSource,
        gl.FRAGMENT_SHADER,
      );

      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      // Create sphere geometry (simplified)
      const positions = [];
      const normals = [];
      const texCoords = [];
      const indices = [];

      const radius = 1;
      const stacks = 32;
      const slices = 32;

      for (let i = 0; i <= stacks; i++) {
        const phi = (Math.PI * i) / stacks;
        for (let j = 0; j <= slices; j++) {
          const theta = (2 * Math.PI * j) / slices;

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);

          positions.push(x, y, z);
          normals.push(x, y, z);
          texCoords.push(j / slices, i / stacks);
        }
      }

      // Create indices
      for (let i = 0; i < stacks; i++) {
        for (let j = 0; j < slices; j++) {
          const first = i * (slices + 1) + j;
          const second = first + slices + 1;

          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      // Create buffers
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW,
      );

      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
      );

      // Get attribute and uniform locations
      const positionLocation = gl.getAttribLocation(program, "aPosition");
      const normalLocation = gl.getAttribLocation(program, "aNormal");
      const timeLocation = gl.getUniformLocation(program, "uTime");
      const mouseLocation = gl.getUniformLocation(program, "uMouse");

      // Animation loop
      let startTime = Date.now();
      const animate = () => {
        const time = (Date.now() - startTime) * 0.001;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(program);

        // Bind position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        // Bind normal buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        // Set uniforms
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);

        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        this.animationIds.push(requestAnimationFrame(animate));
      };

      animate();
      canvas.classList.add("loaded");
      resolve();
    });
  }

  createParticleSystem() {
    return new Promise((resolve) => {
      const canvas = this.createElement("canvas", "particle-canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 100;

      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          color: this.getRandomColor(),
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

          // Draw particle
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Draw connections
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) +
                Math.pow(particle.y - other.y, 2),
            );

            if (distance < 100) {
              const opacity = Math.max(0, 1 - distance / 100);
              ctx.strokeStyle = `rgba(74, 144, 226, ${opacity * 0.3})`;
              ctx.globalAlpha = opacity * 0.3;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        this.animationIds.push(requestAnimationFrame(animate));
      };

      animate();
      resolve();
    });
  }

  createNeuralNetwork() {
    return new Promise((resolve) => {
      const canvas = this.createElement("canvas", "neural-network");
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const nodes = [];
      const connections = [];
      const layers = 3;
      const nodesPerLayer = 8;

      // Create nodes in layers
      for (let layer = 0; layer < layers; layer++) {
        for (let node = 0; node < nodesPerLayer; node++) {
          nodes.push({
            x: (canvas.width / (layers + 1)) * (layer + 1),
            y: (canvas.height / (nodesPerLayer + 1)) * (node + 1),
            size: Math.random() * 8 + 4,
            activity: Math.random(),
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }

      // Create connections between layers
      for (let i = 0; i < nodes.length - nodesPerLayer; i++) {
        if (Math.floor(i / nodesPerLayer) < layers - 1) {
          for (let j = 0; j < nodesPerLayer; j++) {
            const targetIndex = i + nodesPerLayer + j;
            if (targetIndex < nodes.length && Math.random() < 0.6) {
              connections.push({
                from: nodes[i],
                to: nodes[targetIndex],
                weight: Math.random(),
                activity: 0,
              });
            }
          }
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Animate connections
        connections.forEach((conn) => {
          conn.activity += (Math.random() - 0.5) * 0.1;
          conn.activity = Math.max(0, Math.min(1, conn.activity));

          const gradient = ctx.createLinearGradient(
            conn.from.x,
            conn.from.y,
            conn.to.x,
            conn.to.y,
          );

          const alpha = conn.activity * 0.5 + 0.1;
          gradient.addColorStop(0, `rgba(142, 68, 173, ${alpha})`);
          gradient.addColorStop(1, `rgba(74, 144, 226, ${alpha})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = conn.weight * 3;
          ctx.beginPath();
          ctx.moveTo(conn.from.x, conn.from.y);
          ctx.lineTo(conn.to.x, conn.to.y);
          ctx.stroke();
        });

        // Animate nodes
        nodes.forEach((node) => {
          node.pulse += 0.05;
          node.activity += (Math.random() - 0.5) * 0.05;
          node.activity = Math.max(0, Math.min(1, node.activity));

          const pulseSize = node.size + Math.sin(node.pulse) * 2;
          const alpha = node.activity * 0.8 + 0.2;

          const gradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            pulseSize,
          );

          gradient.addColorStop(0, `rgba(80, 200, 120, ${alpha})`);
          gradient.addColorStop(1, `rgba(80, 200, 120, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        });

        this.animationIds.push(requestAnimationFrame(animate));
      };

      animate();
      resolve();
    });
  }

  createDynamicLighting() {
    return new Promise((resolve) => {
      const lighting = this.createElement("div", "dynamic-lighting");
      resolve();
    });
  }

  createAudioVisualizer() {
    return new Promise((resolve) => {
      const visualizer = this.createElement("div", "audio-visualizer");
      const barCount = 32;

      // Create visualizer bars
      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement("div");
        bar.className = "visualizer-bar";
        bar.style.height = "4px";
        visualizer.appendChild(bar);
      }

      // Simulate audio data
      const animateBars = () => {
        const bars = visualizer.children;
        for (let i = 0; i < bars.length; i++) {
          const frequency = Math.sin(Date.now() * 0.01 + i * 0.5);
          const intensity = Math.abs(frequency) * 50 + 5;
          bars[i].style.height = `${intensity}px`;
        }
        this.animationIds.push(requestAnimationFrame(animateBars));
      };

      animateBars();
      resolve();
    });
  }

  setupMouseInteraction() {
    const handleMouseMove = (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update dynamic lighting
      const lighting = this.container.querySelector(".dynamic-lighting");
      if (lighting) {
        lighting.style.setProperty(
          "--mouse-x",
          `${(event.clientX / window.innerWidth) * 100}%`,
        );
        lighting.style.setProperty(
          "--mouse-y",
          `${(event.clientY / window.innerHeight) * 100}%`,
        );
        lighting.classList.add("active");
      }
    };

    const handleMouseLeave = () => {
      const lighting = this.container.querySelector(".dynamic-lighting");
      if (lighting) {
        lighting.classList.remove("active");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    this.cleanup = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      this.animationIds.forEach((id) => cancelAnimationFrame(id));
    };
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    this.container.appendChild(element);
    return element;
  }

  getRandomColor() {
    const colors = [
      "rgba(74, 144, 226, 0.8)",
      "rgba(142, 68, 173, 0.8)",
      "rgba(80, 200, 120, 0.8)",
      "rgba(255, 107, 107, 0.8)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy() {
    if (this.cleanup) {
      this.cleanup();
    }
    this.animationIds.forEach((id) => cancelAnimationFrame(id));
    // Remove all created elements
    const elements = this.container.querySelectorAll(
      ".hero-canvas, .particle-canvas, .neural-network, .dynamic-lighting, .audio-visualizer",
    );
    elements.forEach((el) => el.remove());
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (header) {
    window.advancedHeroBackground = new AdvancedHeroBackground(header);
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdvancedHeroBackground;
}
