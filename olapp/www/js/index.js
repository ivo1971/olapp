/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
        console.log("application constructor: cordova [" + isCordovaApp + "]");
        if(isCordovaApp) {
            //wait for device ready
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } else {
            //immediately start Angular
            this.bootstrapAngular2();
        }
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        console.log("device ready");
        this.bootstrapAngular2();
    },

    // start Angular
    bootstrapAngular2: function() {
        //start Angular 2
        console.log("start Angular 2");

        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/src/build.js';

        // Fire the loading
        head.appendChild(script);
    }
};

app.initialize();