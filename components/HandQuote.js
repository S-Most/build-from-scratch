class HandQuote extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const author = this.getAttribute("author") || "Unknown";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 3rem auto;
          max-width: 85%;
          position: relative;
        }

        .quote-box {
          position: relative;
          padding-inline: 4rem;
          padding-top: 2rem;
          padding-bottom: 1rem;
          background: #fff8;
          z-index: 1;
        }

        .quote-box::before {
          content: "";
          position: absolute;
          inset: -2px;
          border: 2px solid #222;
          pointer-events: none;
          filter: url(#hand-drawn-3);
          z-index: -1;
        }

        /* Notebook paper lines */
        .quote-box::after {
          rotate: -3deg;
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            transparent,
            transparent 2rem,
            rgba(0, 150, 255, 0.15) 2rem,
            rgba(0, 150, 255, 0.15) calc(2rem + 1px)
          );
          background-position: start 0.5rem;
          pointer-events: none;
        }

        .margin-line {
          rotate: -3deg;
          position: absolute;
          left: 3rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: rgba(255, 0, 0, 0.3);
        }

        .quote-text {
          font-family: 'Caveat', cursive;
          font-size: 2.2rem;
          color: #111;
          rotate: -3.5deg;
          line-height: 2.3rem;
          margin: 0;
        }

        .quote-text::before {
          content: '"';
          margin-right: 0.2rem;
        }

        .quote-text::after {
          content: '"';
          margin-left: 0.2rem;
        }

        .quote-author {
          font-family: 'Caveat', cursive;
          font-size: 1.8rem;
          color: #444;
          text-align: right;
          margin-top: 1.5rem;
          rotate: -3deg;
        }
      </style>
      <div class="quote-box">
        <div class="margin-line"></div>
        <p class="quote-text"><slot></slot></p>
        <div class="quote-author">Written by ${author}</div>
      </div>
    `;
  }
}

customElements.define("hand-quote", HandQuote);
