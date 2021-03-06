import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Mutation } from "react-apollo";
import { addDays, differenceInDays, format, max } from "date-fns";

import { CREATEBOOKING } from "../../mutations/CREATEBOOKING";
import "react-datepicker/dist/react-datepicker.css";
import { GET_LISTING } from "../../queries/GET_LISTING";

import "./booking.css";

export const Booking = (props) => {
	const { bookings } = props;

	let [startDate, setStartDate] = useState(new Date());
	const later = addDays(startDate, 7);
	let [endDate, setEndDate] = useState(later);
	const tripPrice = differenceInDays(endDate, startDate) * props.price;
	let endDateArr = [];
	bookings.forEach((booking) => {
		endDateArr.push(booking.endDate);
	});
	let [newestDate, setNewestDate] = useState(max(...endDateArr));
	let [endDate2, setEndDate2] = useState(addDays(new Date(newestDate), 7));

	return (
		<>
			<Mutation
				mutation={CREATEBOOKING}
				onCompleted={(e) => {
					console.log(e.createBooking);
				}}
				refetchQueries={[
					{
						query: GET_LISTING,
						variables: {
							id: props.id
						}
					}
				]}
			>
				{(createBooking, { loading, error }) => {
					if (bookings.length === 0) {
						return (
							<div className="listing-book">
								{loading && <p>Loading...</p>}
								{error && <p>error</p>}
								{`Trip Price: ${tripPrice}$`}
								<form
									className="booking"
									onSubmit={(e) => {
										e.preventDefault();
										createBooking({
											variables: {
												listing: props.id,
												data: {
													startDate: new Date(startDate).toISOString(),
													endDate: new Date(endDate).toISOString()
												}
											}
										});
									}}
								>
									<DatePicker
										className="booking-date"
										selected={new Date(startDate)}
										selectsStart
										startDate={new Date(startDate)}
										endDate={new Date(endDate)}
										minDate={new Date()}
										maxDate={new Date(later).setDate(
											new Date(later).getDate() - 1
										)}
										onChange={(e) => {
											setStartDate(new Date(e));
										}}
										showDisabledMonthNavigation
									/>
									<DatePicker
										className="booking-date"
										selected={new Date(endDate)}
										selectsEnd
										startDate={new Date(startDate)}
										endDate={new Date(endDate)}
										minDate={addDays(new Date(), 1)}
										onChange={(e) => {
											setEndDate(new Date(e));
										}}
										showDisabledMonthNavigation
									/>
									<button className="booking-btn" type="submit">
										Submit
									</button>
								</form>
							</div>
						);
					} else if (bookings.length > 0) {
						return (
							<div className="listing-book">
								{loading && <p>Loading...</p>}
								{error && <p>error</p>}
								{`Trip Price: ${tripPrice}$`}
								<form
									className="booking"
									onSubmit={(e) => {
										e.preventDefault();
										createBooking({
											variables: {
												listing: props.id,
												data: {
													startDate: new Date(startDate).toISOString(),
													endDate: new Date(endDate).toISOString()
												}
											}
										});
									}}
								>
									<DatePicker
										selected={new Date(newestDate)}
										selectsStart
										startDate={new Date(newestDate)}
										endDate={new Date(endDate2)}
										minDate={new Date(newestDate)}
										maxDate={new Date(endDate2)}
										onChange={(e) => {
											setNewestDate(new Date(e));
										}}
										showDisabledMonthNavigation
									/>
									<DatePicker
										selected={new Date(endDate2)}
										selectsEnd
										startDate={new Date(newestDate)}
										endDate={new Date(endDate2)}
										minDate={addDays(new Date(newestDate), 1)}
										onChange={(e) => {
											setEndDate2(e);
										}}
										showDisabledMonthNavigation
									/>
									<button className="btn-form" type="submit">
										Submit
									</button>
								</form>
								<h4>
									{bookings.map((booking) => {
										return `Booked from ${format(
											booking.startDate,
											"MM/DD/YYYY"
										)} to ${format(booking.endDate, "MM/DD/YYYY")} \n`;
									})}
								</h4>
							</div>
						);
					}
				}}
			</Mutation>
		</>
	);
};
