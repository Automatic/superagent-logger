'use strict';
var url = require('url');
var querystring = require('querystring');
var superagent = require('superagent');
const log = require('debug')('superagent');

exports = module.exports = function(options) {
  if(!options) options = {};
  if(options instanceof superagent.Request)
    return attachSuperagentLogger({}, options);

  return attachSuperagentLogger.bind(null, options);
};

function attachSuperagentLogger(options, req) {
  var start = new Date().getTime();

  var uri = url.parse(req.url);
  var method = req.method;

  if(options.outgoing) {
    log(
        rightPad(uri.protocol.toUpperCase().replace(/[^\w]/g, ''), 5),
        rightPad(method.toUpperCase(), 'delete'.length),
        ' - ',
        uri.href + (req.qs ? '' : '?' + querystring.encode(req.qs)),
        '(pending)'
    );
  }

  req.on('response', function(res) {
    var now = new Date().getTime();
    var elapsed = now - start;

    log(
      rightPad(uri.protocol.toUpperCase().replace(/[^\w]/g, ''), 5),
      rightPad(method.toUpperCase(), 'delete'.length),
      res.status,
      uri.href + (req.qs ? '' : '?' + querystring.encode(req.qs)),
      '(' + elapsed + 'ms' + ')'
    );
  });
}

function rightPad(str, len) {
  var l = str.length;
  if(l < len) {
    for(var i = 0, n = len - l; i < n; i++) {
      str += ' ';
    }
  }
  return str;
}
