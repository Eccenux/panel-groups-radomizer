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
		 * Groups count.
		 */
		this.groupCount = Math.ceil(totalCount/groupMax);

		// pre-init
		this.init();
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

		this.dumpGroups();
		this.dumpRelations();
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

export { GroupRandomizer };