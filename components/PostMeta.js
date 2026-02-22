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

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 2rem;
          margin-bottom: 2.5rem;
          font-family: inherit;
        }

        .meta-grid {
        background: #fff;
          position: relative;
          display: grid;
          grid-template-columns: 100px 1fr;
          border: 2px solid #0008;
        }

        .meta-grid::before {
          content: "";
          position: absolute;
          inset: -2px;
          border: 2px solid #000;
          pointer-events: none;
          filter: url(#hand-drawn);
        }

        .row {
          display: contents;
        }

        .cell {
          padding: 0.75rem 1rem;
          border-bottom: 2px solid #000;
          position: relative;
        }

        .row:not(:last-child) .cell::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #000;
          pointer-events: none;
          filter: url(#hand-drawn);
          z-index: -1;
        }

        .cell.header::before {
          content: "";
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #000;
          pointer-events: none;
          filter: url(#hand-drawn);
          z-index: -1;
        }

        .row:last-child .cell {
          border-bottom: none;
        }

        .header {
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: bold;
          color: #555;
          letter-spacing: 1px;
          border-right: 2px solid #000;
          display: flex;
          align-items: center;
        }

        .value {
          font-size: 1.1rem;
          color: #000;
        }

        .title-value {
          font-size: 1.5rem;
          text-transform: uppercase;
          font-weight: 900;
          margin: 0;

          code {
            background: black;
            color: white;
            padding-inline: .4rem;
            padding-block: .2rem;
            border-radius: 4px;
          }
        }

        .badge {
          display: inline-block;
          background: var(--underline);
          color: #fff;
          padding: 0.1rem 0.6rem;
          font-size: 0.85rem;
          text-transform: uppercase;
          position: relative;
        }

        .badge::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--underline);
          filter: url(#hand-drawn);
          z-index: -1;
        }

        .description-value {
          font-style: italic;
          color: #222;
          margin: 0;
        }
      </style>

      <svg style="display: none;">
        <filter id="hand-drawn" x="-8%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
      </svg>

      <div class="meta-grid">
        <div class="row">
          <div class="cell header">Title</div>
          <div class="cell value">
            <h1 class="title-value">${title}</h1>
          </div>
        </div>

        ${type ? `
        <div class="row">
          <div class="cell header">Type</div>
          <div class="cell value"><span class="badge">${type}</span></div>
        </div>` : ''}

        ${date ? `
        <div class="row">
          <div class="cell header">Date</div>
          <div class="cell value">${date}</div>
        </div>` : ''}

        ${description ? `
        <div class="row">
          <div class="cell header">Focus</div>
          <div class="cell value">
            <p class="description-value">${description}</p>
          </div>
        </div>` : ''}
      </div>
    `;
  }
}

customElements.define("post-meta", PostMeta);
