/**
 * Group randomizer.
 * 
 * Requirements/assumptions:
 * 1. All people must be in some group.
 * 2. Groups should be as full and as even as possible 
 *    (smallest group should be similar to largest).
 * 3. Each person should meet as many people as possible.
 */
class GroupRandomizer {
	constructor(totalCount, groupMax, stagesCount) {
		this.enableStageDump = false;

		/**
		 * Number of people determins number of cards.
		 */
		this.totalCount = totalCount;
		/**
		 * Max people in group.
		 * 
		 * There will be less in some group(s) if totalCount/groupMax is not an int.
		 */
		this.groupMax = groupMax;
		/**
		 * Number of stages.
		 * 
		 * Each stage should involve as many new relations as possible.
		 */
		this.stagesCount = stagesCount;

		/**
		 * Saved results.
		 */
		this.results = new Results(this.totalCount);

		/**
		 * Groups count.
		 */
		this.groupCount = Math.ceil(totalCount/groupMax);

		// pre-init
		this.init();
	}

	/**
	 * Run full group generation proccess.
	 */
	run() {
		let t0 = performance.now();
		this.draw();
		for (let stageNumber = 2; stageNumber <= this.stagesCount; stageNumber++) {
			this.drawByRelation();
		}
		if (this.enableStageDump) {
			this.results.dump();
		}
		let t1 = performance.now();
		console.log("whole randomization proccess took: " + (t1 - t0) + " milliseconds.");
	}

	/**
	 * Init/clear results.
	 */
	init() {
		// relations matrix (row = person index; array = relations with other people)
		this.peopleRelations = [];
		for (let index = 0; index < this.totalCount; index++) {
			//this.peopleRelations[index] = new Uint16Array();	// assumes max 2^16 for totalCount
			this.peopleRelations[index] = [];
		}

		// groups
		this.groups = [];
		let incompleteGroups = this.groupCount * this.groupMax - this.totalCount;
		let fullGroups = this.groupCount - incompleteGroups;
		// full (maxed-out)
		for (let index = 0; index < fullGroups; index++) {
			this.groups.push(new Group(index+1, this.groupMax));
		}
		// incomplete
		for (let index = fullGroups; index < this.groupCount; index++) {
			this.groups.push(new Group(index+1, this.groupMax-1));
		}
	}

	/**
	 * Draw groups.
	 */
	draw() {
		// indexes for available groups (not full)
		let availableGroups = [];
		for (let index = 0; index < this.groupCount; index++) {
			availableGroups.push(index);
			this.groups[index].reset();
		}

		let t0 = performance.now();

		// filling all groups randomly
		for (let personIndex = 0; personIndex < this.totalCount; personIndex++) {
			let randomInt = getRandomInt(0, availableGroups.length-1);
			let groupIndex = availableGroups[randomInt];
			let group = this.groups[groupIndex];
			// build relations
			for (let index = 0; index < group.members.length; index++) {
				const member = group.members[index];
				this.peopleRelations[personIndex].push(member);	// me to them
				this.peopleRelations[member].push(personIndex);	// them to me
			}
			// add to group
			group.add(personIndex);
			// remove full group
			if (group.isFull()) {
				availableGroups.splice(randomInt, 1);
			}
		}

		let t1 = performance.now();
		console.log("filling all groups randomly took " + (t1 - t0) + " milliseconds.");

		if (this.enableStageDump) {
			this.dumpGroups();
			this.dumpRelations();
		}
		this.saveStage();
	}

	/**
	 * Draw groups by using relations to maximize relations.
	 * 
	 * 1st person can be either random or just 1st from the list.
	 * 2nd person can be anyone with least relations with the 1st.
	 * 3rd person can be anyone with least relations with the 1st and 2nd.
	 * etc...
	 */
	drawByRelation() {
		// reset groups
		for (let index = 0; index < this.groupCount; index++) {
			this.groups[index].reset();
		}
		// indexes for available people (not already choosen)
		let availablePeople = [];
		for (let index = 0; index < this.totalCount; index++) {
			availablePeople.push(index);
		}

		let t0 = performance.now();

		// choose 1st person randomly (to make things less obvious)
		let personIndex = getRandomInt(0, this.totalCount-1);
		// itterate over groups adding members
		for (let groupIndex = 0; groupIndex < this.groupCount;) {
			let group = this.groups[groupIndex];

			// build relations
			for (let index = 0; index < group.members.length; index++) {
				const member = group.members[index];
				this.peopleRelations[personIndex].push(member);	// me to them
				this.peopleRelations[member].push(personIndex);	// them to me
			}

			// add to group
			group.add(personIndex);
			// next group if full
			if (group.isFull()) {
				groupIndex++;
			}

			// remove choosen person
			let availablePeopleIndex = availablePeople.indexOf(personIndex);
			if (availablePeopleIndex < 0) {
				console.error(`choosen person (${personIndex}) was not found in available`);
				debugger;
			} else {
				availablePeople.splice(availablePeopleIndex, 1);
			}

			// break if no one is left
			if (availablePeople.length === 0) {
				break;
			}

			// choose next person with least relations with current members and with least relations
			let bestStats = this.calculateBestCandidates(availablePeople, group);
			// choose random from best
			let randomInt = getRandomInt(0, bestStats.length-1);
			personIndex = bestStats[randomInt].personIndex;
			if (availablePeople.indexOf(personIndex) < 0) {
				console.error(`choosen person (${personIndex}) is not available`);
				debugger;
			}
			if (group.members.indexOf(personIndex) >= 0) {
				console.error(`choosen person (${personIndex}) is already int the group`);
				debugger;
			}
		}

		let t1 = performance.now();
		console.log("filling all groups by relation took " + (t1 - t0) + " milliseconds.");

		if (this.enableStageDump) {
			this.dumpGroups();
			this.dumpRelations();
		}
		this.saveStage();
	}

