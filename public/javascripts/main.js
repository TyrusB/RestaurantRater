require.config({
  paths: {
    'jQuery': 'vendor/jquery.min',
    'jQueryUI': 'vendor/jquery-ui-1.10.4.custom.min',
    'lodash': 'vendor/lodash.underscore.min'
  },
  shim: {
    /* No need to require jQuery, it's a dependency of jQueryUi which can be imported in it's place*/
    'jQueryUI': {
      deps: ['jQuery'],
      exports: '$' 
    },
    'lodash': {
      exports: '_'
    }
  }
})