module.exports = (filters) => {
	let filterList = filters.map(filter => {
		let filterObject = { 'events.isAnon': false };

		if(filter.eventName) {
			filterObject['events.eventname'] = filter.eventName;
		}

		if(filter.traitKey && filter.traitValue) {
			filterObject[`events.details.${filter.traitKey}`] = filter.traitValue;
		}

		if(filter.occurenceKey && filter.occurenceValue && filter.occurenceUnit) {

			let multiplier = 0;

			switch (filter.occurenceUnit) {
				case 'Minutes':
					multiplier = 60*1000; 
					break;
				case 'Hours':
					multiplier = 60*60*1000;
					break;
				case 'Days':
					multiplier = 24*60*60*1000;
					break;

				default:
					break;
			}

			filterObject['events.timestamp'] = {};
			
			switch(filter.occurenceKey) {
				case 'before':
					filterObject['events.timestamp']['$lte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
					break;
				case 'after': 
					filterObject['events.timestamp']['$gte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
					break;

				case 'not after':
					filterObject['events.timestamp']['$not'] = {};
					filterObject['events.timestamp']['$not']['$gte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
					break;

				case 'in range':
					filterObject['events.timestamp']['$gte'] = `${new Date(filter.occurenceRangeStart).getTime()}`;
					filterObject['events.timestamp']['$lte'] = `${new Date(filter.occurenceRangeEnd).getTime()}`;
					break;

				case 'not in range':
					filterObject['events.timestamp']['$not'] = {};
					filterObject['events.timestamp']['$not']['$gte'] = `${new Date(filter.occurenceRangeStart).getTime()}`;
					filterObject['events.timestamp']['$not']['$lte'] = `${new Date(filter.occurenceRangeEnd).getTime()}`;
					break;

				default:
					break;
			}
		}
		return filterObject;
	})

	return filterList;
}