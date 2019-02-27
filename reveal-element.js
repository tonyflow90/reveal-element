const template = document.createElement('template');
template.innerHTML = '<style>:host {display:inline-block;} ::slotted(*){width:inherit;height:inherit;} .outer{overflow: hidden;border-radius: inherit;width:inherit;height:inherit;}.inner{border-radius: inherit;width:inherit;height:inherit;}</style><div class="outer"><div class="inner"><slot/></div></div>';

class RevealElement extends HTMLElement {

    static get observedAttributes() {
        return ['scale'];
    }

    constructor(evt) {
        super();
        this.scale = .5;
        this.inScale = 1
        this.targetScale = this.scale;
        this.elementScale = this.targetScale;
        this.attachShadow({ mode: 'open' });
        this.addEventListener('pointerout', () => {
            this.targetScale = this.scale
        })
        this.addEventListener('pointerover', () => {
            this.targetScale = .9
        })
    }

    update() {
        const outer = this.shadowRoot.querySelector('.outer')
        const inner = this.shadowRoot.querySelector('.inner')

        this.elementScale += (this.targetScale - this.elementScale) * .1
        let innerScale = 1 / this.elementScale;

        outer.style.transform = `scale(${this.elementScale.toPrecision(3)})`
        inner.style.transform = `scale(${innerScale.toPrecision(3)})`
        requestAnimationFrame(this.update.bind(this))
    }

    connectedCallback(evt) {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.update();
    }

    disconnectedCallback() {
        this.removeEventListener('pointerout')
        this.removeEventListener('pointerover')
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        switch (attr) {
            case 'scale':
                if (!isNaN(newVal))
                    this.scale = parseFloat(newVal);
                    this.targetScale = this.scale;
                    this.elementScale = this.targetScale;
                    this.dispatchEvent(new Event('pointerout'))
                break;
        }
    }
}

window.customElements.define('reveal-element', RevealElement);
