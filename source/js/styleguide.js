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

	var $categoryWidgets = $( '.widget_categories' );

	$categoryWidgets.each( function() {
		var $widget = $( this );
		var $label = $widget.children( 'label' );
		var $select = $widget.children( 'select' );
		var id = 'cat-' + guid();

		$label.attr( 'for', id );
		$select.attr( 'id', id );
	} );


	function guid(){
		var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split( '' );
		var charactersLength = characters.length;

		function S4() {
			var r = '';
			var i = 4;
			for ( ; i>0; i-- ) {
				r += characters[Math.floor(Math.random()*charactersLength)];
			}
			return r;
		}

		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

}( window ));