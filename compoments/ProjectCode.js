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
            border: 2px solid #333;
            background: #fff;
          }

          .mobile-nav {
            display: none;
            justify-content: space-between;
            align-items: center;
            background: #f0f4f8;
            border-bottom: 2px solid #333;
            padding: 8px 16px;
          }

          .mobile-toggle {
            background: none;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.8rem;
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
            border-bottom: 2px solid #333;
            background: #f0f4f8;
            overflow-x: auto;
          }

          .tab {
            padding: 8px 16px;
            cursor: pointer;
            border-right: 1px solid #333;
            font-size: 0.8rem;
            font-family: inherit;
            border-top: none;
            border-bottom: none;
            border-left: none;
            background: transparent;
          }

          .tab.active {
            position: relative;
            background: #fff;
            font-weight: bold;
          }

          pre {
            margin: 0;
            padding: 15px;
            max-height: 300px;
            overflow: auto;
            font-size: 0.9rem;
            line-height: 1.5;
            background: #fafafa;
            white-space: pre-wrap;
            word-break: break-all;
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
              border-right: none;
              border-bottom: 1px solid #ccc;
              text-align: left;
              width: 100%;
            }
            pre {
              font-size: 0.75rem;
              padding: 10px;
            }
          }
        </style>
        <link rel="stylesheet" href="/utils/highlight.css">

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
