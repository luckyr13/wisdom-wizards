/*
*	Version 11
*	God bless this mess :)
*/
export function handle(state, action)
{	
	const _msgSender = SmartWeave.transaction.owner;
	const _to = SmartWeave.transaction.target;
	const _tags = SmartWeave.transaction.tags;

	/*
	*	@dev Register user
	*/
	if (action.input.function === "registerUser") {
		// Check if user is already registered
		_modifier_userAlreadyRegistered(state.users, _msgSender);

		// Update state
		// Save new user
		state.users[_msgSender] = { 
			coursesEnrolled: [],
			completedCourses: [],
			coursesEvaluated: [],
			coursesCreated: []
		};
		return { state };
	}
	/*
	*	@dev Create course
	*/
	if (action.input.function === "createCourse") {
		// Validate if user is not registered
		_modifier_userMustBeRegistered(state.users, _msgSender);

		// Validate inputs that must be strings
		_modifier_validateInputString(action.input.name, 'name', 80);
		_modifier_validateInputString(action.input.description, 'description', 1200);
		_modifier_validateInputString(action.input.imgUrl, 'imgUrl', 1200);
		_modifier_validateInputString(action.input.langCode, 'langCode', 2);
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.subject, 'subject');
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.price, 'price');

		// Subject must exist
		if (state.subjects[action.input.subject] === undefined ||
				!state.subjects[action.input.subject]) {
			throw new ContractError('Invalid subject');
		}

		// Create course structure
		const res = { 
			name: String.prototype.trim.call(action.input.name), 
			description: String.prototype.trim.call(action.input.description),
			imgUrl: String.prototype.trim.call(action.input.imgUrl),
			subject: action.input.subject, 
			active: false, 
			createdBy: _msgSender,
			users: [],
			passedUsers: [],
			rating: 0,
			evaluators: 0,
			langCode: String.prototype.trim.call(action.input.langCode),
			price: parseInt(action.input.price)
		};
		// Add new course
		const id = state.courses.push(res) - 1;
		state.users[_msgSender].coursesCreated.push(id);

		return { state };
	}

	/*
	*	@dev Activate/deactivate course
	*/
	if (action.input.function === "updateActiveStatusCourse") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (typeof state.courses[action.input.courseId] === 'undefined') {
			throw new ContractError('Invalid courseId');
		}
		// Only owner (professor) can update the course
		// this helps to know if course should be listed or not in the UI
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);

		// Update state
		state.courses[action.input.courseId].active = !!action.input.active;

		return {state};
	}

	/*
	*	@dev Update course info
	*/
	if (action.input.function === "updateCourseInfo") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (typeof state.courses[action.input.courseId] === 'undefined') {
			throw new ContractError('Invalid courseId');
		}
		// Only owner (professor) can update the course
		// this helps to know if course should be listed or not in the UI
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);
		// Validate inputs that must be strings
		_modifier_validateInputString(action.input.name, 'name', 80);
		_modifier_validateInputString(action.input.description, 'description', 1200);
		_modifier_validateInputString(action.input.imgUrl, 'imgUrl', 1200);
		_modifier_validateInputString(action.input.langCode, 'langCode', 2);

		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.subject, 'subject');
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.price, 'price');

		// Subject must exist
		if (state.subjects[action.input.subject] === undefined ||
				!state.subjects[action.input.subject]) {
			throw new ContractError('Invalid subject');
		}

		// Update state
		state.courses[action.input.courseId].active = !!action.input.active;
		state.courses[action.input.courseId].name = String.prototype.trim.call(action.input.name);
		state.courses[action.input.courseId].description = String.prototype.trim.call(action.input.description);
		state.courses[action.input.courseId].imgUrl = String.prototype.trim.call(action.input.imgUrl);
		state.courses[action.input.courseId].subject = action.input.subject;
		state.courses[action.input.courseId].langCode = action.input.langCode;
		state.courses[action.input.courseId].price = parseInt(action.input.price);

		return {state};
	}

	/*
	*	@dev Enroll me in a course
	*/
	if (action.input.function === "enrollMe") {
		// TODO Modifier: User can not be the creator?
		_modifier_ownerOfCourseDetected(state.courses[action.input.courseId], _msgSender);
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (typeof state.courses[action.input.courseId] === 'undefined') {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// User must not be already enrolled 
		if (state.courses[action.input.courseId].users.indexOf(_msgSender) >= 0) {
			throw new ContractError('You are already enrolled!');
		}

		// Enroll student
		state.courses[action.input.courseId].users.push(_msgSender);
		// Update student courses info
		state.users[_msgSender].coursesEnrolled.push(action.input.courseId);

		return {state};
	}

	/*
	*	@dev Pass a student
	*/
	if (action.input.function === "passAStudent") {
		// Validate inputs that must be strings
		_modifier_validateInputString(action.input.studentAddress, 'studentAddress', 400);
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (typeof state.courses[action.input.courseId] === 'undefined') {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// Only owner (professor) can update the course 
		// only professor can pass students
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);

		// Student must be enrolled
		if (state.courses[action.input.courseId].users.indexOf(action.input.studentAddress) < 0) {
			throw new ContractError('Student is not enrolled!');
		}
		// Student must not be already passed
		if (state.courses[action.input.courseId].passedUsers.indexOf(action.input.studentAddress) >= 0) {
			throw new ContractError('Student already passed!');
		}

		// Update state
		// Add student to the special list
		state.courses[action.input.courseId].passedUsers.push(action.input.studentAddress);
		// Update student's list of passed courses
		state.users[action.input.studentAddress].completedCourses.push(action.input.courseId);

		return {state};
	}

	/*
	*	@dev Rate a course
	*/
	if (action.input.function === "rateACourse") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		_modifier_validateInputNumber(action.input.rating, 'rating');

		// Rating must be between 0 and 10
		if (action.input.rating < 0 || action.input.rating > 10) {
			throw new ContractError(`Rating out of range ${action.input.rating}`);
		}

		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// Student (sender) must be enrolled
		if (state.courses[action.input.courseId].users.indexOf(_msgSender) < 0) {
			throw new ContractError('You are not enrolled in this course!');
		}
		// Student (sender) must be already passed
		if (state.courses[action.input.courseId].passedUsers.indexOf(_msgSender) < 0) {
			throw new ContractError('You must pass the course to unlock this feature!');
		}
		// Course already evaluated
		if (state.users[_msgSender].coursesEvaluated.indexOf(action.input.courseId) >= 0) {
			throw new ContractError('You already evaluated this course!');
		}

		// Update state
		state.users[_msgSender].coursesEvaluated.push(action.input.courseId);
		state.courses[action.input.courseId].evaluators += 1;
		state.courses[action.input.courseId].rating = (
			state.courses[action.input.courseId].rating +
			action.input.rating
		) / state.courses[action.input.courseId].evaluators;
	
		return {state};
	}

	/*
	*	@dev Get the list of subjects
	*/
	if (action.input.function === "getSubjects") {
		return { result: state.subjects}
	}

	/*
	*	@dev Get the list of active courses grouped by subject
	*/
	if (action.input.function === "getActiveCourses") {
		const courses = state.courses;
		const res = {};

		for (let courseId in courses) {
			const c = courses[courseId];

			// Skip inactive courses
			if (!c.active) {
				continue;
			}
			// Save course
			if (!Object.prototype.hasOwnProperty.call(res, c.subject)) {
				res[c.subject] = [];
			}

			res[c.subject].push({
				id: courseId,
				name: c.name,
				description: c.description,
				imgUrl: c.imgUrl,
				price: c.price,
				numUsers: c.users.length,
				numPassedUsers: c.passedUsers.length,
				rating: c.rating,
				evaluators: c.evaluators,
				createdBy: c.createdBy,
				langCode: c.langCode
			});
		}

		return { result: res }
	}

	/*
	*	@dev Get my user data
	*/
	if (action.input.function === "getMyUserData") {
		// Validate if user exists
		if (!Object.prototype.hasOwnProperty.call(state.users, _msgSender)) {
			throw new ContractError('User is not registered');
		}
		return { result: state.users[_msgSender]}
	}

	/*
	*	@dev Get course detail
	*/
	if (action.input.function === "getCourseDetail") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}

		return { result: state.courses[action.input.courseId]};
	}

	/*
	*	@dev Get the list detail of my courses
	*/
	if (action.input.function === "getAllMyCreatedCourses") {
		// Validate if user exists
		if (!Object.prototype.hasOwnProperty.call(state.users, _msgSender)) {
			throw new ContractError('User is not registered');
		}
		const allCourses = state.courses;
		const myCourses = state.users[_msgSender].coursesCreated;
		const res = [];

		for (let courseId of myCourses) {
			const c = allCourses[courseId];

			res.push({
				id: courseId,
				name: c.name,
				description: c.description,
				imgUrl: c.imgUrl,
				price: c.price,
				numUsers: c.users.length,
				numPassedUsers: c.passedUsers.length,
				rating: c.rating,
				evaluators: c.evaluators,
				active: c.active,
				langCode: c.langCode
			});
		}

		return { result: res };
	}

	/*
	*	@dev Get info about users in a course
	*/
	if (action.input.function === "getUsersFromMyCreatedCourse") {
		// Validate if user exists
		if (!Object.prototype.hasOwnProperty.call(state.users, _msgSender)) {
			throw new ContractError('User is not registered');
		}
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (typeof state.courses[action.input.courseId] === 'undefined') {
			throw new ContractError('Invalid courseId');
		}
		// Only owner (professor) can update the course
		// this helps to know if course should be listed or not in the UI
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);

		const course = state.course[action.input.courseId];
		const users = course.users.concat(course.passedUsers);
		const result = {
			users: course.users,
			passedUsers: course.passedUsers
		};

		return { result: result };
	}

	throw new ContractError('Invalid option!');
}


