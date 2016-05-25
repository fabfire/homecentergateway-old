// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var init = require('./init');

'use strict';

var express = require('express');
var config = require('../config');
var gatekeeper = require('./gatekeeper');

// [START setup]
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

function extractProfile(profile) {
    var imageUrl = '', email = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    if (profile.emails && profile.emails.length) {
        email = profile.emails[0].value;
    }
    return {
        id: profile.id,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: email,
        image: imageUrl
    };
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new GoogleStrategy({
    clientID: '157258009673-9cuuotu5oeai1i6980qs68l0e38196rq.apps.googleusercontent.com',
    clientSecret: 'RS5AUtO8usxM2FMDX-whjWDN',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    accessType: 'offline'
}, function (accessToken, refreshToken, profile, cb) {
    var prof = extractProfile(profile);
    if (prof.email && gatekeeper.isAllowed(prof.email)) {
        // Extract the minimal profile information we need from the profile object
        // provided by Google
        cb(null, prof);
    }
    else {
        cb(null, false);
    }
}));

// serialize user into the session
init();
// [END setup]

var router = express.Router();

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired(req, res, next) {
    if (!req.user) {
        req.session.oauth2return = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables(req, res, next) {
    res.locals.profile = req.user;
    res.locals.login = '/auth/login?return=' +
        encodeURIComponent(req.originalUrl);
    res.locals.logout = '/auth/logout?return=' +
        encodeURIComponent(req.originalUrl);
    next();
}
// [END middleware]

// Begins the authorization flow. The user will be redirected to Google where
// they can authorize the application to have access to their basic profile
// information. Upon approval the user is redirected to `/auth/google/callback`.
// If the `return` query parameter is specified when sending a user to this URL
// then they will be redirected to that URL when the flow is finished.
// [START authorize]
router.get(
    // Login url
    '/auth/login',

    // Save the url of the user's current page so the app can redirect back to
    // it after authorization
    function (req, res, next) {
        if (req.query.return) {
            req.session.oauth2return = req.query.return;
        }
        next();
    },

    // Start OAuth 2 flow using Passport.js
    passport.authenticate('google', { scope: ['email', 'profile'] })
);
// [END authorize]

// [START callback]
router.get(
    // OAuth 2 callback url. Use this url to configure your OAuth client in the
    // Google Developers console
    '/auth/google/callback',

    // Finish OAuth 2 flow using Passport.js
    passport.authenticate('google', { failureRedirect: '/401.html' }),
    
    // Redirect back to the original page, if any
    function (req, res) {
        console.log('res', req.isAuthenticated());
        var redirect = req.session.oauth2return || '/';
        delete req.session.oauth2return;
        res.redirect(redirect);
    }
);
// [END callback]

// Deletes the user's credentials and profile from the session.
// This does not revoke any active tokens.
router.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = {
    extractProfile: extractProfile,
    router: router,
    required: authRequired,
    template: addTemplateVariables
};