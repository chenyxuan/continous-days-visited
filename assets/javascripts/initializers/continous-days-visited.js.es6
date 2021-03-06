import { withPluginApi } from "discourse/lib/plugin-api";

function initializeContinousDaysVisited(api) {
  // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/lib/plugin-api.js.es6
  
  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "encode",
      icon: "far-eye-slash",
      label: "composer.spoiler_ui_button_title_a",
    };
  });


  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "decode",
      icon: "far-eye",
      label: "composer.spoiler_ui_button_title_b",
    };
  });
  
  
  api.modifyClass("controller:composer", {
    actions: {
      encode() {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var input = encodeURI(this.toolbarEvent.getText());
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        this.toolbarEvent.replaceText(output);
      },
      
      decode() {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var input = this.toolbarEvent.getText();
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        
        this.toolbarEvent.replaceText(decodeURI(output));
      },
    },
  });
}

export default {
  name: "continous-days-visited",

  initialize() {
    withPluginApi("0.8.31", initializeContinousDaysVisited);
  }
};
