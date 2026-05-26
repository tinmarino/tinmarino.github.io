'use strict';

/*
 * WebView URL and JavaScript bridge logger.
 *
 * Use this before attempting a WebView exploit. It answers basic questions:
 * which URLs are loaded, which subresources are requested, which Java objects
 * are exposed to JavaScript, and whether console messages reveal routing state.
 */

function emit(event) {
    try { send({ kind: event.kind || 'webview-event', payload: event }); }
    catch (error) { console.log('[webview-log] send failed: ' + error); }
}

function safeString(value) {
    try {
        if (value === null || value === undefined) return '';
        return String(value);
    } catch (_) {
        return '<toString-error>';
    }
}

function hookWebView() {
    const WebView = Java.use('android.webkit.WebView');

    const addBridge = WebView.addJavascriptInterface.overload('java.lang.Object', 'java.lang.String');
    addBridge.implementation = function (object, name) {
        emit({
            kind: 'webview-js-bridge',
            name: safeString(name),
            object_class: object ? safeString(object.$className) : '<null>',
        });
        return addBridge.call(this, object, name);
    };

    const loadUrlString = WebView.loadUrl.overload('java.lang.String');
    loadUrlString.implementation = function (url) {
        emit({ kind: 'webview-load', api: 'loadUrl', url: safeString(url) });
        return loadUrlString.call(this, url);
    };

    try {
        const loadUrlHeaders = WebView.loadUrl.overload('java.lang.String', 'java.util.Map');
        loadUrlHeaders.implementation = function (url, headers) {
            emit({ kind: 'webview-load', api: 'loadUrlWithHeaders', url: safeString(url), headers: safeString(headers) });
            return loadUrlHeaders.call(this, url, headers);
        };
    } catch (_) {}

    try {
        const loadData = WebView.loadData.overload('java.lang.String', 'java.lang.String', 'java.lang.String');
        loadData.implementation = function (data, mimeType, encoding) {
            emit({ kind: 'webview-load', api: 'loadData', mime_type: safeString(mimeType), encoding: safeString(encoding), length: data ? data.length() : 0 });
            return loadData.call(this, data, mimeType, encoding);
        };
    } catch (_) {}

    try {
        const loadDataWithBaseUrl = WebView.loadDataWithBaseURL.overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String');
        loadDataWithBaseUrl.implementation = function (baseUrl, data, mimeType, encoding, historyUrl) {
            emit({ kind: 'webview-load', api: 'loadDataWithBaseURL', base_url: safeString(baseUrl), history_url: safeString(historyUrl), mime_type: safeString(mimeType), length: data ? data.length() : 0 });
            return loadDataWithBaseUrl.call(this, baseUrl, data, mimeType, encoding, historyUrl);
        };
    } catch (_) {}
}

function hookConcreteWebViewClients() {
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            try {
                if (className === 'android.webkit.WebViewClient') return;
                const Candidate = Java.use(className);
                let parent = Candidate.class.getSuperclass();
                let isWebViewClient = false;
                while (parent) {
                    if (safeString(parent.getName()) === 'android.webkit.WebViewClient') {
                        isWebViewClient = true;
                        break;
                    }
                    parent = parent.getSuperclass();
                }
                if (!isWebViewClient || !Candidate.shouldInterceptRequest) return;
                Candidate.shouldInterceptRequest.overloads.forEach(function (overload) {
                    overload.implementation = function (view, request) {
                        let url = safeString(request);
                        try { url = safeString(request.getUrl()); } catch (_) {}
                        emit({ kind: 'webview-resource', client_class: className, url });
                        return overload.apply(this, arguments);
                    };
                });
                emit({ kind: 'log', msg: 'Hooked WebViewClient ' + className });
            } catch (_) {}
        },
        onComplete: function () {
            emit({ kind: 'log', msg: 'WebViewClient enumeration complete' });
        },
    });
}

function hookConsoleMessages() {
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            try {
                if (className === 'android.webkit.WebChromeClient') return;
                const Candidate = Java.use(className);
                let parent = Candidate.class.getSuperclass();
                let isChromeClient = false;
                while (parent) {
                    if (safeString(parent.getName()) === 'android.webkit.WebChromeClient') {
                        isChromeClient = true;
                        break;
                    }
                    parent = parent.getSuperclass();
                }
                if (!isChromeClient || !Candidate.onConsoleMessage) return;
                Candidate.onConsoleMessage.overloads.forEach(function (overload) {
                    overload.implementation = function (message) {
                        try {
                            emit({
                                kind: 'webview-console',
                                chrome_class: className,
                                message: safeString(message.message()),
                                source: safeString(message.sourceId()),
                                line: message.lineNumber(),
                            });
                        } catch (_) {}
                        return overload.apply(this, arguments);
                    };
                });
            } catch (_) {}
        },
        onComplete: function () {
            emit({ kind: 'log', msg: 'WebChromeClient enumeration complete' });
        },
    });
}

Java.perform(function () {
    try { hookWebView(); emit({ kind: 'log', msg: 'WebView hooks installed' }); }
    catch (error) { emit({ kind: 'log', msg: 'WebView hook failed: ' + error }); }
    hookConcreteWebViewClients();
    hookConsoleMessages();
});
