import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-styles/typography.js';

import '../demo-country-item/demo-country-item.js';
import '../demo-countries/demo-countries.js';

// TODO add selection persistence when filter is applied
// Either hook into iron-list and match attempted selection changes against what is in the filteredList
// and only allow visible items to change selection
// Or, persist the selected state to the item themselves - this is probably a nicer approach as it also means the
// selection state can stored and used to populate the app initially, however this would require more work
// as we would effectively ignore iron-list's built in selection system
/**
 * @customElement
 * @polymer
 */
class DemoApp extends PolymerElement {

  constructor() {
    super();
    /**
     * Observed value to increment when we wish to force a render update
     * @type {number}
     * @private
     */
    this._renderTracker = 0;
    /**
     * Current filter value
     * @type {?String}
     * @private
     */
    this._filterValue = undefined;
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host #app-holder {
          display: flex;
          padding: 20px;
        }
        :host .col {
        width: 50%;
        }
        :host iron-list {
          height: 500px;
          width: 100%;
        }
        :host .selected-header {
          @apply --paper-font-headline;
          margin-left: 10px;
          display: block;
          padding: 25px 0 5px 0;
        }
      </style>
      <div id="app-holder">
        <div class="col">
          <paper-input on-value-changed="_filterChanged" placeholder="Filter countries"></paper-input>
          <iron-list id="countries-list" items="[[filteredCountries]]" selected-items="{{selectedCountries}}" on-country-flag-loaded="_addFlag" multi-selection selection-enabled>
          
            <template>
              <demo-country-item
                tabindex$="[[tabIndex]]"
                class$="[[_computedClass(selected)]]"
                render-track="[[_renderTracker]]"
                text-filter="[[_filterValue]]"
                data="[[item]]">
              </demo-country-item>
            </template>
          
          </iron-list>
        </div>
        <div class="col">
          <span class="selected-header">[[_getSelectedHeader(selectedCountries.length)]]</span>
          <iron-list items="[[selectedCountries]]">
          
            <template>
              <demo-country-item
                tabindex$="[[tabIndex]]"
                data="[[item]]">
              </demo-country-item>
            </template>
          
          </iron-list>
        </div>
      </div>

      <demo-countries id="countries" data="{{countryData}}"></demo-countries>
    `;
  }

  static get properties() {
    return {
      /**
       * Array of selected countries
       */
      selectedCountries: {
        type: Object
      },
      /**
       * Source list of countries
       */
      countryData: {
        type: Object,
        observer: '_countryDataHandler'
      },
      /**
       * Filtered list of countries, ie after text filter applied
       */
      filteredCountries: {
        type: Object
      },
      debounceRate: {
        type: Number,
        value 200
      }
    }
  }

  /**
   * Add a flag to country flag cache
   * @param {Object} e event fired by list item `country-flag-loaded`
   * @private
   */
  _addFlag(e) {
    this.$.countries.addToFlagCache(e.detail);
  }

  /**
   * Determine classes for the item
   * @param {Boolean} isSelected selected state as determined by iron-list
   * @returns {string} concatenated class list
   * @private
   */
  _computedClass(isSelected) {
    let classes = 'item';
    if (isSelected) {
      classes += ' selected';
    }
    return classes;
  }

  /**
   * Observer to handle receiving country data
   * Sets to `filteredCountries`
   * @private
   */
  _countryDataHandler() {
    this.filteredCountries = this.countryData;
  }

  /**
   * Coupled to input instance - debounces call to `runFilter`
   * @param {Object} e input value change
   * @private
   */
  _filterChanged(e) {
    this._filterJob = Debouncer.debounce(this._filterJob,
      timeOut.after(this.debounceRate), () => {
        this._runFilter(e.detail.value);
      }
    );
  }

  /**
   * Rebuilds `filteredCountries` with countries matching filter
   * @param {String} val filter value
   * @private
   */
  _runFilter(val) {
    const filterRegExp = new RegExp(val.replace(/(\W)/g, '\\$1'), 'i');
    this._filterValue = val.toLowerCase();
    this.filteredCountries = this.countryData.filter((item) => {
      return filterRegExp.test(item.label);
    });
    // Ensure all items update as we aren't using Polymer array API to update
    // Also elements could have other actions performed on them that won't be affected by data API
    this._renderTracker++;
  }

  /**
   * Build selected countries header
   * @param {Number} len selected items length
   * @returns {string} Selected countries header
   * @private
   */
  _getSelectedHeader(len) {
      let str = 'Selected ';
      str += (len >= 1 ? (len === 1 ? 'Country' : `Countries(${len})`) : 'Countries');
      return str;
  }
}

window.customElements.define('demo-app', DemoApp);
