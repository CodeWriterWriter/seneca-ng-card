/* Copyright (c) 2014 Richard Rodger, MIT License */
"use strict";


var _   = require('underscore')
var nid = require('nid')
var serve_static = require('serve-static')


module.exports = function( options ) {
  var seneca = this
  var plugin = 'card'


  options = seneca.util.deepextend({

  },options)
  

  seneca.add({init:plugin}, function( args, done ){
    var seneca = this

    seneca.act({
      role:'util',note:true,cmd:'list',
      key:'ng-card/list',default$:{}}, function(err,list){

        _.each( list, function(item) {
          
          seneca.act({role:item.plugin,spec:'web'},function(err,spec){
            if(err) return done(err);

            var serve = serve_static( spec.public )
            var prefix = '/content/'+spec.name

            seneca.act({role:'web',use:function(req,res,next){

              var origurl = req.url
              if( 0 == origurl.indexOf(prefix) ) {
                req.url = origurl.substring( prefix.length )
                serve(req,res,function(){
                  req.url = origurl
                  next()
                })
              }
              else return next();
            }})
          })
        })

        done()
      })
  })


  return {
    name: plugin
  }
}