function _modifier_userAlreadyRegistered(_users, _msgSender)
{
	if (Object.prototype.hasOwnProperty.call(_users, _msgSender) && 
		 Object.keys(_users[_msgSender]).length > 0) {
		throw new ContractError('User already exists!');
	}
}

function _modifier_userMustBeRegistered(_users, _msgSender)
{
	if (!Object.prototype.hasOwnProperty.call(_users, _msgSender) || 
		  !Object.keys(_users[_msgSender]).length) {
		throw new ContractError('You must be registered to create a new course!');
	}
}

function _modifier_validateInputString(_s, _strName, _maxStrLen)
{
	if (typeof _s !== "string" || _s.length > _maxStrLen) {
		throw new ContractError(
			`${_strName} must be a string of less than ${_maxStrLen} characters`
		);
	}
}

function _modifier_validateInputNumber(_n, _nName)
{
	if (isNaN(_n) || !Number.isSafeInteger(_n)) {
		throw new ContractError(
			`${_nName} must be a number less than ${ Number.MAX_SAFE_INTEGER }`
		);
	}
}

function _modifier_onlyOwnerCanUpdateCourse(_course, _msgSender)
{
	if (_course.createdBy !== _msgSender) {
		throw new ContractError(`You are not the owner of this course!`);
	}
}

function _modifier_ownerOfCourseDetected(_course, _msgSender)
{
	if (_course.createdBy === _msgSender) {
		throw new ContractError(`You are the owner in this course!`);
	}
}