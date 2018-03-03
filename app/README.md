Source: http://www.codemag.com/Article/1701031/Cordova-Apps-with-Angular-and-TypeScript

1. once: sudo npm install -g cordova
2. once: cordova create app
3. once: cordova platform add browser
4. cordova run browser
5. once: cordova platform add android
6. cordova run android

The 'www' directory is empty (is not in git).
It is generated automatically when building the 'webapp' project
with Angular 5.
If the 'www' directory is missing, this will result in 'current working directory is not a Cordova-based project' errors.

A build-hook is added: when running the Angular app in a browser, the 'href base' has to be '/'. But when running it in Cordova it has to be './'. The build-hook replacces this tag in the 'index.html' file.

building and signing an apk
===========================
TODO: implement a script that takes care of all this

generate keystore:
    "C:\Program Files\Java\jre1.8.0_111\bin\keytool.exe" -genkey -v -keystore C:\Users\u0049648\olapp.keystore -alias olapp -keyalg RSA -keysize 2048 -validity 10000

build unsigned release"
    cordova build --release
    --> this results in an unsigned apk

sign application:
    "C:\Program Files\Java\jdk1.8.0_102\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\Users\u0049648\olapp.keystore C:\Users\u0049648\olapp\olapp\platforms\android\build\outputs\apk\android-release-unsigned.apk olapp

rename the apk from unsigned to signed (see debug apk name)

zipalign: (from the directory in which the apk resides)
    C:\Users\u0049648\AppData\Local\Android\sdk\build-tools\24.0.2\zipalign.exe -v 4 android-release.apk android-release.al.apk
    C:\Users\u0049648\AppData\Local\Android\sdk\build-tools\24.0.2\zipalign.exe -v 4 android-release-unsigned.apk android-release.al.apk
    
browser:
    - https://play.google.com/apps/publish (https://developers.google.com/)
    - sign in
    - upload signed and aligned apk




building a release, signing it, deploying it locally
====================================================
cd to the directory containing the APK's 

cordova build --release
"C:\Program Files\Java\jdk1.8.0_102\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\Users\u0049648\olapp.keystore C:\Users\u0049648\olapp\olapp\platforms\android\build\outputs\apk\android-release-unsigned.apk olapp
--> enter key store password
del android-release.al.apk
C:\Users\u0049648\AppData\Local\Android\sdk\build-tools\24.0.2\zipalign.exe -v 4 android-release-unsigned.apk android-release.al.apk
cordova run --release


enable debugging in release mode
================================
manually edit the android manifest: platforms\android\AndroidManifest.xml
   add 'android:debuggable="true"' as an extra attribute in the <application> element