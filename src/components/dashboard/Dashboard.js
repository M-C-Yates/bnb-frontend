import React from "react";

import {Link} from '@reach/router';
import { Query } from "react-apollo";
import {LISTINGS} from '../../queries/LISTINGS';
export const Dashboard = () => {
	return (
		<>

			<h2>Dashboard</h2>
			<Link to="/listing/create">Create a new listing</Link>
			<Query query={LISTINGS} >
			{({loading, error, data}) => {
				if (loading) {
					return null;
				}
				if (error) {
					return `Error: ${error}`
				}
				return (
					<>
					{data.listings.map((listing) => {
						const url = `/listing/${listing.id}`;
						return (
							<Link key={listing.id} to={url}>
              <div>
              {listing.heroUrl ? (
                <img src={listing.heroUrl} alt={`Listing Hero ${listing.id}`} />
              ) : (
                <></>
              )}
              <h3>{listing.name}</h3>
              </div>
            </Link>
						)
					})}
					</>
				)
			}}
			</Query>
		</>
	);
};

export default Dashboard;