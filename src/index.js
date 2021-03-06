import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import { ApolloProvider } from "react-apollo";

import App from "./App";

import "./index.css";

const URI = "https://mattcyates.com/api";

const link = createUploadLink( {
	uri: URI
} );
const authLink = setContext( ( _, { headers } ) => {
	const token = localStorage.getItem( "token" );

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${ token }` : ""
		}
	};
} );

const cache = new InMemoryCache( {
	dataIdFromObject: ( object ) => object.key || null
} );

const client = new ApolloClient( {
	cache,
	link: authLink.concat( link )
} );

client.writeData( {
	data: {
		isAuthed: !!localStorage.getItem( "token" ),
		id: localStorage.getItem( "id" ) || "",
		listings: []
	}
} );

ReactDOM.render(
	<ApolloProvider client={ client }>
		<App />
	</ApolloProvider>,
	document.getElementById( "root" )
);
