var active_session, ip, user_id, timeout = 1,url = "http://192.168.115.248:8083/", system_id = "Developer",
    auth_token = "Bearer Lrn90RnJZ+X5nVgQ9cKjrJSpgHTQtkLz3Mw1sX4B7RYnhNdy0Oqp",
    ttl = 30, counter = ttl, ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7},
    SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4},
    CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4};

function getUserIP(onNewIP) {
    //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;
    ipFound = false;

    function iterateIP(ip) {
        if (!localIPs[ip] && ip != '0.0.0.0') onNewIP(ip);
        ipFound = true;
    }


    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (ipFound) exit;
            if (line.indexOf('IP4') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
        // An error occurred, so handle the failure to connect
    });


    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


// A helper function for string manipulation
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}




// A helper function for string manipulation
// if (!String.prototype.format) {
//     String.prototype.format = function () {
//         var args = arguments;
//         return this.replace(/{(\d+)}/g, function (match, number) {
//             return typeof args[number] != 'undefined'
//                 ? args[number]
//                 : match
//                 ;
//         });
//     };
// }




// function getCookie(name) {
//     name += "=";
//     for (var ca = decodeURIComponent(document.cookie).split(";"), n = 0; n < ca.length; n++) {
//         for (var o = ca[n]; " " == o.charAt(0);) o = o.substring(1);
//         if (0 == o.indexOf(name)) return o.substring(name.length, o.length)
//     }
//     return ""
// }

function getCookie(name) {
    name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



// function setCookie(key, value) {
//     if (value) {
//         var n = new Date;
//         n.setMinutes(n.getMinutes() + timeout), document.cookie = "{0}={1}; expires={2}".format(key, value, n.toUTCString())
//     } else document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key)
// }

function setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 1*timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
}


function _setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 1*timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
}




function __setCookie(key, value) {
    if (!value) {
        // Expire cookie
        document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(key);
        return;
    }

    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 2*timeout);
    document.cookie = "{0}={1}; expires={2}".format(key, value, dt.toUTCString());
}




function create_SID() {
    var dt = new Date().getTime();
    var sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return sid;
}
// String.prototype.format || (String.prototype.format = function () {
//     var e = arguments;
//     return this.replace(/{(\d+)}/g, function (t, n) {
//         return void 0 !== e[n] ? e[n] : t
//     })
// }),

// function create_UUID() {
//     var e = (new Date).getTime();
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
//         var n = (e + 16 * Math.random()) % 16 | 0;
//         return e = Math.floor(e / 16), ("x" == t ? n : 3 & n | 8).toString(16)
//     })
// }

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}



String.prototype.format || (String.prototype.format = function () {
    var e = arguments;
    return this.replace(/{(\d+)}/g, function (t, n) {
        return void 0 !== e[n] ? e[n] : t
    })
}), getUserIP(function (_ip) {
    ip = _ip
}), sessionFactory = {
    
    check: function () {
        var e = getCookie("uid");
        return e ? (active_session = e, console.log("Session is already opened. Token {0}".format(e))) : sessionFactory.init(user_id), !0
    }, init: function (e) {
        if (ip) {
            var flag = 0
            var t = getCookie("uid");
            var m = getCookie("sid");
            var x = getCookie("xid");
            if (user_id != e || !t) {
//                 flag=1
                

                                
                m = create_SID();
                t = create_UUID();
                
                
                if (flag==0){
                    x = create_UUID();
                    x = __setCookie("xid", x);
                    flag = 1;

                }
                
                var x = getCookie("xid");
                
                user_id = null != e ? e : t, setCookie("uid", t), session_id = null != e ? m : m,  _setCookie("sid", m), user_agent = navigator.userAgent, referer = document.location.origin, xReferer = document.location.origin;
                var n = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, x , session_id, ip, user_agent, referer, xReferer),
                    o = new XMLHttpRequest;
                return o.open("POST", "{0}session/".format(url), !0), o.setRequestHeader("Content-Type", "application/json"), o.setRequestHeader("Authorization", auth_token), o.onreadystatechange = function () {
                    4 == this.readyState && 201 == this.status ? console.log("Success: {0}: {1}".format(this.status, this.responseText)) : console.log("Error: {0}: {1}".format(this.status, this.responseText))
                }, o.send(n), !0
            }
            
            
//             if (flag != 1){
//                 m = create_SID();
//                 session_id = null != e ? m : m,  _setCookie("sid", m), user_agent = navigator.userAgent, referer = document.location.origin, xReferer = document.location.origin;
//                 var n = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, t, session_id, ip, user_agent, referer, xReferer),
//                     o = new XMLHttpRequest;
//                 return o.open("POST", "{0}session/".format(url), !0), o.setRequestHeader("Content-Type", "application/json"), o.setRequestHeader("Authorization", auth_token), o.onreadystatechange = function () {
//                     4 == this.readyState && 201 == this.status ? console.log("Success: {0}: {1}".format(this.status, this.responseText)) : console.log("Error: {0}: {1}".format(this.status, this.responseText))
//                 }, o.send(n), !0
//             }          
            
//             flag = 0
            
            
            
            setCookie("uid", t)
            _setCookie("sid",m)
        } else setTimeout(function () {
            0 != counter-- ? sessionFactory.init(user_id) : counter = ttl
        }, 1e3)
    },
    expire: function () {
        return setCookie("uid", null), user_id = null, !0
    }
}, activityFactory = {
    log: function (e, t, n, o, i, r) {
        sessionFactory.check();
        var a = getCookie("sid");
//         if (a == null){
//             a = create_SID();
//             _setCookie("sid",a)
//         }
        var s = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(a, e, t, n, o, i, r);
        var   c = new XMLHttpRequest;
        return c.open("POST", "{0}event/".format(url), !0), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Authorization", auth_token), c.onreadystatechange = function () {
            4 == this.readyState && 201 == this.status ? (_setCookie("sid", a), console.log("Token {0} did activity {1}".format(a, i))) : console.log("Activity logging failed.")
        }, c.send(s), !0
    }
};
