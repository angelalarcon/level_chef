var SKMetro = {};
SKMetro.options  = {
	gutter: 1,
	beaconColor: "000000"
}


jQuery(document).ready(function(){	
	SKMetro.Plugin.getInstance().init();
});

SKMetro.Plugin = (function(){
	var instance;
	this.stuff = function(){};	
	var metroContainersData = [];
		
	var constructor = function(){							
		return {
			init: function(){
				//gather all data
				jQuery('.skmetro').each(function(indx){	
					jQuery(this).attr('data-index', indx);															

					var items = [];
					jQuery(this).find('.metro_item').each(function(dx){
						var type = jQuery(this).attr('data-type');	
						jQuery(this).attr('data-indx', dx);			
						var uid = SakuraUtils.generateUID();
						jQuery(this).attr('data-uid', uid);		
						jQuery(this).css('padding', SKMetro.options.gutter.toString());
						var thumbURL = jQuery(this).find('a').attr('href');
						var data;
						switch(type) {
						    case "image":
						        data = {thumb: thumbURL, large: jQuery(this).find('a').attr('data-imagelarge')};
						        break;
						    case "video":						    	
						        data = {thumb: thumbURL, embeded: (jQuery(this).find('iframe').length!=0)?jQuery(this).find('iframe').get(0).outerHTML:""};
						        break;
						    case "audio":						    	
						        data = {thumb: thumbURL, embeded: (jQuery(this).find('iframe').length!=0)?jQuery(this).find('iframe').get(0).outerHTML:""};
						        break;						        
						    default:
						}
						//check for metro item
						var metroHTML;
						if(jQuery(this).find('.metro-cover').length!=0){
							metroHTML = jQuery(this).find('.metro-cover').get(0).outerHTML;
						}

						//check out for caption
						var captionHTML;
						if(jQuery(this).find('.metro-caption').length!=0){
							captionHTML = jQuery(this).find('.metro-caption').get(0).outerHTML;
						}						

						jQuery(this).empty();
						jQuery(this).attr('data-isloaded', 'false');
						items.push({objectUI:jQuery(this), type: type, data: data, uid: uid, metroHTML: metroHTML, captionHTML: captionHTML});						
						jQuery(this).remove();												
					});
					var containerUI = jQuery(this).find('.skmetro_ui');
					var packContainer = containerUI.packery({
					  itemSelector: '.metro_item',
					  gutter: 0
					});	

					var packeryObj = containerUI.data('packery');                

					var loadSpinner = jQuery(this).find('.loadMoreContainer').find('img');
					var loadMoreBTN = jQuery(this).find('.skLoadMoreLink');								
					metroContainersData.push({containerUI: containerUI, items: items, loadMoreBTN: loadMoreBTN, loadSpinner: loadSpinner, indx: indx, packeryObj: packeryObj});					
					loadMoreBTN.click(function(e){
						e.preventDefault();
						jQuery(this).css('display', 'none');
						appendItems(metroContainersData[indx], parseInt(metroContainersData[indx].containerUI.parent().attr('data-loadmore')));						
					});

				});
				//init gallery
				initializeGalleries();
			}
		}
	}

	//initialize galleries
	var initializeGalleries = function(){
		for (var i = 0; i < metroContainersData.length; i++) {
			//metroContainersData[i]			
			appendItems(metroContainersData[i], parseInt(metroContainersData[i].containerUI.parent().attr('data-initialload')));				
		};
	}

	var appendItems = function(containerData, itemsNo){
		containerData.containerUI.parent().find('.skLoadMoreLink').css('display', 'none');		
		containerData.loadSpinner.css('display', 'inline-block');

		var items = containerData.items;
		var itemsToLoad = [];
		var count = 0;
		for (var i = 0; i < items.length; i++) {
			if((items[i].objectUI.attr('data-isloaded')=="false") && count<itemsNo){
				var thumbItem = new SKMetro.Plugin.ThumbItem(items[i], containerData);
				itemsToLoad.push(thumbItem);
				count++;
			}
		};

		for (var i = 0; i < itemsToLoad.length; i++) {
			if(i<itemsToLoad.length-1){
				itemsToLoad[i].next = itemsToLoad[i+1];				
			}
			if(i==itemsToLoad.length-1){
				itemsToLoad[i].setCallBack(function(){
					containerData.loadSpinner.css('display', 'none');

					/*
                    jQuery('html, body').animate({
                        scrollTop: itemsToLoad[itemsToLoad.length-1].getObjectUI().offset().top
                    }, 800);
                    */					
					//finish loading items
					for (var k = 0; k < itemsToLoad.length; k++) {
						var objUI = itemsToLoad[k].getObjectUI();

						//handle metro
						var metroHTML = itemsToLoad[k].getItem().metroHTML;
						if(metroHTML!=undefined){
							var metroUI = jQuery(metroHTML);
							var metroImg = metroUI.find('.metro-thumb');
							metroImg.bind('load', function(){
								var mUI = jQuery(this).parent();
								jQuery(this).css('left', mUI.width()/2-jQuery(this).width()/2);
								jQuery(this).css('top', mUI.height()/2-jQuery(this).height()/2);								
								mUI.css('backgroundColor', '#'+mUI.attr('data-backgroundcolor'));
								mUI.find('.metro-text').css('color', '#'+mUI.attr('data-textcolor'));
							});
							metroUI.appendTo(objUI.find('.metro_item_inside'));
							var metroDark = jQuery('<div class="metro-dark"></div>');
							metroDark.css('opacity', 0);
							metroDark.prependTo(metroUI);
						}
						//handle caption
						var captionHTML = itemsToLoad[k].getItem().captionHTML;
						if(captionHTML!=undefined){
							var captionUI = jQuery(captionHTML);
							captionUI.css('opacity', 0);
							captionUI.appendTo(objUI.find('.metro_item_inside'));
						}


						objUI.find('.metro_item_inside').css('display', 'block');																		
						containerData.containerUI.packery('appended', objUI);	

						//hover efx
						var beaconUI = objUI.find('.gr_isotope_beacon');
						var beaconRGB = SakuraUtils.hexToRgb(SKMetro.options.beaconColor);
						beaconUI.find('.beaconCircle1').css('backgroundColor', 'rgba('+beaconRGB[0]+','+beaconRGB[1]+','+beaconRGB[2]+',.4)');
						beaconUI.find('.beaconCircle2').css('backgroundColor', 'rgba('+beaconRGB[0]+','+beaconRGB[1]+','+beaconRGB[2]+',.8)');										

		                beaconUI.css('opacity', 0);
		                beaconUI.css('display', 'block');
		                objUI.hover(function(e){ 
		                	var beaconUI = jQuery(this).find('.gr_isotope_beacon')                                     
		                    beaconUI.css('left', jQuery(this).width()/2-beaconUI.width()/2);
		                    beaconUI.css('top', jQuery(this).height()/2-beaconUI.height()/2);                    
		                    TweenMax.to(beaconUI, .2, {css:{opacity: 1}, ease:Power4.EaseIn});

		                    //caption	
		                    if(jQuery(this).find('.metro-caption').length!=0){
		                    	var caption_ui = jQuery(this).find('.metro-caption');
		                    	caption_ui.css('left', 0);
		                    	caption_ui.css('top', jQuery(this).find('.metro_item_inside').height());
		                    	caption_ui.css('opacity', 1);
		                    	TweenMax.to(caption_ui, .2, {css:{top: jQuery(this).find('.metro_item_inside').height()-caption_ui.height()-5}, ease:Power4.EaseIn});
		                    }	   

		                    //if metro     
		                    if(jQuery(this).find('.metro-cover').length!=0){
		                    	TweenMax.to(jQuery(this).find('.metro-dark'), .2, {css:{opacity: 1}, ease:Power4.EaseIn});
		                    }
		                              

		                }, function(e){
		                	var beaconUI = jQuery(this).find('.gr_isotope_beacon')
		                    TweenMax.to(beaconUI, .2, {css:{opacity: 0}, ease:Power4.EaseIn});
		                    //caption          
		                    if(jQuery(this).find('.metro-caption').length!=0){
		                    	var caption_ui = jQuery(this).find('.metro-caption');
		                    	TweenMax.to(caption_ui, .2, {css:{opacity: 0, top: jQuery(this).find('.metro_item_inside').height()}, ease:Power4.EaseIn});
		                    }   

		                    //if metro   
		                    //if metro     
		                    if(jQuery(this).find('.metro-cover').length!=0){
		                    	TweenMax.to(jQuery(this).find('.metro-dark'), .2, {css:{opacity: 0}, ease:Power4.EaseIn});
		                    }		                        
		                });

		                var beacon = objUI.find('.gr_genericBeaconIsotope');
		                beacon.hover(function(e){
		                    TweenMax.to(jQuery(this).find('.beaconCircle1'), .3, {scale:1.5, opacity: 0, ease:Elastic.EaseOut});
		                    TweenMax.to(jQuery(this).find('.beaconCircle2'), .2, {scale:.95, opacity:.7, ease:Elastic.EaseOut});
		                }, function(e){
		                    TweenMax.to(jQuery(this).find('.beaconCircle1'), .2, {scale:1, opacity: 1, ease:Elastic.EaseIn});
		                    TweenMax.to(jQuery(this).find('.beaconCircle2'), .1, {scale:1, opacity:1, ease:Elastic.EaseOut});
		                });	

		                //click handler
		                objUI.click(function(e){
		                	e.preventDefault();		                	
		                	var items = new Array();
		                	if(jQuery(this).attr('data-external-url')!=undefined){
		                		var linkTarget = (jQuery(this).attr('data-target')!=undefined)?true:false;
		                		var linkTargetSelf = true;
		                		if(linkTarget){
		                			linkTargetSelf = (jQuery(this).attr('data-target')=="_blank")?false:true;
		                		}
		                		
			                    if(linkTargetSelf){                
			                       window.location = jQuery(this).attr('data-external-url');
			                    }else{
			                        window.open(jQuery(this).attr('data-external-url'));
			                    }		                		
		                		return;		                		
		                	}
		                	
		                	var currentUID = jQuery(this).attr('data-uid');
		                	for (var m = 0; m < containerData.items.length; m++) {

		                			                		
		                		if(containerData.items[m].objectUI.attr('data-external-url')==undefined){
		                			//if(containerData.items[m].objectUI.attr('data-isloaded')=="false")
		                				//break;
		                			var type = containerData.items[m].type;		                					                			
		                			items.push({imageLargeURL: containerData.items[m].data.large, type: type, extraData: containerData.items[m].data.embeded, isLoaded: containerData.items[m].objectUI.attr('data-isloaded'), uid: containerData.items[m].uid});		                			
		                		}
		                		/*
		                		var isURL = false;
		                		if(containerData.items[m].objectUI.attr('data-external-url')!=undefined){
		                			isURL = true;
		                		}
		                		var type = containerData.items[m].type;
		                		items.push({imageLargeURL: containerData.items[m].data.large, type: type, extraData: containerData.items[m].data.embeded, isLoaded: containerData.items[m].objectUI.attr('data-isloaded'), uid: containerData.items[m].uid, isURL: isURL});
		                		*/

		                	};				            
				            var currentIndx = 0;
				            for (var n = 0; n < items.length; n++) {				            	
				            	if(items[n].uid==currentUID){
				            		currentIndx = n;
				            		break;
				            	}
				            };
				            			                        
				            var gravity = new LightBoxTheGrid();
				            gravity.init(items, false, null, currentIndx, containerData, function(containerDTA, countNewLoadedID){		
				            	if(parseInt(countNewLoadedID)==0)
				            		return;				            					            	            	
				            	var count = 0;  	
				            	for (var i = 0; i < containerDTA.items.length; i++) {
				            		if(containerDTA.items[i].uid!=countNewLoadedID && (containerDTA.items[i].objectUI.attr('data-isloaded')=="false")){
				            			count++;
				            		}else if(containerDTA.items[i].uid==countNewLoadedID && (containerDTA.items[i].objectUI.attr('data-isloaded')=="false")){				            			
				            			count++;
				            			break;
				            		}  						            		
				            	};
				            	
				            	appendItems(containerDTA, count);
				            });		                	
		                });	
		                              


					};
					//check if there are other unloaded object
					for (var l = 0; l < containerData.items.length; l++) {
						var moreUnloaded = false;
						if(containerData.items[l].objectUI.attr('data-isloaded')=="false"){
							moreUnloaded = true;
							break;
						}
					};
					if(moreUnloaded){
						//show load more
						containerData.loadMoreBTN.css('display', 'inline-block');
					}else{
						//remove load more
						containerData.containerUI.parent().find('.loadMoreContainer').remove();
					}

				});
			}			
		};	
		if(itemsToLoad.length==0){
			return;
		}	
		itemsToLoad[0].load();
	}


	return{
		getInstance:function(){
			if(!instance){
				instance = constructor();
			}
			return instance;
		}
	}
})();


