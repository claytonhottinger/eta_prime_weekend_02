$( function() {
	function renderPerson( person ) {
		var compiledHTML = personTemplate( { name: person } );
		$( "section" ).fadeOut( 1000, function() {
			$( this ).html( compiledHTML );
		} ).fadeIn( 1000 );
	};

	function nextPerson() {

		$.ajax( {
			url: "/data/eta.json"
		} ).done( function( data ) {
			for ( var i = 0; i < data.eta.length; i++ ) {
				if ( data.eta[ i ].lastName == $( "a" ).attr( "class" ) ) {
					if ( i + 1 == data.eta.length ) {
						var newPerson = data.eta[ 0 ];
					} else {
						var newPerson = data.eta[ i + 1 ];
					}
					break;
				}
			}
			renderPerson( newPerson );
		} );
	};

	function previousPerson() {
		$.ajax( {
			url: "/data/eta.json"
		} ).done( function( data ) {
			for ( var i = 0; i < data.eta.length; i++ ) {
				if ( data.eta[ i ].lastName == $( "a" ).attr( "class" ) ) {
					if ( i == 0 ) {
						var newPerson = data.eta[ data.eta.length - 1 ];
					} else {
						var newPerson = data.eta[ i - 1 ];
					}
					break;
				}
			}

			renderPerson( newPerson );
		} );
	};

	var personTemplate = Handlebars.compile( $( "#name" ).html() );

	var everyTenSeconds = setInterval( nextPerson, 10000 );

	$.ajax( {
		url: "/data/eta.json"
	} ).done( function( data ) {
		renderPerson( data.eta[ Math.floor( Math.random() * data.eta.length ) ] );
	} );

	$( ".prev" ).on( "click", function() {
		previousPerson();
		clearInterval( everyTenSeconds );
		everyTenSeconds = setInterval( nextPerson, 10000 );
	} );

	$( ".next" ).on( "click", function() {
		nextPerson();
		clearInterval( everyTenSeconds );
		everyTenSeconds = setInterval( nextPerson, 10000 );
	} );
} );
