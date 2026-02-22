import { highlight } from "../utils/highlight.js";

class ProjectCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      files: [],
      activeFile: 0,
      contents: {},
      isMenuOpen: false,
    };
  }

  async connectedCallback() {
    const fileNames = this.getAttribute("files").split(",");
    const basePath = this.getAttribute("base-path") || "";

    try {
      const fetches = fileNames.map(async (name) => {
        const response = await fetch(`${basePath}tabs/${name}`);
        if (!response.ok) throw new Error(`Could not load ${name}`);
        const text = await response.text();
        this.state.contents[name] = text;
      });

      await Promise.all(fetches);
      this.state.files = fileNames;
    } catch (err) {
      console.error("Failed to fetch tabs files", err);
    }

    this.render();
  }

  render() {
    const { files, activeFile, contents, isMenuOpen } = this.state;
    const hideResult = this.getAttribute("hide-result") === "true";
    const isResultTab = !hideResult && activeFile === files.length;
    const activeLabel = isResultTab ? "Result" : files[activeFile];

    this.shadowRoot.innerHTML = `
        <style>
        * {
          box-sizing: border-box;
        }
          :host {
            display: block;
            margin-top: 1rem;
            margin-bottom: 2rem;
            font-family: 'JetBrains Mono', monospace;
          }

          .container {
            background: #fff;
            position: relative;
            z-index: 0;
          }

          .container::before {
            content: "";
            position: absolute;
            inset: -2px;
            border: 2px solid #333;
            pointer-events: none;
            filter: url(#hand-drawn);
            z-index: -1;
          }

          .mobile-nav {
            display: none;
            justify-content: space-between;
            align-items: center;
            background: #f0f4f8;
            padding: 8px 16px;
            position: relative;
            z-index: 1;
          }

          .mobile-nav::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #333;
            pointer-events: none;
            filter: url(#hand-drawn);
            z-index: -1;
          }

          .mobile-toggle {
            background: none;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.8rem;
            position: relative;
            z-index: 1;
          }

          .mobile-toggle::before {
            content: "";
            position: absolute;
            inset: 0;
            border: 1px solid #333;
            border-radius: 4px;
            pointer-events: none;
            filter: url(#hand-drawn);
            z-index: -1;
          }

          .hamburger {
            width: 16px;
            height: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .hamburger span {
            display: block;
            height: 2px;
            background: #333;
            width: 100%;
          }

          .tab-bar {
            display: flex;
            gap: 2px;
            background: #f0f4f8;
            overflow-x: auto;
            overflow-y: hidden;
            position: relative;
            z-index: 1;
          }

          .tab-bar::after {
            content: "";
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            height: 2px;
            background: #333;
            pointer-events: none;
            filter: url(#hand-drawn);
            z-index: -1;
          }

          .tab {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 0.8rem;
            font-family: inherit;
            border: none;
            background: transparent;
            position: relative;
            z-index: 1;
          }

          .tab::after {
            content: "";
            position: absolute;
            right: -1px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: #333;
            pointer-events: none;
            filter: url(#hand-drawn);
            z-index: 2;
          }

          .tab.active {
            background: #fff;
            font-weight: bold;
          }

          pre {
            margin: 0;
            padding: 15px 15px 15px 0; /* Align with blue lines */
            max-height: 400px;
            overflow: auto;
            font-size: 0.9rem;

            /* Lined Paper styling */
            line-height: 1.5rem;
            background-color: #fafafa;
            background-image:
                linear-gradient(90deg, transparent 38px, #ff8c8c 38px, #ff8c8c 40px, transparent 40px),
                linear-gradient(to bottom, transparent calc(1.5rem - 1px), #a3d5ff calc(1.5rem - 1px));
            background-size: 100% 1.5rem;
            background-attachment: local;
            background-position: left top, left 10px;

            white-space: pre; /* No wrapping on lined paper */
            word-break: break-all;
            color: #000;
            position: relative;
            z-index: 1;
            counter-reset: line;
          }

          .line-num::before {
            counter-increment: line;
            content: counter(line);
            display: inline-block;
            width: 30px;
            text-align: right;
            margin-right: 15px;
            color: #999;
            user-select: none;
          }

          #output {
            position: relative;
            z-index: 1;
          }

          .container ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .container ::-webkit-scrollbar-thumb {
            background: #333;
            border: 2px solid #fff;
          }

          @media (max-width: 600px) {
            .mobile-nav {
              display: flex;
            }
            .tab-bar {
              display: none;
              flex-direction: column;
            }
            .tab-bar.open {
              display: flex;
            }
            .tab {
              text-align: left;
              width: 100%;
            }
            .tab::after {
              display: none;
            }
            .tab::before {
              content: "";
              position: absolute;
              bottom: -1px;
              left: 0;
              right: 0;
              height: 1px;
              background: #ccc;
              pointer-events: none;
              filter: url(#hand-drawn);
              z-index: 1;
            }
            pre {
              font-size: 0.75rem;
              padding: 10px;
            }
          }
        </style>
        <link rel="stylesheet" href="/utils/highlight.css">

        <!-- local SVG filter definition so it applies inside the shadow DOM -->
        <svg style="display: none;">
          <filter id="hand-drawn" x="-8%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </svg>

        <div class="container">
          <div class="mobile-nav">
             <span style="font-size: 0.8rem; font-weight: bold;">${activeLabel}</span>
             <button class="mobile-toggle" aria-label="Toggle menu">
               <div class="hamburger">
                 <span></span><span></span><span></span>
               </div>
               Menu
             </button>
          </div>
          <div class="tab-bar ${isMenuOpen ? 'open' : ''}">
            ${files
        .map(
          (f, i) => `
              <button class="tab ${i === activeFile ? "active" : ""
            }" data-index="${i}">
                ${f}
              </button>
            `
        )
        .join("")}
            ${hideResult ? '' : `<button class="tab ${isResultTab ? "active" : ""}" data-index="${files.length}">
              Result
            </button>`}
          </div>
          ${isResultTab
        ? '<iframe id="output" scrolling="no" style="width: 100%; height: 350px; border: none; background: white; overflow: hidden;"></iframe>'
        : `<pre><code>${highlight(
          contents[files[activeFile]] || "",
          files[activeFile].split('.').pop()
        )}</code></pre>`
      }
        </div>
      `;

    const toggleBtn = this.shadowRoot.querySelector('.mobile-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.state.isMenuOpen = !this.state.isMenuOpen;
        this.render();
      });
    }

    this.shadowRoot.querySelectorAll(".tab").forEach((tab) => {
      tab.onclick = () => {
        this.state.activeFile = parseInt(tab.dataset.index);
        this.state.isMenuOpen = false;
        this.render();
      };
    });

    if (isResultTab) {
      this.injectIframe();
    }
  }

  injectIframe() {
    const iframe = this.shadowRoot.getElementById("output");
    const basePath = this.getAttribute("base-path") || "";

    iframe.src = `${basePath}frame/index.html`;
  }
}

customElements.define("project-code", ProjectCode);
