import '@testing-library/jest-dom';

global.wp = {
	i18n: {
		__( str ) {
			return str;
		},
	},
};

global.themeData = {
	templateUrl: 'http://localhost/wp-content/themes/child-lab-test',
};

global.fetch =
	global.fetch ||
	jest.fn( () =>
		Promise.resolve( {
			json: () => Promise.resolve( [] ),
		} )
	);