SKMetro.Plugin.ThumbItem = function(item, containerData){
	this.item = item;
	this.containerData = containerData;		

	this.objectUI = item.objectUI;
	this.next;
	this.callBack;		
	this.setCallBack = function(c){
		this.callBack = c;
	}
	this.load = function(){
		var _slef = this;
		var beconIcon = "magnify_icon_beacon.png";		
		switch(this.item.type) {
		    case "video":
		        beconIcon = "video_icon_beacon.png";
		        break;
		    case "audio":
		        beconIcon = "sound_icon_beacon.png";
		        break;
		    default:
		        beconIcon = "magnify_icon_beacon.png";
		} 

		var externalURL = item.objectUI.attr('data-external-url');		
		beconIcon = (externalURL!=undefined)?"link_icon_beacon.png":beconIcon;		
		
		var html = ['<div class="metro_item_inside">',
			'<img class="metroThumb" alt="" />',
			'<div class="gr_isotope_beacon">',
				'<div class="gr_genericBeaconIsotope" data-href="#">',
					'<div class="beaconCircle1"></div>',
					'<div class="beaconCircle2">',
						'<img class="isotopeItemOpenLink" src="metro_assets/img/'+beconIcon+'" alt="">',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
		].join('');

		var thumbUI = jQuery(html);
		var img = thumbUI.find('.metroThumb');
		img.bind('load', function() {
			//image loaded
			if(_slef.next!=undefined){
				_slef.next.load();
			}
			if(_slef.callBack){
				_slef.callBack();
			}			
		});	
		this.objectUI.appendTo(containerData.containerUI);
		thumbUI.appendTo(this.objectUI);
		img.attr('src', item.data.thumb);
		thumbUI.parent().attr('data-isloaded', 'true');
	}

	this.getObjectUI = function(){		
		return this.objectUI;
	}
	this.getItem = function(){
		return this.item;
	}
}