	/**
	 * Calculate stats for best candidates to the group.
	 * 
	 * choose next person with least relations with current members and with least relations.
	 * 
	 * @param {Array} availablePeople List of indexes of available people.
	 * @param {Group} group The group to take into account.
	 */
	calculateBestCandidates(availablePeople, group) {
		let bestStats = [];
		let minRelations = {
			relationsCount: Infinity,
			memberRelations: Infinity,
		}
		for (let index = 0; index < availablePeople.length; index++) {
			const personIndex = availablePeople[index];
			const relations = this.peopleRelations[personIndex];
			// count relations with members
			let memberRelations = 0;
			for (let index = 0; index < group.members.length; index++) {
				const member = group.members[index];
				if (relations.indexOf(member) >= 0) {
					memberRelations++;
				}
			}
			let personStats = {
				personIndex: personIndex,
				relationsCount: relations.length,	// smallest is best
				memberRelations: memberRelations,	// smallest is best
			};

			// reset stats if we just got a better candidate
			// (note that memberRelations are more important then relationsCount)
			if (
				(minRelations.memberRelations > personStats.memberRelations)
				|| 
				(minRelations.memberRelations == personStats.memberRelations
					&& minRelations.relationsCount > personStats.relationsCount)
				) {
				bestStats = [];
				bestStats.push(personStats);
				minRelations.memberRelations = personStats.memberRelations;
				minRelations.relationsCount = personStats.relationsCount;
			} else if (minRelations.memberRelations == personStats.memberRelations
				&& minRelations.relationsCount == personStats.relationsCount) {
				bestStats.push(personStats);
			}
		}

		return bestStats;
	}

	/**
	 * Save stage results.
	 */
	saveStage() {
		this.results.addStage(this.groups);
		//this.results.dump();
	}

	/**
	 * Dump groups (for debugging mostly).
	 */
	dumpGroups() {
		let groups = [];
		for (let index = 0; index < this.groupCount; index++) {
			let memebers = this.groups[index].members.join(',');
			groups.push(memebers);
		}
		groups = groups.join('],[');
		console.log(`Groups: [${groups}]`);
	}

	/**
	 * Dump relations (for debugging mostly).
	 */
	dumpRelations() {
		let dump = [];
		for (let index = 0; index < this.totalCount; index++) {
			let people = this.peopleRelations[index].join(',');
			dump.push(`${index}:[${people}]`);
		}
		dump = dump.join('; ');
		console.log(`Relations: ${dump}`);
	}
}

/**
 * Get integer between min and max (both inclusive).
 * 
 * @todo (?) Re-implement with `window.crypto.getRandomValues`:
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 * 
 * @param {Number} min 
 * @param {Number} max 
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Group for given draw.
 */
class Group {
	constructor(number, size) {
		this.number = number;
		this.size = size;
		this.reset();
	}

	/**
	 * Is group full (cannot have any more members).
	 */
	isFull() {
		return this.count >= this.size;
	}

	/**
	 * Add member.
	 * 
	 * @returns false if group was already full.
	 */
	add(person) {
		if (this.isFull()) {
			console.warn('Trying to add a member to an already full group!');
			return false;
		}
		this.count++;
		this.members.push(person);
		return true;
	}

	reset() {
		this.members = [];
		this.count = 0;
	}
}

/**
 * Saved results.
 */
class Results {
	constructor(totalCount) {
		this.memberGroups = [];
		for (let index = 0; index < totalCount; index++) {
			this.memberGroups[index] = [];
			
		}
	}

	/**
	 * Add stage results.
	 * @param {Array} groups 
	 */
	addStage(groups) {
		for (let index = 0; index < groups.length; index++) {
			const group = groups[index];
			this.add(group);
		}
	}

	/**
	 * Add group.
	 * @param {Group} group 
	 */
	add(group) {
		for (let index = 0; index < group.members.length; index++) {
			const personIndex = group.members[index];
			this.memberGroups[personIndex].push(group.number);
		}
	}

	dump() {
		let dump = [];
		for (let index = 0; index < this.memberGroups.length; index++) {
			let item = this.memberGroups[index].join(',');
			dump.push(`${index}:${item}`);
		}
		dump = dump.join('\n');
		console.log(`Stages:\n${dump}`);
	}
}

export { GroupRandomizer };