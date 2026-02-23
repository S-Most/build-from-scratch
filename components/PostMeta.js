class PostMeta extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const date = this.getAttribute("date") || "";
    const type = this.getAttribute("type") || "";
    const description = this.getAttribute("description") || "";
    const rev = Math.floor(Math.random() * 9) + 1;
    const projectNo = Math.floor(Math.random() * 9000) + 1000;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 2rem;
          margin-bottom: 2.5rem;
          font-family: inherit;
        }

        .meta-grid {
          position: relative;
          display: grid;
          grid-template-columns: 80px 1fr 80px 1fr 80px 2fr;
          gap: 2px;
        }

        .meta-grid::before {
          content: "";
          position: absolute;
          inset: -5px;
          border: 2px solid #222;
          pointer-events: none;
          filter: url(#hand-drawn-3);
          z-index: 10;
        }

        .cell {
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          position: relative;
        }

        :not(:nth-last-child(-n + 2)).cell::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #444;
          pointer-events: none;
          filter: url(#hand-drawn-3);
          z-index: 5;
        }

        .header {
        position: relative;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 800;
          color: #444;
          letter-spacing: 2px;
          justify-content: flex-start;
          align-items: flex-start;
          padding-top: 0.8rem;
        }

        .header::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-inline: 2px solid #444;
          pointer-events: none;
          background-color: hsl(360 100% 50% / 0.122);
          background-image: repeating-linear-gradient(-60deg, transparent, transparent 3px, #fff 3px, #fff 4px);
          filter: url(#hand-drawn-3);
          z-index: -1;
        }

        first-child .header::before {
          border-right: none;
        }

        .title-header { grid-column: 1; }
        .title-cell { grid-column: 2 / -1; }
        .notes-header { grid-column: 1; }
        .notes-cell { grid-column: 2 / -1; }

        .value {
          font-size: 1rem;
          color: #111;
          font-weight: 600;
        }

        .title-value {
          font-size: 1.8rem;
          text-transform: uppercase;
          font-weight: 900;
          margin: 0;
          letter-spacing: 1px;
        }

        .title-value code {
          background: #222;
          color: #fff;
          padding-inline: .4rem;
          padding-block: .2rem;
          border-radius: 2px;
          font-size: 1.5rem;
        }

        .description-value {
          font-family: 'Caveat';
          font-size: 1.8rem;
          color: #000;
          margin: 0;
          line-height: 1.2;
          letter-spacing: 1px;
          transform: rotate(-1deg);
        }

        .badge {
          display: inline-block;
          border: 2px solid #222;
          color: #222;
          padding: 0.1rem 0.6rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          font-weight: 900;
          position: relative;
          rotate: -5deg;
        }

        .badge::after {
          content: "";
          position: absolute;
          inset: -2px;
          border: 2px solid #222;
          pointer-events: none;
          filter: url(#hand-drawn-3);
        }

        @media (max-width: 850px) {
           .meta-grid {
             grid-template-columns: 80px 1fr 80px 1fr;
           }
        }

        @media (max-width: 550px) {
           .meta-grid {
             grid-template-columns: 80px 1fr;
           }
        }
      </style>

      <svg style="display: none;">
        <filter id="hand-drawn-3" x="-8%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>

      <div class="meta-grid">
        <div class="cell header title-header">Title</div>
        <div class="cell value title-cell">
          <h1 class="title-value">${title}</h1>
        </div>

        <div class="cell header">Drawn</div>
        <div class="cell value" style="font-family: 'Caveat'; font-size: 1.6rem;">S.A.</div>
        <div class="cell header">Scale</div>
        <div class="cell value">1:1</div>
        <div class="cell header">Type</div>
        <div class="cell value">${type ? `<span class="badge">${type}</span>` : 'N/A'}</div>

        <div class="cell header">Proj. No</div>
        <div class="cell value" style="font-family: monospace;">${projectNo}</div>
        <div class="cell header">Rev</div>
        <div class="cell value">${rev}</div>
        <div class="cell header">Date</div>
        <div class="cell value">${date || 'N/A'}</div>

        ${description ? `
        <div class="cell header notes-header" style="border-bottom: none;">Notes</div>
        <div class="cell value notes-cell" style="border-bottom: none;">
          <p class="description-value">${description}</p>
        </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define("post-meta", PostMeta);
