require("@babel/register" )( {
    presets: [ "@babel/preset-env" ],
    plugins: ["@babel/plugin-proposal-class-properties"]
} );

require.extensions['.css'] = () => {
  return;
};
require( "./src/server" );
