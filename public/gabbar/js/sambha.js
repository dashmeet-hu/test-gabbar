window.Gabbar = {
    data: {},
    queue: GabbarQueue || [],
    isAnonSession: false,
    autoInitAnonSession: true,
    cookieDomain: window.location.host.split(":")[0],
    referrer: document.referrer,

    pixelUrl: function() {
        var scriptOrigin = document.getElementById('sambha').src;
        return this.extractDomain(scriptOrigin) + "/sambha/track.png";
    },
    extractDomain: function(url) {
        return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
    },
    recognize: function(id) {
        if (!id) {
            if (this.autoInitAnonSession) {

                var anonId = this.getCookie('gabbaranon');

                if (!anonId) {
                    anonId = this.generateRandomId();
                }

                this.setCookie('gabbaranon', anonId, this.cookieDomain);
                this.isAnonSession = true;
                this.assignId(anonId);

                return this;
            }
        } else {
            this.isAnonSession = false;
        }

        this.assignId(id);
        return this;
    },
    assignId: function(id) {
        this.$id = id;
        return this;
    },
    notRecognized: function() {
        return typeof this.$id == 'undefined';
    },
    generateRandomId: function() {
        var length = 48;
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';

        for (var i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)]
        };

        return result;
    },
    setCookie: function(cname, cvalue, domain) {
        var d = new Date();
        d.setTime(d.getTime() + (15 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; domain=" + domain + "; path=/";
        return this;
    },
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }

        return false;
    },
    track: function(eventToTrack, params, callback, associateEarlierAnonEvents) {
        if (this.notRecognized()) {
            return;
        }

        this.data.anonId = associateEarlierAnonEvents ? this.getCookie('gabbaranon') : null;
        this.data.eventToTrack = eventToTrack;
        this.data.params = params || {};
        this.data.params.url = window.location.href;
        this.data.params.name = document.title;
        this.data.referrer = this.referrer;

        var trackingId = this.getParametersFromUrl('utm_content', window.location.href);
        var campaignId = this.getParametersFromUrl('utm_campaign', window.location.href);

        if (campaignId && trackingId) {
            this.setCookie("utm_content", trackingId, this.cookieDomain);
            this.setCookie("utm_campaign", campaignId, this.cookieDomain);
        }

        if (this.getCookie("utm_content")) {
            this.data.params.trackingId = this.getCookie("utm_content");
        }
        if (this.getCookie("utm_campaign")) {
            this.data.params.campaignId = this.getCookie("utm_campaign");
        }

        this.makePixel(callback);

        return this;
    },
    buildUrl: function(baseUrl, urlParameters) {
        var urlToBuild = baseUrl + "?";
        for (var key in urlParameters) {
            if (urlParameters.hasOwnProperty(key)) {
                urlToBuild += key + "=" + encodeURIComponent(urlParameters[key]) + "&";
            }
        }

        return urlToBuild.slice(0, -1);
    },
    makePixel: function(callback) {
        var baseUrl = this.pixelUrl();
        var _pixelUrl = this.buildUrl(baseUrl, {
            isAnonSession : this.isAnonSession,
            id            : this.$id,
            anonId        : this.data.anonId,
            eventToTrack  : this.data.eventToTrack,
            params        : JSON.stringify(this.data.params),
            timestamp     : Date.now(),
            referrer      : this.referrer
        });

        var pixel = document.getElementById('gabbar_pixel') || document.createElement('img');
        pixel.id = "gabbar_pixel";
        pixel.src = _pixelUrl;
        pixel.style = "display: none;";
        document.body.appendChild(pixel);

        if (callback) {
            callback();
        }

        return this;
    },
    register: function(customer, id, callback) {
        if (!customer) {
            return;
        }

        Gabbar.recognize(id);
        Gabbar.track('_Register', customer, callback, true);

        return this;
    },
    login: function(customer, id, callback) {
        if (!customer) {
            return;
        }

        Gabbar.recognize(id);
        Gabbar.track('Login', customer, callback, true);

        return this;
    },
    captureLead: function(lead, callback) {
        Gabbar.track('_Lead', lead, callback);
    },
    processQueue: function() {
        for (var i = 0; i < this.queue.length; i++) {
            var _event = this.queue[i];
            switch (_event._action) {
                case 'recognize':
                    this.recognize(_event._args.id);
                    break;
                case 'track':
                    this.track(_event._args.eventToTrack, _event._args.params, _event._args.callback, _event._args.associateEarlierAnonEvents);
                    break;
                case 'login':
                    this.login(_event._args.customer, _event._args.id, _event._args.callback);
                    break;
                case 'register':
                    this.register(_event._args.customer, _event._args.id, _event._args.callback);
                    break;
                case 'captureLead':
                    this.captureLead(_event._args.lead, _event._args.callback);
                    break;
                default:
                    break;
            }
        }
    },
    getParametersFromUrl: function(name, url) {
        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");

        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);

        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
};
Gabbar.processQueue();