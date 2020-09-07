
const isString = require("./isString.js"),
    error = require("./error.js");

/**
 * Transform xml into a document
 * @function parseXML
 * @param {string} data 
 * @param {string} type 
 * @returns {Document}
 */
module.exports = function parseXML(data, type) {

    var xml, tmp;

    if (!data || !isString(data)) {
        return null;
    }

    // Support: IE9
    try {
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, type || "text/xml");
    } 
    catch (thrownError) {
        error(thrownError);
        xml = undefined;
    }

    if (!xml || xml.getElementsByTagName("parsererror").length) {
        throw new Error("Invalid XML: " + data);
    }

    return xml;
};