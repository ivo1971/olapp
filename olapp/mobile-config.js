// This section sets up some basic app metadata,
// the entire section is optional.
// source: http://docs.meteor.com/api/mobile-config.html.
App.info({
  id:          'com.ilu.olapp',
  name:        'olapp',
  version:     '0.0.1',
  description: 'OLE SJB quiz application',
});
// Set up resources such as icons and launch screens.
App.icons({
  'android_mdpi':     'icons/android_mdpi.png',    //48x48
  'android_hdpi':     'icons/android_hdpi.png',    //72X72
  'android_xhdpi':    'icons/android_xhdpi.png',   //96X96
  'android_xxhdpi':   'icons/android_xxhdpi.png',  //144X144
  'android_xxxhdpi':  'icons/android_xxxhdpi.png', //192X192
});
App.launchScreens({
  'android_mdpi_portrait':    'splash/android_mdpi_portrait.png',    // 320x470
  'android_mdpi_landscape':   'splash/android_mdpi_landscape.png',   // 470x320
  'android_hdpi_portrait':    'splash/android_hdpi_portrait.png',    // 480x640
  'android_hdpi_landscape':   'splash/android_hdpi_landscape.png',   // 640x480
  'android_xhdpi_portrait':   'splash/android_xhdpi_portrait.png',   // 720x960
  'android_xhdpi_landscape':  'splash/android_xhdpi_landscape.png',  // 960x720
  'android_xxhdpi_portrait':  'splash/android_xxhdpi_portrait.png',  // 1080x1440
  'android_xxhdpi_landscape': 'splash/android_xxhdpi_landscape.png', // 1440x1080
});
// Set PhoneGap/Cordova preferences
App.setPreference('Orientation', 'default');
