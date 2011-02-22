
(function(window, undefined) {
	$("textarea").attr("placeholder", "Enter translation...")
	$("#q").replaceWith('<input type="search" autosave="search_cache" name="q" results="10" placeholder="Search..." />')
	$('tr:first').html($('.search').remove().clone());
	$(document).bind('keydown', 'ctrl+x', function() {
		$("form.edit_tolk_locale").submit();
	});
	$(document).bind('keydown', 'ctrl+right', function() {
		chrome.extension.sendRequest({'action' : 'navigate', "url" : "https://teambox.com" + $(".next_page").attr("href")});	
	});
	$(document).bind('keydown', 'ctrl+left', function() {
		chrome.extension.sendRequest({'action' : 'navigate', "url" :"https://teambox.com" + $(".previous_page").attr("href")});
	});
	$('#head h1').append('<a class="button download" href="#">Download translation</a>');
	$('.translations tr').append('<nav><a class="button google_translate" href="#" title="Auto translates object, using Google or prediction">Auto</a><a class="button clean" href="#">Clean</a><a class="button copy" href="#">Copy</a></nav>');
	$('nav:first').remove();
	$(".button.google_translate").live("click", function(event) {
	    event.preventDefault();
	    var translation = $(this).parent().parent();
	    var phrase = translation.find(".phrase").contents()
	    						.filter(function(){ return(this.nodeType == 3); })
	    						.text()
	    						.replace(/^\W/g, "")
	    						.replace(/\s{2,}/g, "")
	    var aT = new Translate(phrase);
	    aT.search(function(result) {
	    	translation.find("textarea").val(result);
	    });
	    return false;
	});
	$(".button.copy").live("click", function(event) {
	    event.preventDefault();
	    var translation = $(this).parent().parent();
	    var phrase = translation.find(".phrase").contents()
	    						.filter(function(){ return(this.nodeType == 3); })
	    						.text()
	    						.replace(/^\W/g, "")
	    						.replace(/\s{2,}/g, "")
	    translation.find("textarea").val(phrase);
	    return false;
	});
	$(".button.clean").live("click", function(event) {
	    event.preventDefault();
	    var translation = $(this).parent().parent();
	    translation.find("textarea").val("");
	    return false;
	});
	$(".button.download").live("click", function(event) {
	    event.preventDefault();
	    var url = "https://teambox.com" + $("form").attr("action") + ".yml";
	    chrome.extension.sendRequest({'action' : 'download', "url" : url});
	    return false;
	});
	var Translate = function(wordToTranslate){
		this.rubyC = [];
		this.init(this,wordToTranslate)
	};
    Translate.prototype = {
    	init: function(self, wordToTranslate){
    		self.wordToTranslate = self.parse(wordToTranslate);
    		self.locale = $("form").attr("action").replace("/tolk/locales/", "");
    	},
		_req: function(url, callback){
			chrome.extension.sendRequest({'action' : '_req', "url" : url}, callback);
		},
		parse: function(toParse){
			var self = this;
			var ret = "";
			if (toParse.indexOf("---") == -1) {
				if (toParse.indexOf("{") !== -1) {
					ret = toParse.replace(/(%{.*?})/ig, function(text) {
						self.rubyC.push(text);
						return "<esc>"+(self.rubyC.length-1)+"</esc>";
					})

				}else{
					ret = toParse.replace(/<esc>\s<(.+)>(\d+)<\/.+>\s<\/esc>/ig, "<$1><esc>$2</esc></$1>").replace(/<esc>(\d+)<\/esc>|<esc>\s(\d+)\s<\/esc>/ig, function(text, index, indexa) {
						return self.rubyC[(index?index:indexa)];
					})
				}

			}else{

				alert("This types of phrases aren't supported!")
			}
			return ret;

		},
		search: function(callback){
			var self = this;
			this._req("https://www.googleapis.com/language/translate/v2?key=AIzaSyCqbDDq_gkCnhpiSfKnOedtJmaBZMZPdp8&format=html&q="+encodeURIComponent(this.wordToTranslate)+"&source=en&target="+this.locale, function(json) {
				var word = self.parse( JSON.parse(json).data.translations[0].translatedText );
				callback(word);
			});
		}
	}

})(window);