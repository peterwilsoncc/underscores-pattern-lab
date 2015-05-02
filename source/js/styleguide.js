var PWCC = window.PWCC || {};

(PWCC.sg = function( window, undefined ){ 
	
	var $ = window.jQuery;
	
	var $tagClouds = $( '.widget_tag_cloud > .tagcloud' );
	
	$tagClouds.each( function() {
		var $links = $( this ).find( 'a' ),
		    seperator = $( this ).data( 'styleguide-seperator' ),
		    totalLinks = $links.length;
		
		$links.each( function( i ){
			if ( i + 1 === totalLinks ) {
				return false;
			}
			
			$( this ).after( seperator );
			
		} );
	} );
	
	
}( window ));