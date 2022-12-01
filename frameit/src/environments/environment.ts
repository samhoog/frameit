// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'movie-guessing-game',
    appId: '1:1031584268526:web:5c3e9893af622889ccf3ff',
    databaseURL: 'https://movie-guessing-game-default-rtdb.firebaseio.com',
    storageBucket: 'movie-guessing-game.appspot.com',
    locationId: 'us-east1',
    apiKey: 'AIzaSyCV7oAigSnfxjXl1xH-T_qCtmnNpsltV9s',
    authDomain: 'movie-guessing-game.firebaseapp.com',
    messagingSenderId: '1031584268526',
    measurementId: 'G-39FYKBFWHN',
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
