class HandAnnotation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.text = this.getAttribute("text") || "";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline;
          position: relative;
          --color: #e74c3c;
        }

        .word {
          position: relative;
          display: inline-block;
          font-weight: bold;
          color: var(--color);
          padding: 2px 6px;
          anchor-name: --annotation-word;
        }

        .highlight-circle {
          position: absolute;
          inset: -6px -12px;
          width: calc(100% + 24px);
          height: calc(100% + 12px);
          pointer-events: none;
          overflow: visible;
        }

        .highlight-circle path {
          fill: none;
          stroke: var(--color);
          stroke-width: 2;
          filter: url(#hand-drawn);
        }

        .annotation-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 10;
        }

        .annotation-text {
          position: absolute;
          font-family: 'Caveat';
          color: var(--color);
          font-weight: bold;
          font-size: 1.5rem;
          width: min-content;
          max-width: 100px;
          line-height: 1.2;
          text-align: center;
          filter: url(#hand-drawn-3);
          rotate: -8deg;
        }

        svg.connector {
          position: absolute;
          top: 0;
          left: 0;
          width: 10px;
          height: 10px;
          overflow: visible;
          pointer-events: none;
        }

        svg.connector path {
          stroke: var(--color);
          stroke-width: 1.5;
          fill: none;
          filter: url(#hand-drawn);
          opacity: 0.8;
        }

        @media (max-width: 1100px) {
           .annotation-container {
             display: none;
             position: absolute;
             position-anchor: --annotation-word;
             top: anchor(top);
             left: anchor(center);
             transform: translate(-50%, calc(-100% - 10px));
             margin-top: 0;
             z-index: 20;
             width: auto;
             height: auto;
             filter: drop-shadow(0 4px 4px rgba(0,0,0,0.15));
           }

           :host(.active) .annotation-container {
             display: flex;
             flex-direction: column;
             align-items: center;
           }

           .annotation-text {
             position: relative;
             font-size: 1.25rem;
             padding: 8px 16px;
             text-align: center;
             rotate: -1.5deg;
             width: max-content;
             filter: none;
             color: var(--color);
             z-index: 1;
           }

           .annotation-text::before {
             content: "";
             position: absolute;
             inset: 0;
             background: #f0faffff;
             border: 2px solid var(--color);
             pointer-events: none;
             filter: url(#hand-drawn-3);
             z-index: -1;
           }

           .annotation-text::after {
             content: "";
             position: absolute;
             bottom: -6px;
             left: 50%;
             margin-left: -7px;
             width: 12px;
             height: 12px;
             background: #fffdf0;
             border-bottom: 2px solid var(--color);
             border-right: 2px solid var(--color);
             rotate: 45deg;
             pointer-events: none;
             filter: url(#hand-drawn-3);
             z-index: -1;
           }

           svg.connector {
             display: none;
           }
        }
      </style>

      <!-- Local SVG filter definition so it applies inside the shadow DOM -->
      <svg style="display: none;">
        <filter id="hand-drawn" x="-8%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5"></feDisplacementMap>
        </filter>
        <filter id="hand-drawn-3" x="-8%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"></feDisplacementMap>
        </filter>
        <filter id="hand-drawn-5" x="-8%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5"></feDisplacementMap>
        </filter>
      </svg>

      ${(() => {
        const hash = this.text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rotation = (hash % 21) - 10;
        return `
      <span class="word">
        <svg class="highlight-circle" preserveAspectRatio="none" viewBox="0 0 100 100" style="rotate: ${rotation}deg;">
           <!-- Hand drawn ellipse approximation, pushed closer to the edges of the 100x100 viewBox -->
           <path d="M 5,50 Q 15,5 50,5 T 95,50 T 50,95 T 5,50 Q 5,25 15,15" vector-effect="non-scaling-stroke"></path>
        </svg>
        <slot></slot>
      </span>`;
      })()}
      <div class="annotation-container">
        <svg class="connector"><path d=""></path></svg>
        <div class="annotation-text">${this.text}</div>
      </div>
    `;

    this.updateLayout = this.updateLayout.bind(this);
    this.toggleMobileActive = this.toggleMobileActive.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    window.addEventListener("resize", this.updateLayout);

    const wordSpan = this.shadowRoot.querySelector(".word");
    wordSpan.addEventListener("click", this.toggleMobileActive);
    document.addEventListener("click", this.handleOutsideClick);

    setTimeout(this.updateLayout, 100);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.updateLayout);
    document.removeEventListener("click", this.handleOutsideClick);
  }

  toggleMobileActive(e) {
    if (window.innerWidth <= 1100) {
      e.stopPropagation();
      this.classList.toggle("active");
    }
  }

  handleOutsideClick(e) {
    if (window.innerWidth <= 1100 && this.classList.contains("active")) {
      if (!this.contains(e.target)) {
        this.classList.remove("active");
      }
    }
  }

  updateLayout() {
    if (window.innerWidth <= 1100) {
      const textDiv = this.shadowRoot.querySelector(".annotation-text");
      textDiv.style.left = '';
      textDiv.style.right = '';
      textDiv.style.top = '';
      return;
    }

    this.classList.remove("active");

    const wordSpan = this.shadowRoot.querySelector(".word");
    const textDiv = this.shadowRoot.querySelector(".annotation-text");
    const path = this.shadowRoot.querySelector("svg.connector path");

    const wordRect = wordSpan.getBoundingClientRect();
    const isLeft = (wordRect.left + wordRect.width / 2) < (window.innerWidth / 2);

    let startX, startY, endX, endY, cpX, cpY;

    if (isLeft) {
      textDiv.style.right = "auto";
      textDiv.style.top = "-60px";

      const offsetLeft = wordRect.left - (textDiv.offsetWidth + 50);
      textDiv.style.left = `-${Math.max(wordRect.left - offsetLeft, 0)}px`;

      startX = wordRect.width / 2;
      startY = -10;
      endX = textDiv.offsetLeft + textDiv.offsetWidth + 5;
      endY = textDiv.offsetTop + textDiv.offsetHeight / 2;

      cpX = startX - 30;
      cpY = startY - 60;
    } else {
      textDiv.style.left = "auto";
      textDiv.style.top = "-60px";

      const spaceToRightOfWord = window.innerWidth - wordRect.right;
      const offsetRight = spaceToRightOfWord - (textDiv.offsetWidth + 150);
      textDiv.style.right = `-${Math.max((window.innerWidth - wordRect.right) - offsetRight, 0)}px`;

      startX = wordRect.width / 2;
      startY = -10;
      endX = textDiv.offsetLeft - 5;
      endY = textDiv.offsetTop + textDiv.offsetHeight / 2;

      cpX = startX + 30;
      cpY = startY - 20;
    }

    path.setAttribute("d", `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`);
  }
}

customElements.define("hand-annotation", HandAnnotation);