//utils
var SakuraUtils = (function(){
	return {
		hexToRgb: function(hex){
		    var bigint = parseInt(hex, 16);
		    var r = (bigint >> 16) & 255;
		    var g = (bigint >> 8) & 255;
		    var b = bigint & 255;
		    return [r, g, b];
		},
		generateUID: function(){
		    return Math.random().toString(36).substring(2, 15) +
		        Math.random().toString(36).substring(2, 15);			
		}
	}
})();




       //lightbox
       /*
       * @data - array with images URL's
       * @advanced - show 3D effect
       * @websiteWrapper - main website container
       * @startIndx - start index
       */

       function LightBoxTheGrid(){
          var active = true;       

          this.init=function(data, advanced, websiteWrapper, startIndx, containerData, callBackLoad){

              if(startIndx==undefined||startIndx==null){
                startIndx = 0;
              }
              if(advanced){
                  TweenMax.to(websiteWrapper, .2, {css:{opacity:.9, scale: .9}, ease:Power4.EaseIn});
              }
              var isRestrict = false;
              var lightboxUI = jQuery('<div class="gravityLightboxUI gravityLightboxSettings"></div>');
              lightboxUI.css('opacity', 0);
              lightboxUI.appendTo('body');
              lightboxUI.css('width', '80%');
              lightboxUI.css('height', '80%');
              lightboxUI.css('left', jQuery(window).width()/2-lightboxUI.width()/2);
              lightboxUI.css('top', 130);
              TweenMax.to(lightboxUI, .1, {css:{opacity:1, width: '100%', left: 0, height: '100%', top: 0}, ease:Power4.EaseIn, onComplete:function(){
                  routeData(data[startIndx]);
                  lightboxResize();
              }});


              jQuery(window).resize(function(){
                 lightboxResize();           
              });

              var leftControlUI = jQuery('<div class="gravityArrow gravityArrowLeft"></div>');
              leftControlUI.css('display', 'none'); 
              leftControlUI.appendTo(lightboxUI); 
              var rightControlUI = jQuery('<div class="gravityArrow gravityArrowRight"></div>'); 
              rightControlUI.css('display', 'none'); 
              rightControlUI.appendTo(lightboxUI);
              var gravityLightCloseUI = jQuery('<div class="gravityLightCloseUI"><div class="gravityLightClose"></div></div>'); 
              gravityLightCloseUI.appendTo(lightboxUI);
              var gravityLightClose = gravityLightCloseUI.find('.gravityLightClose');

              var loaderUI = jQuery('<div class="lbgLoader"><img src="metro_assets/img/preloader-lightbox.gif" alt="" /></div>');
              loaderUI.css('opacity', 0);
              loaderUI.appendTo(lightboxUI);
              
              var controlls = new Array(leftControlUI, rightControlUI, gravityLightClose);
              for (var i = 0; i < controlls.length; i++) {
                controlls[i].css('opacity', .7);
                controlls[i].hover(function(){
                    TweenMax.to(jQuery(this), .2, {css:{opacity:1}, ease:Power4.EaseIn});
                },function(){
                    TweenMax.to(jQuery(this), .2, {css:{opacity:.7}, ease:Power4.EaseIn});
                });
              };

              lightboxResize();


              function displayPreloader(val){
                  if(val){
                      TweenMax.to(loaderUI, .19, {css:{opacity:1, scale: 1}, ease:Power4.EaseIn});
                  }else{
                    TweenMax.to(loaderUI, .19, {css:{opacity:0, scale: .5}, ease:Power4.EaseIn});
                  }
              }

              keyEvents();
              function keyEvents(){
                  jQuery(document).bind("keydown", function(e){
                      if(isRestrict)
                        return;
                        switch(e.keyCode)
                        {
                        case 37:
                          if(startIndx>0){
                            startIndx--;
                            routeData(data[startIndx]);
                          }                          
                          break;
                        case 39:
                          if(startIndx<data.length-1){
                            startIndx++;
                            routeData(data[startIndx]);
                          }                          
                          break;   
                        case 27:
                          lightboxClose();                    
                          break;                                        
                        }
                  });
              }

              leftControlUI.click(function(e){
                e.preventDefault();
                if(isRestrict){
                  return;
                }   
                if(startIndx>0){
                  startIndx--;
                  routeData(data[startIndx]);
                }                              
              }); 

              rightControlUI.click(function(e){
                e.preventDefault();
                if(isRestrict){
                  return;
                }            
                if(startIndx<data.length-1){
                  startIndx++;
                  routeData(data[startIndx]);
                }
              }); 

              function validateButtons(){
                if(currentImageUI==null){
                  leftControlUI.css('display', 'none');
                  rightControlUI.css('display', 'none');                  
                  return;
                }
                leftControlUI.css('display', 'block');
                rightControlUI.css('display', 'block');
                  if(startIndx==0){
                    //disable left
                    leftControlUI.css('display', 'none');
                  }
                                    
                  if(startIndx>=data.length-1){
                    //disable right
                    rightControlUI.css('display', 'none');
                  }
              }                
              var countNewLoadedID = 0;
              function routeData(dataObj){
              	  if(dataObj.isLoaded=="false"){
              	  		countNewLoadedID = dataObj.uid;
              	  		data[startIndx].isLoaded=true;
              	  }
                  switch(dataObj.type)
                  {
                  case "image":
                    loadImage(dataObj.imageLargeURL);
                    break;
                  case "video":
                    loadVideo(dataObj.extraData);
                    break;
                  case "audio":
                    loadSound(dataObj.extraData);
                    break;                  
                  }
              }

              function loadSound(videoSrc){
                  validateButtons();
                  isRestrict = true;
                  if(currentImageUI!=null){
                      displayPreloader(true);
                      TweenMax.to(currentImageUI, .2, {css:{opacity:0}, ease:Power4.EaseIn, onComplete: function(){
                          currentImageUI.remove();
                          loadNewSound(videoSrc);
                      }});
                  }else{
                    displayPreloader(true);
                    loadNewSound(videoSrc);
                  }  
              }
              //load sound
              function loadNewSound(videoSrc){
                try{
                  currentImageUI = jQuery('<div class="gridSound">'+videoSrc+'</div>');
                  currentImageUI.css('opacity', 0);
                  currentImageUI.appendTo(lightboxUI);
                  TweenMax.to(currentImageUI, .2, {css:{opacity:1}, ease:Power4.EaseIn});
                  displayPreloader(false);
                  lightboxResize();
                  isRestrict = false;
                }catch(e){}
                validateButtons();
              }                            

              function loadVideo(videoSrc){
                  validateButtons();
                  isRestrict = true;
                  if(currentImageUI!=null){
                      displayPreloader(true);
                      TweenMax.to(currentImageUI, .2, {css:{opacity:0}, ease:Power4.EaseIn, onComplete: function(){
                          currentImageUI.remove();
                          loadNewVideo(videoSrc);
                      }});
                  }else{
                    displayPreloader(true);
                    loadNewVideo(videoSrc);
                  }  
              }
              //load video
              function loadNewVideo(videoSrc){
                try{
                  currentImageUI = jQuery('<div class="gridVideo">'+videoSrc+'</div>');
                  currentImageUI.css('opacity', 0);
                  currentImageUI.appendTo(lightboxUI);
                  TweenMax.to(currentImageUI, .2, {css:{opacity:1}, ease:Power4.EaseIn});
                  displayPreloader(false);
                  lightboxResize();
                  isRestrict = false;
                }catch(e){}
                validateButtons();
              }


              var currentImageUI=null;
              function loadImage(imgSrc){
                validateButtons();                
                isRestrict = true;
                  if(currentImageUI!=null){
                      displayPreloader(true);
                      TweenMax.to(currentImageUI, .2, {css:{opacity:0}, ease:Power4.EaseIn, onComplete: function(){
                          currentImageUI.remove();
                          loadNewImage(imgSrc);
                      }});
                  }else{
                    displayPreloader(true);
                    loadNewImage(imgSrc);
                  }
              }

              function loadNewImage(imgSrc){                
                try{
                  currentImageUI = jQuery('<img class="gravityLightboxImage" src="'+imgSrc+'" alt="" />');
                  currentImageUI.css('opacity', 0);
                  currentImageUI.bind('load', function(){
                      lightboxResize();
                      currentImageUI.unbind('load');
                      displayPreloader(false);
                      TweenMax.to(currentImageUI, .2, {css:{opacity:1}, ease:Power4.EaseIn});
                  })
                  currentImageUI.appendTo(lightboxUI);
                  try{
                        currentImageUI.unbind('contextmenu');                            
                        currentImageUI.bind('contextmenu', function(e) {
                            return false;
                        }); 
                  }catch(e){}
                  isRestrict = false;
                }catch(e){}
                validateButtons();
              }

              gravityLightClose.hover(function(e){
                  TweenMax.to(jQuery(this), .2, {css:{scale: .9}, ease:Power4.EaseIn});
              }, function(e){
                  TweenMax.to(jQuery(this), .2, {css:{scale: 1}, ease:Power4.EaseIn});
              });
              gravityLightCloseUI.click(function(e){
                  e.preventDefault();
                  lightboxClose();
              });              

              function lightboxClose(){
          	  	 if(callBackLoad!=undefined){
          	  	 	//load item              	  	 	
          	  	 	callBackLoad(containerData, countNewLoadedID);
          	  	 }              	
                  active = false;
                  if(advanced){
                    TweenMax.to(lightboxUI, .2, {css:{opacity:.2, scale: 1.3}, ease:Power4.EaseIn});
                    TweenMax.to(websiteWrapper, .2, {css:{opacity:1, scale: 1}, delay:.1, ease:Power4.EaseIn, onComplete: function(){
                      lightboxUI.remove();
                    }});
                 }else{
                    if(currentImageUI!=null){
                        TweenMax.to(currentImageUI, .1, {css:{opacity:0, scale: .8}, ease:Power4.EaseIn, onComplete:function(){
                            TweenMax.to(lightboxUI, .2, {css:{opacity:0}, delay: .2, ease:Power4.EaseIn, onComplete: function(){
                              lightboxUI.remove();
                            }});
                        }});                        
                        TweenMax.to(rightControlUI, .1, {css:{opacity:0}, ease:Power4.EaseIn});
                        TweenMax.to(leftControlUI, .1, {css:{opacity:0}, ease:Power4.EaseIn});
                        jQuery(this).css('display', 'none');
                    }else{
                        lightboxUI.remove();
                    }                                        
                 }
                 jQuery(document).unbind('keydown');                
              }

              function lightboxResize(){
                  if(!active){
                      return;
                  }
                  try{
                  currentImageUI.css('left', lightboxUI.width()/2-currentImageUI.width()/2+'px');
                  currentImageUI.css('top', lightboxUI.height()/2-currentImageUI.height()/2+'px');
                }catch(e){}
                  try{
                      leftControlUI.css('left', 20+'px');
                      leftControlUI.css('top', lightboxUI.height()/2-leftControlUI.height()/2+'px'); 
                      rightControlUI.css('right', 20+'px');
                      rightControlUI.css('top', lightboxUI.height()/2-rightControlUI.height()/2+'px');
                      gravityLightCloseUI.css('bottom', 20+'px');
                      gravityLightCloseUI.css('left', lightboxUI.width()/2-42/2+'px');                                                                   

                      loaderUI.css('left', lightboxUI.width()/2-30/2+'px');
                      loaderUI.css('top', lightboxUI.height()/2-30/2+'px'); 
                      
                  }catch(e){}                 
              } 

              /**
               * Utils
               */ 
              //extract number
              function extractNumber(pxValue){
                  var striped = pxValue.substring(0, pxValue.length-2);
                  var val = parseFloat(striped);
                  return val;
              }              

          }
       }
       //end lightbox
