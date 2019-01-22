import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js';

export class DemoCountryItem extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
        :host [part=list-item] {
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          font-size: 16px;
          padding: 10px;
          display: flex;
          align-items: center;
        }

        :host(:focus) {
          background: lightsteelblue;
          outline: none;
        }
        :host(.selected) {
          color: darkviolet;
        }
        :host iron-image {
          height: 15px;
          margin-right: 7px;
          background-size: contain;
          background-position: 50%;
          background-repeat: no-repeat;
          position: relative;
          display: inline-block;
          width: 1.33em;
          line-height: 1em;
        }
        :host [part=highlighted] {
          color: mediumvioletred;
        }
      </style>
      <div part="list-item">
        <iron-image src="[[img]]"></iron-image>
        <div id="label"></div>
      </div>


    `;
  }

  static get properties() {
    return {
      /**
       * Item data object
       */
      data: {
        type: Object
      },
      renderTrack: {
        type: Number
      },
      textFilter: {
        type: String
      }
    };
  }

  static get observers() {
    return [
      '_dataChangedHandler(data, renderTrack)'
    ];
  }

  _dataChangedHandler() {
    if (!this.data) {
      return;
    }
    const item = this.data;
    this._updateLabel();
    this.img = item.imgSrc;
    // to avoid lots of unneeded events, add a meta field to the object
    // this way, the event to cache the flag image is only fired once
    if(!item.meta) {
      /**
       * @event country-flag-loaded
       * Fired when data is changed and a country flag is known
       * {imgSrc, code}
       */
      this.dispatchEvent(new CustomEvent('country-flag-loaded', {
        detail: {
          imgSrc: this.img,
          code: item.code
        },
        bubbles: true
      }));
      item.meta = {
        flagLoaded: true
      };
    }

  }

  _updateLabel() {
    const filter = this.textFilter;
    let str = this.data.label;
    if (filter) {
      const label = str;
      const lcLabel = label.toLowerCase();
      const index = lcLabel.indexOf(filter);
      if (index !== -1) {
        const filterLength = filter.length;
        const match = label.substr(index, filterLength);
        const start = label.substr(0, index);
        const end = label.substr(index + filterLength);
        str = `${start}<span part="highlighted">${match}</span>${end}`;
      }
    }
    this.$.label.innerHTML = str;
  }
}

window.customElements.define('demo-country-item', DemoCountryItem);
