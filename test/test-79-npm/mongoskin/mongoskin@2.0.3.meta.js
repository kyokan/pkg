"use strict";

var home = require("../home.js");

module.exports = function(stamp) {
  return {
    allow: home(stamp),
    moons: [ "mongodb@2.0" ]
  };
};
