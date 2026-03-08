import * as THREE from 'three';

export interface LightPillarOptions {
    topColor?: string;
    bottomColor?: string;
    intensity?: number;
    rotationSpeed?: number;
    interactive?: boolean;
    glowAmount?: number;
    pillarWidth?: number;
    pillarHeight?: number;
    noiseIntensity?: number;
    mixBlendMode?: string;
    pillarRotation?: number;
    quality?: 'low' | 'medium' | 'high';
}

export class LightPillar {
    private container: HTMLElement;
    private renderer: THREE.WebGLRenderer | null = null;
    private material: THREE.ShaderMaterial | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.OrthographicCamera | null = null;
    private geometry: THREE.PlaneGeometry | null = null;
    private mouse = new THREE.Vector2(0, 0);
    private time = 0;
    private rafId: number | null = null;
    private lastTime = 0;
    private options: Required<LightPillarOptions>;

    private isVisible = false;
    private observer: IntersectionObserver | null = null;

    constructor(container: HTMLElement, options: LightPillarOptions = {}) {
        this.container = container;
        this.options = {
            topColor: options.topColor || '#5227FF',
            bottomColor: options.bottomColor || '#FF9FFC',
            intensity: options.intensity ?? 0.8,
            rotationSpeed: options.rotationSpeed ?? 0.2, // Slower for elegance
            interactive: options.interactive ?? false,
            glowAmount: options.glowAmount ?? 0.003,
            pillarWidth: options.pillarWidth ?? 2.5,
            pillarHeight: options.pillarHeight ?? 0.3,
            noiseIntensity: options.noiseIntensity ?? 0.4,
            mixBlendMode: options.mixBlendMode || 'screen',
            pillarRotation: options.pillarRotation ?? 15,
            quality: options.quality || 'medium' // Default to medium for performance
        };

        this.init();
        this.setupObserver();
    }

    private setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) {
                    this.lastTime = performance.now();
                    this.animate(this.lastTime);
                } else if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            });
        }, { threshold: 0.05 });
        this.observer.observe(this.container);
    }

    private init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Optimized Quality Settings
        const qualitySettings = {
            low: { iterations: 20, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.8 },
            medium: { iterations: 35, waveIterations: 2, pixelRatio: 0.7, precision: 'mediump', stepMultiplier: 1.5 },
            high: {
                iterations: 60,
                waveIterations: 3,
                pixelRatio: Math.min(window.devicePixelRatio, 1.0),
                precision: 'highp',
                stepMultiplier: 1.2
            }
        };

        const settings = qualitySettings[this.options.quality] || qualitySettings.medium;

        try {
            this.renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true,
                powerPreference: 'low-power', // Optimized for power
                precision: settings.precision as any,
                stencil: false,
                depth: false
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(settings.pixelRatio);
            this.container.appendChild(this.renderer.domElement);
        } catch (e) {
            console.error('WebGL not supported', e);
            return;
        }

        const parseColor = (hex: string) => {
            const color = new THREE.Color(hex);
            return new THREE.Vector3(color.r, color.g, color.b);
        };

        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      void main() {
        // Shift uv to center the effect
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 150.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);
        
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        
        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

        const pillarRotRad = (this.options.pillarRotation * Math.PI) / 180;
        const waveSin = Math.sin(0.4);
        const waveCos = Math.cos(0.4);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: this.mouse },
                uTopColor: { value: parseColor(this.options.topColor) },
                uBottomColor: { value: parseColor(this.options.bottomColor) },
                uIntensity: { value: this.options.intensity },
                uInteractive: { value: this.options.interactive },
                uGlowAmount: { value: this.options.glowAmount },
                uPillarWidth: { value: this.options.pillarWidth },
                uPillarHeight: { value: this.options.pillarHeight },
                uNoiseIntensity: { value: this.options.noiseIntensity },
                uRotCos: { value: 1.0 },
                uRotSin: { value: 0.0 },
                uPillarRotCos: { value: Math.cos(pillarRotRad) },
                uPillarRotSin: { value: Math.sin(pillarRotRad) },
                uPillarRotSinToCos: { value: Math.cos(pillarRotRad) },
                uWaveSin: { value: waveSin },
                uWaveCos: { value: waveCos }
            },
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        this.geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(mesh);

        if (this.options.interactive) {
            this.container.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        }

        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });

        // Removed immediate animate call, now handled by Observer
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.isVisible) return;
        const rect = this.container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.mouse.set(x, y);
    }

    private handleResize() {
        if (!this.renderer || !this.material || !this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.renderer.setSize(width, height);
        this.material.uniforms.uResolution.value.set(width, height);
    }

    private animate(currentTime: number) {
        if (!this.isVisible || !this.material || !this.renderer || !this.scene || !this.camera) return;

        this.rafId = requestAnimationFrame(this.animate.bind(this));

        const deltaTime = currentTime - this.lastTime;
        const targetFPS = 60;
        const frameTime = 1000 / targetFPS;

        if (deltaTime >= frameTime) {
            this.time += 0.016 * this.options.rotationSpeed;
            this.material.uniforms.uTime.value = this.time;
            this.material.uniforms.uRotCos.value = Math.cos(this.time * 0.3);
            this.material.uniforms.uRotSin.value = Math.sin(this.time * 0.3);
            this.renderer.render(this.scene, this.camera);
            this.lastTime = currentTime - (deltaTime % frameTime);
        }
    }

    public destroy() {
        window.removeEventListener('resize', this.handleResize);
        if (this.options.interactive) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
        }
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            if (this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
        }
        if (this.material) {
            this.material.dispose();
        }
        if (this.geometry) {
            this.geometry.dispose();
        }
    }
}
