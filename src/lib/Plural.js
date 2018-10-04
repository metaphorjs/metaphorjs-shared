

var isPlainObject = require("metaphorjs-shared/src/func/isPlainObject.js"),
    isArray = require("metaphorjs-shared/src/func/isArray.js"),
    extend = require("metaphorjs-shared/src/func/extend.js"),
    undf = require("metaphorjs-shared/src/var/undf.js"),
    MetaphorJs = require("metaphorjs-shared/src/MetaphorJs.js");

/**
 * A storage of plural definitions
 * @class MetaphorJs.lib.Plural
 */
module.exports = MetaphorJs.lib.Plural = function(){

    var pluralDef       = function($number, $locale) {

            if ($locale === "pt_BR") {
                // temporary set a locale for brasilian
                $locale = "xbr";
            }

            if ($locale.length > 3) {
                $locale = $locale.substr(0, -$locale.lastIndexOf('_'));
            }

            switch($locale) {
                case 'bo':
                case 'dz':
                case 'id':
                case 'ja':
                case 'jv':
                case 'ka':
                case 'km':
                case 'kn':
                case 'ko':
                case 'ms':
                case 'th':
                case 'tr':
                case 'vi':
                case 'zh':
                    return 0;

                case 'af':
                case 'az':
                case 'bn':
                case 'bg':
                case 'ca':
                case 'da':
                case 'de':
                case 'el':
                case 'en':
                case 'eo':
                case 'es':
                case 'et':
                case 'eu':
                case 'fa':
                case 'fi':
                case 'fo':
                case 'fur':
                case 'fy':
                case 'gl':
                case 'gu':
                case 'ha':
                case 'he':
                case 'hu':
                case 'is':
                case 'it':
                case 'ku':
                case 'lb':
                case 'ml':
                case 'mn':
                case 'mr':
                case 'nah':
                case 'nb':
                case 'ne':
                case 'nl':
                case 'nn':
                case 'no':
                case 'om':
                case 'or':
                case 'pa':
                case 'pap':
                case 'ps':
                case 'pt':
                case 'so':
                case 'sq':
                case 'sv':
                case 'sw':
                case 'ta':
                case 'te':
                case 'tk':
                case 'ur':
                case 'zu':
                    return ($number === 1) ? 0 : 1;

                case 'am':
                case 'bh':
                case 'fil':
                case 'fr':
                case 'gun':
                case 'hi':
                case 'ln':
                case 'mg':
                case 'nso':
                case 'xbr':
                case 'ti':
                case 'wa':
                    return (($number === 0) || ($number === 1)) ? 0 : 1;

                case 'be':
                case 'bs':
                case 'hr':
                case 'ru':
                case 'sr':
                case 'uk':
                    return (($number % 10 === 1) && ($number % 100 !== 11)) ?
                           0 :
                           ((($number % 10 >= 2) && ($number % 10 <= 4) &&
                             (($number % 100 < 10) || ($number % 100 >= 20))) ? 1 : 2);

                case 'cs':
                case 'sk':
                    return ($number === 1) ? 0 : ((($number >= 2) && ($number <= 4)) ? 1 : 2);

                case 'ga':
                    return ($number === 1) ? 0 : (($number === 2) ? 1 : 2);

                case 'lt':
                    return (($number % 10 === 1) && ($number % 100 !== 11)) ?
                           0 :
                           ((($number % 10 >= 2) &&
                             (($number % 100 < 10) || ($number % 100 >= 20))) ? 1 : 2);

                case 'sl':
                    return ($number % 100 === 1) ?
                           0 :
                           (($number % 100 === 2) ?
                                1 :
                                ((($number % 100 === 3) || ($number % 100 === 4)) ? 2 : 3));

                case 'mk':
                    return ($number % 10 === 1) ? 0 : 1;

                case 'mt':
                    return ($number === 1) ?
                           0 :
                           ((($number === 0) || (($number % 100 > 1) && ($number % 100 < 11))) ?
                                1 :
                                ((($number % 100 > 10) && ($number % 100 < 20)) ? 2 : 3));

                case 'lv':
                    return ($number === 0) ? 0 : ((($number % 10 === 1) && ($number % 100 !== 11)) ? 1 : 2);

                case 'pl':
                    return ($number === 1) ?
                           0 :
                           ((($number % 10 >= 2) && ($number % 10 <= 4) &&
                             (($number % 100 < 12) || ($number % 100 > 14))) ? 1 : 2);

                case 'cy':
                    return ($number === 1) ? 0 : (($number === 2) ? 1 : ((($number === 8) || ($number === 11)) ? 2 : 3));

                case 'ro':
                    return ($number === 1) ?
                           0 :
                           ((($number === 0) || (($number % 100 > 0) && ($number % 100 < 20))) ? 1 : 2);

                case 'ar':
                    return ($number === 0) ?
                           0 :
                           (($number === 1) ?
                                1 :
                                (($number === 2) ?
                                    2 :
                                    ((($number >= 3) && ($number <= 10)) ?
                                        3 :
                                        ((($number >= 11) && ($number <= 99)) ? 4 : 5))));

                default:
                    return 0;
            }
        };


    /**
     * @method Plural
     * @constructor
     * @param {string} locale 2char locale id
     */
    var Plural = function(locale) {

        var self    = this;
        self.store  = {};
        if (locale) {
            self.locale = locale;
        }
    };

    extend(Plural.prototype, {

        store: null,
        locale: "en",

        /**
         * @method
         * @param {string} locale 2char locale id
         */
        setLocale: function(locale) {
            this.locale = locale;
        },

        /**
         * Set plural definition
         * @method
         * @param {string} key
         * @param {array|object} value {
         *  Array:<br>
         *  0: Singular form<br>
         *  1: Plural form<br>
         *  2: Second plural form<br>
         *  3: Third plural form<br>
         *  Object:<br>
         *  <int>: Respective number<br>
         *  "one": Singular form for 1<br>
         *  "negative": Negative values form<br>
         *  "other": All other
         * }
         */
        set: function(key, value) {
            var store = this.store;
            if (store[key] === undf) {
                store[key] = value;
            }
        },

        /**
         * Load plural definitions
         * @method
         * @param {object} keys {
         *  key: definition pairs; see set()
         * }
         */
        load: function(keys) {
            extend(this.store, keys, false, false);
        },

        /**
         * Get definition. If key is not found, will return -- key --
         * @method
         * @param {string} key
         * @returns {array|object|string}
         */
        get: function(key) {
            var self = this;
            return self.store[key] ||
                   (self === globalText ? '-- ' + key + ' --' : globalText.get(key));
        },

        /**
         * Get variant best suited for the number
         * @method
         * @param {string} key
         * @param {int} number
         * @returns {string}
         */
        plural: function(key, number) {
            var self    = this,
                strings = typeof key === "string" ? self.get(key): key,
                def     = pluralDef(number, self.locale);

            if (!isArray(strings)) {
                if (isPlainObject(strings)) {
                    if (strings[number]) {
                        return strings[number];
                    }
                    if (number === 1 && strings.one !== undf) {
                        return strings.one;
                    }
                    else if (number < 0 && strings.negative !== undf) {
                        return strings.negative;
                    }
                    else {
                        return strings.other;
                    }
                }
                return strings;
            }
            else {
                return strings[def];
            }
        },

        /**
         * Destroy definitions store
         * @method
         */
        $destroy: function() {
            this.store = null;
        }

    }, true, false);


    var globalText  = new Plural;

    Plural.global     = function() {
        return globalText;
    };

    return Plural;
}();
