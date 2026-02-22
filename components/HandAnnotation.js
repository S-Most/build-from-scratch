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
        }
        .word {
          position: relative;
          display: inline-block;
          font-weight: bold;
          color: #e74c3c;
          padding: 2px 6px;
        //   cursor: pointer;
          anchor-name: --annotation-word;
        }

        .highlight-circle {
          position: absolute;
          inset: -6px -12px; /* Pull it outside the word's bounding box so it frames it with space */
          width: calc(100% + 24px);
          height: calc(100% + 12px);
          pointer-events: none;
          overflow: visible;
        }

        .highlight-circle path {
          fill: none;
          stroke: #e74c3c;
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
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Architects Daughter', sans-serif;
          color: #e74c3c;
          font-weight: bold;
          font-size: 1.1rem;
          width: min-content;
          max-width: 100px;
          line-height: 1.2;
          text-align: center;
          filter: url(#hand-drawn);
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
          stroke: #e74c3c;
          stroke-width: 1.5;
          fill: none;
          filter: url(#hand-drawn);
          opacity: 0.8;
        }

        @media (max-width: 1100px) {
           .annotation-container {
             display: none; /* Hidden by default entirely on mobile */
             position: absolute;
             position-anchor: --annotation-word;
             top: anchor(top);
             left: anchor(center);
             transform: translate(-50%, calc(-100% - 10px));
             margin-top: 0;
             z-index: 20;
             width: auto;
             height: auto;
           }

           /* Reveal when active */
           :host(.active) .annotation-container {
             display: flex;
             flex-direction: column;
             align-items: center;
           }

           .annotation-text {
             position: static;
             font-size: 0.85rem;
             background: rgba(255, 255, 255, 0.95);
             padding: 6px 12px;
             border-radius: 6px;
             text-align: center;
             border: 2px solid #e74c3c;
             rotate: 0deg;
             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
             width: max-content;
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

    // Attach click listeners for mobile behavior
    const wordSpan = this.shadowRoot.querySelector(".word");
    wordSpan.addEventListener("click", this.toggleMobileActive);
    document.addEventListener("click", this.handleOutsideClick);

    setTimeout(this.updateLayout, 100);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.updateLayout);

    // Clean up global click listener
    document.removeEventListener("click", this.handleOutsideClick);
  }

  toggleMobileActive(e) {
    if (window.innerWidth <= 1100) {
       e.stopPropagation(); // Prevent the document listener from immediately closing it
       this.classList.toggle("active");
    }
  }

  handleOutsideClick(e) {
    if (window.innerWidth <= 1100 && this.classList.contains("active")) {
      // If they click outside the host element, remove active class
      if (!this.contains(e.target)) {
        this.classList.remove("active");
      }
    }
  }

  updateLayout() {
    if (window.innerWidth <= 1100) {
      // Clear manual styles on mobile so Anchor Positioning takes over
      const textDiv = this.shadowRoot.querySelector(".annotation-text");
      textDiv.style.left = '';
      textDiv.style.right = '';
      textDiv.style.top = '';
      return;
    }

    // Unset active class on resize back to desktop
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
