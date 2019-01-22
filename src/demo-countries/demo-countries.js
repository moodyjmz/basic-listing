import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { idlePeriod } from '@polymer/polymer/lib/utils/async.js';

// list of countries for labels and matching to flag images
import { isoMapping } from './iso-countries.js';

/**
 * @customElement
 * @polymer
 */
class DemoCountries extends PolymerElement {

  constructor() {
    super();
    this._nextFlagsToCache = [];
    this._cachedFlags = [];
  }

  static get template() {
    return html`
      <style>
        :host #flags {
          display: none;
        }
      </style>
      <div id="flags"></div>
    `;
  }

  static get properties() {
    return {
      /**
       * Country data
       */
      data: {
        type: Object,
        notify: true,
        readOnly: true,
        value: () => {
          return [];
        }
      }
    };
  }

  ready() {
    super.ready();
    this._fetchCountries();
  }

  /**
   * Get list of countries, delay setting of data by 200ms to simulate ajax and make process async
   * @private
   */
  _fetchCountries() {
    if (!this.data.length) {
      const countries = isoMapping.map((country) => {
        const code = country['alpha-2'].toLowerCase();
        return {
          label: country.name,
          code: code,
          imgSrc: `/node_modules/flag-icon-css/flags/4x3/${code}.svg`
        };
      });
      setTimeout(() => {
        this._setData(countries); // use polymer api to set readonly property
      }, 200);
    }
  }

  /**
   * Add a country to the flag cache
   * Will check against existing flag cache and enqueue if appropriate
   * The addition is added to the next batch, debounced and added in the next idlePeriod after the next render
   * @param {Object} country {code, imgSrc}
   */
  addToFlagCache(country) {
    if(this._cachedFlags.indexOf(country.code) !== -1) {
      return;
    }
    this._nextFlagsToCache.push(country); // enqueue the addition
    this._doFlagCacheJob = Debouncer.debounce(this._doFlagCacheJob, idlePeriod, this._cacheNewFlags.bind(this));
  }

  /**
   * Perform the flag caching by appending imgs to the hidden #flags element
   * Will also update the `_cachedFlags` array; and clear `_nextFlagsToCache` upon completion
   * @private
   */
  _cacheNewFlags() {
    const frag = document.createDocumentFragment();
    this._nextFlagsToCache.forEach((country) => {
      const imgTag = document.createElement('img');
      imgTag.src = country.imgSrc;
      frag.appendChild(imgTag);
      this._cachedFlags.push(country.code);
    });
    this.$.flags.appendChild(frag);
    this._nextFlagsToCache = [];
  }
}

window.customElements.define('demo-countries', DemoCountries);
